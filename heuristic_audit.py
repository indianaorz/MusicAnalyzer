import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def _load_json_file(path: Path, default):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return default


def _relative_path(path: Path, root: Path) -> str:
    try:
        return str(path.resolve().relative_to(root.resolve())).replace('\\', '/')
    except Exception:
        return path.name


def _normalized_label(label: object) -> str:
    if not isinstance(label, str):
        return ''
    return re.sub(r'[^a-z0-9]+', ' ', label.lower()).strip()


def _pattern_relation_tags(pattern: dict[str, object]) -> list[str]:
    tags: list[str] = []
    if pattern.get('isVariation'):
        tags.append('variation')
    if pattern.get('isRhythmicVariation'):
        tags.append('rhythmic_variation')
    if pattern.get('isRepetition'):
        tags.append('repetition')
    if pattern.get('variantOf') and not tags:
        tags.append('linked')
    children = pattern.get('children')
    if isinstance(children, list) and children:
        tags.append('has_children')
    if not tags:
        tags.append('canonical_or_untyped')
    return tags


def _pattern_preview(pattern: dict[str, object]) -> dict[str, object]:
    instruments = pattern.get('instruments')
    children = pattern.get('children')
    return {
        'id': pattern.get('id'),
        'name': pattern.get('name'),
        'parentId': pattern.get('parentId'),
        'variantOf': pattern.get('variantOf'),
        'variantOfName': pattern.get('variantOfName'),
        'relationTags': _pattern_relation_tags(pattern),
        'range': pattern.get('range'),
        'instrumentCount': len(instruments) if isinstance(instruments, list) else 0,
        'childCount': len(children) if isinstance(children, list) else 0,
    }


def summarize_settings_payload(payload: dict[str, object]) -> dict[str, object]:
    patterns = payload.get('patterns', [])
    if not isinstance(patterns, list):
        patterns = []

    pattern_field_counts = Counter()
    relationship_field_counts = Counter()
    relationship_type_counts = Counter()
    pattern_samples: list[dict[str, object]] = []

    for pattern in patterns:
        if not isinstance(pattern, dict):
            continue
        pattern_field_counts.update(pattern.keys())
        for rel_field in (
            'parentId',
            'children',
            'variantOf',
            'variantOfName',
            'isVariation',
            'isRhythmicVariation',
            'isRepetition',
        ):
            if rel_field in pattern:
                relationship_field_counts[rel_field] += 1
        relationship_type_counts.update(_pattern_relation_tags(pattern))
        if len(pattern_samples) < 80:
            pattern_samples.append(_pattern_preview(pattern))

    return {
        'title': payload.get('title'),
        'topLevelKeys': sorted(payload.keys()),
        'patternCount': len(patterns),
        'patternFieldCounts': dict(pattern_field_counts.most_common()),
        'relationshipFieldCounts': dict(relationship_field_counts.most_common()),
        'relationshipTypeCounts': dict(relationship_type_counts.most_common()),
        'patternSamples': pattern_samples,
    }


def summarize_dataset_payload(payload: object) -> dict[str, object]:
    if not isinstance(payload, dict):
        return {
            'topLevelKeys': [],
            'function': '',
            'transpose': None,
            'hasInput': False,
            'hasOutput': False,
            'inputLength': 0,
            'outputLength': 0,
        }

    input_text = payload.get('input')
    output_text = payload.get('output')
    return {
        'topLevelKeys': sorted(payload.keys()),
        'function': payload.get('function', ''),
        'transpose': payload.get('transpose'),
        'hasInput': isinstance(input_text, str) and bool(input_text.strip()),
        'hasOutput': isinstance(output_text, str) and bool(output_text.strip()),
        'inputLength': len(input_text) if isinstance(input_text, str) else 0,
        'outputLength': len(output_text) if isinstance(output_text, str) else 0,
    }


def build_heuristic_audit_snapshot(settings_dir: Path, data_root: Path, snapshot_path: Path | None = None) -> dict[str, object]:
    generated_at = datetime.now(timezone.utc).isoformat()
    settings_dir = settings_dir.resolve()
    data_root = data_root.resolve()

    settings_summary = {
        'fileCount': 0,
        'patternCount': 0,
        'songTitles': [],
        'topLevelKeyCounts': Counter(),
        'patternFieldCounts': Counter(),
        'relationshipFieldCounts': Counter(),
        'relationshipTypeCounts': Counter(),
        'labelVariantGroups': [],
    }
    dataset_summary = {
        'fileCount': 0,
        'categoryCounts': Counter(),
        'functionCounts': Counter(),
        'topLevelKeyCounts': Counter(),
        'songs': Counter(),
    }
    issues: list[dict[str, str]] = []
    items: list[dict[str, object]] = []
    label_groups: dict[str, set[str]] = {}

    if settings_dir.exists():
        for settings_file in sorted(settings_dir.glob('*.json')):
            payload = _load_json_file(settings_file, {})
            if not isinstance(payload, dict):
                issues.append({
                    'kind': 'settings',
                    'path': _relative_path(settings_file, settings_dir),
                    'message': 'Settings payload is not a JSON object.',
                })
                continue

            summary = summarize_settings_payload(payload)
            settings_summary['fileCount'] += 1
            settings_summary['patternCount'] += int(summary['patternCount'])
            settings_summary['topLevelKeyCounts'].update(summary['topLevelKeys'])
            settings_summary['patternFieldCounts'].update(summary['patternFieldCounts'])
            settings_summary['relationshipFieldCounts'].update(summary['relationshipFieldCounts'])
            settings_summary['relationshipTypeCounts'].update(summary['relationshipTypeCounts'])

            title = payload.get('title') or settings_file.stem
            if isinstance(title, str):
                settings_summary['songTitles'].append(title)

            patterns = payload.get('patterns', [])
            if isinstance(patterns, list):
                for pattern in patterns:
                    if not isinstance(pattern, dict):
                        continue
                    raw_name = pattern.get('name')
                    normalized = _normalized_label(raw_name)
                    if normalized:
                        label_groups.setdefault(normalized, set()).add(str(raw_name))

            items.append({
                'kind': 'settings',
                'label': str(title),
                'path': _relative_path(settings_file, settings_dir),
                'song': str(title),
                'category': 'pattern_graph',
                'patternCount': summary['patternCount'],
                'relationshipCount': sum(summary['relationshipTypeCounts'].values()),
                'topLevelKeys': summary['topLevelKeys'],
                'relationshipTypeCounts': summary['relationshipTypeCounts'],
            })

    if data_root.exists():
        for json_path in sorted(data_root.rglob('*.json')):
            payload = _load_json_file(json_path, None)
            if not isinstance(payload, dict):
                issues.append({
                    'kind': 'dataset',
                    'path': _relative_path(json_path, data_root),
                    'message': 'Dataset payload is not a JSON object.',
                })
                continue

            summary = summarize_dataset_payload(payload)
            dataset_summary['fileCount'] += 1
            dataset_summary['topLevelKeyCounts'].update(summary['topLevelKeys'])
            dataset_summary['categoryCounts'][json_path.parent.name] += 1
            if summary['function']:
                dataset_summary['functionCounts'][str(summary['function'])] += 1
            if len(json_path.parts) >= 3:
                dataset_summary['songs'][json_path.parts[-3]] += 1

            items.append({
                'kind': 'dataset',
                'label': f"{json_path.parts[-3]}/{json_path.parent.name}/{json_path.stem}",
                'path': _relative_path(json_path, data_root),
                'song': json_path.parts[-3],
                'category': json_path.parent.name,
                'function': summary['function'],
                'topLevelKeys': summary['topLevelKeys'],
            })

    label_variant_groups = []
    for normalized, raw_values in sorted(label_groups.items()):
        raw_list = sorted(raw_values)
        if len(raw_list) > 1:
            label_variant_groups.append({
                'normalized': normalized,
                'variants': raw_list,
                'variantCount': len(raw_list),
            })

    settings_summary['songTitles'] = sorted(set(settings_summary['songTitles']))
    settings_summary['labelVariantGroups'] = label_variant_groups[:20]

    snapshot = {
        'generatedAt': generated_at,
        'snapshotPath': str(snapshot_path) if snapshot_path else '',
        'summaryCards': {
            'settingsFileCount': settings_summary['fileCount'],
            'datasetFileCount': dataset_summary['fileCount'],
            'patternCount': settings_summary['patternCount'],
            'issueCount': len(issues),
        },
        'settings': {
            'fileCount': settings_summary['fileCount'],
            'patternCount': settings_summary['patternCount'],
            'songCount': len(settings_summary['songTitles']),
            'topLevelKeyCounts': dict(settings_summary['topLevelKeyCounts'].most_common()),
            'patternFieldCounts': dict(settings_summary['patternFieldCounts'].most_common()),
            'relationshipFieldCounts': dict(settings_summary['relationshipFieldCounts'].most_common()),
            'relationshipTypeCounts': dict(settings_summary['relationshipTypeCounts'].most_common()),
            'labelVariantGroups': settings_summary['labelVariantGroups'],
        },
        'dataset': {
            'fileCount': dataset_summary['fileCount'],
            'songCount': len(dataset_summary['songs']),
            'categoryCounts': dict(dataset_summary['categoryCounts'].most_common()),
            'functionCounts': dict(dataset_summary['functionCounts'].most_common()),
            'topLevelKeyCounts': dict(dataset_summary['topLevelKeyCounts'].most_common()),
        },
        'issues': issues[:200],
        'items': sorted(items, key=lambda item: (item.get('kind', ''), str(item.get('label', '')).lower())),
    }

    if snapshot_path:
        snapshot_path.parent.mkdir(parents=True, exist_ok=True)
        snapshot_path.write_text(json.dumps(snapshot, indent=2), encoding='utf-8')

    return snapshot


def _resolve_audit_source(kind: str, rel_path: str, settings_dir: Path, data_root: Path) -> Path:
    root = settings_dir.resolve() if kind == 'settings' else data_root.resolve()
    wanted = (root / rel_path).resolve()
    wanted.relative_to(root)
    return wanted


def build_heuristic_audit_source_detail(kind: str, rel_path: str, settings_dir: Path, data_root: Path) -> dict[str, object]:
    source_path = _resolve_audit_source(kind, rel_path, settings_dir, data_root)
    if not source_path.exists() or not source_path.is_file():
        raise FileNotFoundError(rel_path)

    payload = _load_json_file(source_path, None)
    if payload is None:
        raise FileNotFoundError(rel_path)

    if kind == 'settings':
        summary = summarize_settings_payload(payload if isinstance(payload, dict) else {})
    else:
        summary = summarize_dataset_payload(payload)

    return {
        'kind': kind,
        'path': rel_path,
        'fullPath': str(source_path),
        'summary': summary,
        'rawPayload': payload,
    }
