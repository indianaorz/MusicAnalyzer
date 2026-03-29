import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


EXPORT_VERSION = 1


def _load_json_file(path: Path, default):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return default


def _slugify(value: str) -> str:
    return re.sub(r'[^\w\- ]+', '', value).strip().replace(' ', '_').lower()[:80] or 'untitled'


def _relative_path(path: Path, root: Path) -> str:
    try:
        return str(path.resolve().relative_to(root.resolve())).replace('\\', '/')
    except Exception:
        return path.name


def _normalized_label(label: object) -> str:
    if not isinstance(label, str):
        return ''
    return re.sub(r'[^a-z0-9]+', ' ', label.lower()).strip()


def _coerce_title(value: object, fallback: str) -> str:
    if not isinstance(value, str):
        return fallback

    cleaned = value.strip()
    if not cleaned:
        return fallback

    if cleaned.startswith('<built-in method title of str object at 0x'):
        return fallback

    return cleaned


def _relation_tags(pattern: dict[str, object]) -> list[str]:
    tags: list[str] = []
    if pattern.get('isVariation'):
        tags.append('variation')
    if pattern.get('isRhythmicVariation'):
        tags.append('rhythmic_variation')
    if pattern.get('isRepetition'):
        tags.append('repetition')
    if pattern.get('isSimplification'):
        tags.append('simplification')
    if pattern.get('variantOf') and not tags:
        tags.append('linked')
    if isinstance(pattern.get('children'), list) and pattern.get('children'):
        tags.append('container')
    else:
        tags.append('leaf')
    return tags


def _build_pattern_depth(pattern_id: str, by_id: dict[str, dict[str, object]]) -> int:
    depth = 0
    seen = set()
    current = by_id.get(pattern_id)
    while current and current.get('parentId') and current.get('parentId') in by_id and current.get('parentId') not in seen:
        seen.add(current['parentId'])
        depth += 1
        current = by_id.get(current['parentId'])
    return depth


def _build_collection_type(pattern: dict[str, object]) -> str:
    parent_id = pattern.get('parentId')
    if parent_id is None:
        return 'root_collection'
    if parent_id == 'root':
        return 'top_level_section'
    return 'pattern_group'


def build_heuristic_song_export(settings_path: Path) -> dict[str, object]:
    payload = _load_json_file(settings_path, {})
    if not isinstance(payload, dict):
        raise ValueError(f'Invalid settings payload: {settings_path}')

    title = _coerce_title(payload.get('title'), settings_path.stem)
    song_id = _slugify(str(title))
    raw_patterns = payload.get('patterns', [])
    if not isinstance(raw_patterns, list):
        raw_patterns = []

    by_id: dict[str, dict[str, object]] = {}
    child_index: dict[str, list[str]] = {}
    issues: list[dict[str, str]] = []

    for pattern in raw_patterns:
        if not isinstance(pattern, dict):
            issues.append({'kind': 'pattern', 'message': 'Encountered non-object pattern entry.'})
            continue
        pattern_id = pattern.get('id')
        if not isinstance(pattern_id, str) or not pattern_id:
            issues.append({'kind': 'pattern', 'message': 'Encountered pattern without a valid id.'})
            continue
        by_id[pattern_id] = pattern
        child_index[pattern_id] = []

    for pattern in by_id.values():
        parent_id = pattern.get('parentId')
        if isinstance(parent_id, str) and parent_id in child_index:
            child_index[parent_id].append(pattern['id'])

    exported_patterns: list[dict[str, object]] = []
    relationships: list[dict[str, object]] = []
    collection_candidates: list[dict[str, object]] = []
    label_groups: dict[str, set[str]] = {}
    relationship_type_counts = Counter()

    for pattern_id, pattern in by_id.items():
        name = pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id
        normalized_name = _normalized_label(name)
        if normalized_name:
            label_groups.setdefault(normalized_name, set()).add(name)

        child_ids = [child_id for child_id in child_index.get(pattern_id, []) if child_id in by_id]
        relation_tags = _relation_tags(pattern)
        relationship_type_counts.update(tag for tag in relation_tags if tag not in ('container', 'leaf'))

        exported_pattern = {
            'id': pattern_id,
            'name': name,
            'normalizedName': normalized_name,
            'parentId': pattern.get('parentId'),
            'children': child_ids,
            'depth': _build_pattern_depth(pattern_id, by_id),
            'range': pattern.get('range'),
            'instruments': pattern.get('instruments', []),
            'instrumentCount': len(pattern.get('instruments', [])) if isinstance(pattern.get('instruments'), list) else 0,
            'mode': pattern.get('mode'),
            'variantOf': pattern.get('variantOf'),
            'variantOfName': pattern.get('variantOfName'),
            'flags': {
                'isVariation': bool(pattern.get('isVariation')),
                'isRhythmicVariation': bool(pattern.get('isRhythmicVariation')),
                'isRepetition': bool(pattern.get('isRepetition')),
                'isSimplification': bool(pattern.get('isSimplification')),
            },
            'relationTags': relation_tags,
            'sourceRef': {
                'settingsPath': settings_path.name,
                'patternId': pattern_id,
            },
            'raw': pattern,
        }
        exported_patterns.append(exported_pattern)

        for child_id in child_ids:
            relationships.append({
                'type': 'parent_child',
                'from': pattern_id,
                'to': child_id,
            })

        if pattern.get('variantOf'):
            rel_type = 'variation'
            if pattern.get('isRhythmicVariation'):
                rel_type = 'rhythmic_variation'
            elif pattern.get('isRepetition'):
                rel_type = 'repetition'
            elif pattern.get('isSimplification'):
                rel_type = 'simplification'
            relationships.append({
                'type': rel_type,
                'from': pattern.get('variantOf'),
                'to': pattern_id,
                'label': pattern.get('variantOfName'),
            })

        if child_ids:
            collection_candidates.append({
                'id': f'collection:{pattern_id}',
                'name': name,
                'sourcePatternId': pattern_id,
                'parentPatternId': pattern.get('parentId'),
                'memberPatternIds': child_ids,
                'collectionType': _build_collection_type(pattern),
            })

    label_variant_groups = []
    for normalized_name, raw_values in sorted(label_groups.items()):
        raw_list = sorted(raw_values)
        if len(raw_list) > 1:
            label_variant_groups.append({
                'normalized': normalized_name,
                'variants': raw_list,
                'variantCount': len(raw_list),
            })

    collection_type_counts = Counter(candidate['collectionType'] for candidate in collection_candidates)

    return {
        'exportVersion': EXPORT_VERSION,
        'songId': song_id,
        'title': title,
        'source': {
            'type': 'user_settings',
            'path': settings_path.name,
        },
        'globalContext': {
            'root': payload.get('root'),
            'scale': payload.get('scale'),
            'copyMode': payload.get('copyMode'),
            'snapMode': payload.get('snapMode'),
            'harmony': payload.get('harmony'),
            'bpm': payload.get('bpm'),
        },
        'patterns': sorted(exported_patterns, key=lambda pattern: (pattern['depth'], pattern['name'].lower(), pattern['id'])),
        'relationships': relationships,
        'collectionCandidates': collection_candidates,
        'summary': {
            'patternCount': len(exported_patterns),
            'relationshipCount': len(relationships),
            'collectionCount': len(collection_candidates),
            'rootPatternCount': sum(1 for pattern in exported_patterns if not pattern.get('parentId')),
            'leafPatternCount': sum(1 for pattern in exported_patterns if not pattern.get('children')),
            'relationshipTypeCounts': dict(relationship_type_counts.most_common()),
            'collectionTypeCounts': dict(collection_type_counts.most_common()),
            'labelVariantGroups': label_variant_groups[:20],
            'issueCount': len(issues),
        },
        'issues': issues,
    }


def build_heuristic_export_snapshot(settings_dir: Path, export_root: Path, snapshot_path: Path) -> dict[str, object]:
    generated_at = datetime.now(timezone.utc).isoformat()
    settings_dir = settings_dir.resolve()
    export_root = export_root.resolve()
    songs_root = export_root / 'songs'
    songs_root.mkdir(parents=True, exist_ok=True)

    items: list[dict[str, object]] = []
    issues: list[dict[str, str]] = []
    relationship_type_counts = Counter()
    collection_type_counts = Counter()
    label_variant_groups: list[dict[str, object]] = []
    total_patterns = 0
    total_relationships = 0
    total_collections = 0

    for settings_file in sorted(settings_dir.glob('*.json')):
        try:
            song_export = build_heuristic_song_export(settings_file)
        except Exception as exc:
            issues.append({
                'kind': 'settings_export',
                'path': _relative_path(settings_file, settings_dir),
                'message': str(exc),
            })
            continue

        song_path = songs_root / f"{song_export['songId']}.json"
        song_path.write_text(json.dumps(song_export, indent=2), encoding='utf-8')

        summary = song_export['summary']
        total_patterns += int(summary['patternCount'])
        total_relationships += int(summary['relationshipCount'])
        total_collections += int(summary['collectionCount'])
        relationship_type_counts.update(summary.get('relationshipTypeCounts', {}))
        collection_type_counts.update(summary.get('collectionTypeCounts', {}))
        label_variant_groups.extend(summary.get('labelVariantGroups', []))
        issues.extend(song_export.get('issues', []))

        items.append({
            'songId': song_export['songId'],
            'label': song_export['title'],
            'path': _relative_path(song_path, export_root),
            'sourcePath': song_export['source']['path'],
            'patternCount': summary['patternCount'],
            'relationshipCount': summary['relationshipCount'],
            'collectionCount': summary['collectionCount'],
        })

    snapshot = {
        'generatedAt': generated_at,
        'exportPath': str(snapshot_path),
        'summaryCards': {
            'songCount': len(items),
            'patternCount': total_patterns,
            'relationshipCount': total_relationships,
            'collectionCount': total_collections,
        },
        'relationshipTypeCounts': dict(relationship_type_counts.most_common()),
        'collectionTypeCounts': dict(collection_type_counts.most_common()),
        'labelVariantGroups': label_variant_groups[:20],
        'issues': issues[:200],
        'items': sorted(items, key=lambda item: item['label'].lower()),
    }

    snapshot_path.parent.mkdir(parents=True, exist_ok=True)
    snapshot_path.write_text(json.dumps(snapshot, indent=2), encoding='utf-8')
    return snapshot


def build_heuristic_export_source_detail(rel_path: str, export_root: Path) -> dict[str, object]:
    export_root = export_root.resolve()
    source_path = (export_root / rel_path).resolve()
    source_path.relative_to(export_root)
    if not source_path.exists() or not source_path.is_file():
        raise FileNotFoundError(rel_path)

    payload = _load_json_file(source_path, None)
    if not isinstance(payload, dict):
        raise FileNotFoundError(rel_path)

    return {
        'path': rel_path,
        'fullPath': str(source_path),
        'summary': payload.get('summary', {}),
        'rawPayload': payload,
    }
