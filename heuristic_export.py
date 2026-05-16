import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


EXPORT_VERSION = 3
SCHEMA_VERSION = 'heuristic-song-export/v3'


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


def _contains_any(value: str, needles: tuple[str, ...] | list[str] | set[str]) -> bool:
    return any(needle in value for needle in needles)


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


def _is_generic_reuse_label(normalized_name: str) -> bool:
    if not normalized_name:
        return True

    generic_labels = {
        'drums',
        'percussion',
        'fill',
        'intro',
        'outro',
        'end',
        'ending',
        'hats',
        'hat',
        'kick',
        'kick snare',
        'snare',
        'cymbal',
    }
    return normalized_name in generic_labels


def _build_reuse_signature(
    pattern_id: str,
    pattern: dict[str, object],
    normalized_name: str,
    ordered_children: dict[str, list[str]],
    by_id: dict[str, dict[str, object]],
) -> tuple[object, ...] | None:
    if _is_generic_reuse_label(normalized_name):
        return None
    if pattern.get('variantOf') or pattern.get('isVariation') or pattern.get('isRhythmicVariation') or pattern.get('isRepetition') or pattern.get('isSimplification'):
        return None

    instruments = tuple(sorted(pattern.get('instruments', []))) if isinstance(pattern.get('instruments'), list) else tuple()
    children = ordered_children.get(pattern_id, [])
    return (
        normalized_name,
        instruments,
        len(children),
        _build_pattern_depth(pattern_id, by_id),
        pattern.get('mode'),
    )


def _ordered_child_ids(
    pattern_id: str,
    pattern: dict[str, object],
    child_index: dict[str, list[str]],
    source_order: dict[str, int],
) -> list[str]:
    ordered: list[str] = []
    seen: set[str] = set()

    raw_children = pattern.get('children')
    if isinstance(raw_children, list):
        for child_id in raw_children:
            if isinstance(child_id, str) and child_id in child_index and child_id not in seen:
                ordered.append(child_id)
                seen.add(child_id)

    for child_id in sorted(child_index.get(pattern_id, []), key=lambda value: source_order.get(value, 10**9)):
        if child_id not in seen:
            ordered.append(child_id)
            seen.add(child_id)

    return ordered


def _resolve_canonical_id(pattern_id: str, by_id: dict[str, dict[str, object]]) -> str:
    current_id = pattern_id
    seen: set[str] = set()

    while current_id in by_id and current_id not in seen:
        seen.add(current_id)
        variant_of = by_id[current_id].get('variantOf')
        if not isinstance(variant_of, str) or variant_of not in by_id:
            break
        current_id = variant_of

    return current_id if current_id in by_id else pattern_id


def _classify_material_role(
    pattern: dict[str, object],
    canonical_id: str,
    seen_canonical_ids: set[str],
    is_root: bool,
) -> str:
    if is_root:
        return 'song_root'
    if pattern.get('isSimplification'):
        return 'simplification'
    if pattern.get('isRhythmicVariation'):
        return 'rhythmic_variation'
    if pattern.get('isVariation'):
        return 'variation'
    if pattern.get('isRepetition'):
        return 'repetition'
    if pattern.get('variantOf'):
        return 'linked_derivation'
    if canonical_id in seen_canonical_ids:
        return 'canonical_reuse'
    return 'new_material'


def _build_traversal_entries(
    by_id: dict[str, dict[str, object]],
    ordered_children: dict[str, list[str]],
    source_order: dict[str, int],
) -> list[dict[str, object]]:
    roots = [
        pattern_id
        for pattern_id, pattern in by_id.items()
        if not isinstance(pattern.get('parentId'), str) or pattern.get('parentId') not in by_id
    ]
    roots.sort(key=lambda value: source_order.get(value, 10**9))

    traversal: list[dict[str, object]] = []
    seen: set[str] = set()

    def walk(pattern_id: str, parent_id: str | None, depth: int, order_path: list[int]):
        if pattern_id in seen or pattern_id not in by_id:
            return
        seen.add(pattern_id)
        traversal.append({
            'patternId': pattern_id,
            'parentPatternId': parent_id,
            'depth': depth,
            'orderPath': order_path[:],
        })
        for child_index_value, child_id in enumerate(ordered_children.get(pattern_id, [])):
            walk(child_id, pattern_id, depth + 1, order_path + [child_index_value])

    for root_index, root_id in enumerate(roots):
        walk(root_id, None, 0, [root_index])

    for pattern_id in sorted(by_id.keys(), key=lambda value: source_order.get(value, 10**9)):
        if pattern_id not in seen:
            walk(pattern_id, None, 0, [len(traversal)])

    return traversal


def _resolve_explicit_variation_root(pattern_id: str, by_id: dict[str, dict[str, object]]) -> str | None:
    current_id = pattern_id
    seen: set[str] = set()

    while current_id in by_id and current_id not in seen:
        seen.add(current_id)
        variant_of = by_id[current_id].get('variantOf')
        if not isinstance(variant_of, str) or variant_of not in by_id:
            break
        current_id = variant_of

    return current_id if current_id != pattern_id else None


def _find_ancestor_in_set(pattern_id: str, by_id: dict[str, dict[str, object]], target_ids: set[str]) -> str | None:
    current_id = pattern_id
    seen: set[str] = set()

    while current_id in by_id and current_id not in seen:
        seen.add(current_id)
        if current_id in target_ids:
            return current_id
        parent_id = by_id[current_id].get('parentId')
        if not isinstance(parent_id, str) or parent_id not in by_id:
            return None
        current_id = parent_id

    return None


def _build_section_signature(
    pattern_id: str,
    by_id: dict[str, dict[str, object]],
    ordered_children: dict[str, list[str]],
) -> tuple[str, ...]:
    signature: list[str] = []
    for child_id in ordered_children.get(pattern_id, []):
        child = by_id.get(child_id)
        if not child:
            continue
        normalized_name = _normalized_label(child.get('name') if isinstance(child.get('name'), str) else child_id) or child_id
        signature.append(normalized_name)
    return tuple(signature)


def _signature_overlap(left: tuple[str, ...], right: tuple[str, ...]) -> float:
    left_set = set(left)
    right_set = set(right)
    if not left_set or not right_set:
        return 0.0
    return len(left_set & right_set) / max(len(left_set | right_set), 1)


def _derive_section_purpose(normalized_name: str, order_index: int) -> str | None:
    if not normalized_name:
        return None
    if _contains_any(normalized_name, ('drop in', 'dropin', 'intro', 'opening')):
        return 'intro'
    if _contains_any(normalized_name, ('build up', 'build', 'transition', 'rise')):
        return 'build_up'
    if _contains_any(normalized_name, ('break down', 'breakdown', 'descent')):
        return 'break_down'
    if _contains_any(normalized_name, ('climax', 'finale', 'release')):
        return 'climax'
    if 'return' in normalized_name:
        return 'return'
    if _contains_any(normalized_name, ('main theme', 'theme', 'anthem', 'main')) or normalized_name.startswith('part a') or order_index == 0:
        return 'main_theme'
    return None


def _looks_instrumental_label(normalized_name: str) -> bool:
    return _contains_any(normalized_name, (
        'drum', 'perc', 'hat', 'cymbal', 'bass', 'string', 'brass', 'guitar',
        'pad', 'synth', 'organ', 'tom', 'arp', 'arpeggio', 'vibraphone', 'hit',
    ))


def _is_motifish_label(normalized_name: str) -> bool:
    return _contains_any(normalized_name, (
        'motif', 'theme', 'riff', 'solo', 'melody', 'main', 'call', 'response',
        'answer', 'return', 'pattern', 'phrase',
    ))


def _derive_pattern_subsection_function(
    pattern: dict[str, object],
    normalized_name: str,
    has_children: bool,
) -> str | None:
    if not normalized_name:
        return None
    if 'fill' in normalized_name:
        return 'fill'
    if 'call' in normalized_name:
        return 'call'
    if _contains_any(normalized_name, ('response', 'answer')):
        return 'response'
    if pattern.get('variantOf') or pattern.get('isVariation') or pattern.get('isRhythmicVariation') or pattern.get('isRepetition') or pattern.get('isSimplification'):
        if _is_motifish_label(normalized_name):
            return 'motif_variation'
    if _contains_any(normalized_name, ('loop', 'groove', 'progression', 'prog')):
        return 'loop'
    if _is_motifish_label(normalized_name):
        return 'motif_seed'
    if has_children and _looks_instrumental_label(normalized_name):
        return 'loop'
    return None


def _derive_container_kind(
    primitive_type: str,
    normalized_name: str,
    subsection_function: str | None,
) -> str | None:
    if primitive_type == 'complete_song' or primitive_type == 'section_container':
        return 'structural'
    if primitive_type != 'subsection_container':
        return None
    if subsection_function in {'call', 'response', 'motif_seed', 'motif_variation'}:
        return 'mixed'
    if _looks_instrumental_label(normalized_name):
        return 'orchestration_layer'
    return 'mixed'


def _derive_reduction_lineage(
    primitive_type: str,
    depth: int,
    container_kind: str | None,
    subsection_function: str | None,
) -> list[str]:
    if primitive_type == 'complete_song':
        return ['song']
    if primitive_type == 'section_container':
        return ['song', 'section']
    if primitive_type == 'subsection_container':
        lineage = ['song', 'section', 'subsection']
        if container_kind == 'orchestration_layer':
            lineage.append('instrument_slice')
        elif subsection_function in {'call', 'response', 'motif_seed', 'motif_variation'} or container_kind == 'mixed':
            lineage.append('motif_slice')
        return lineage

    lineage = ['song']
    if depth >= 1:
        lineage.append('section')
    if depth >= 2:
        lineage.append('subsection')
    if subsection_function in {'call', 'response', 'motif_seed', 'motif_variation'} or depth >= 3:
        lineage.append('motif_slice')
    lineage.append('leaf')
    return lineage


def _build_section_family_maps(
    song_id: str,
    section_ids: list[str],
    by_id: dict[str, dict[str, object]],
    ordered_children: dict[str, list[str]],
) -> tuple[dict[str, str | None], dict[str, str | None], dict[str, str | None], dict[str, str | None], list[dict[str, object]]]:
    section_family_id_by_pattern: dict[str, str | None] = {}
    section_family_mode_by_pattern: dict[str, str | None] = {}
    section_purpose_by_pattern: dict[str, str | None] = {}
    section_skeleton_id_by_pattern: dict[str, str | None] = {}
    section_family_records: dict[str, dict[str, object]] = {}
    section_signature_by_pattern: dict[str, tuple[str, ...]] = {}
    exact_signature_to_family_id: dict[tuple[str, ...], str] = {}
    exact_signature_to_skeleton_id: dict[tuple[str, ...], str] = {}
    family_sequence = 0
    skeleton_sequence = 0

    for order_index, pattern_id in enumerate(section_ids):
        pattern = by_id.get(pattern_id)
        if not pattern:
            continue

        normalized_name = _normalized_label(pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id)
        signature = _build_section_signature(pattern_id, by_id, ordered_children)
        section_signature_by_pattern[pattern_id] = signature
        section_purpose_by_pattern[pattern_id] = _derive_section_purpose(normalized_name, order_index)

        explicit_variant_root = pattern.get('variantOf') if isinstance(pattern.get('variantOf'), str) and pattern.get('variantOf') in by_id else None
        family_id: str
        family_mode: str

        if explicit_variant_root and explicit_variant_root in section_family_id_by_pattern and section_family_id_by_pattern[explicit_variant_root]:
            family_id = str(section_family_id_by_pattern[explicit_variant_root])
            family_mode = 'direct_variation'
        elif signature in exact_signature_to_family_id:
            family_id = exact_signature_to_family_id[signature]
            family_mode = 'skeleton_reuse'
        else:
            best_match_id: str | None = None
            best_overlap = 0.0
            for prior_id in section_ids[:order_index]:
                prior_signature = section_signature_by_pattern.get(prior_id, tuple())
                overlap = _signature_overlap(signature, prior_signature)
                if overlap > best_overlap:
                    best_overlap = overlap
                    best_match_id = prior_id

            if best_match_id and best_overlap >= 0.6:
                family_id = str(section_family_id_by_pattern[best_match_id])
                family_mode = 'skeleton_reuse_with_modification'
            else:
                family_sequence += 1
                family_id = f'section-family:{song_id}:{family_sequence}'
                family_mode = 'new'

        if signature in exact_signature_to_skeleton_id:
            section_skeleton_id = exact_signature_to_skeleton_id[signature]
        else:
            skeleton_sequence += 1
            section_skeleton_id = f'section-skeleton:{song_id}:{skeleton_sequence}'
            exact_signature_to_skeleton_id[signature] = section_skeleton_id

        section_family_id_by_pattern[pattern_id] = family_id
        section_family_mode_by_pattern[pattern_id] = family_mode
        section_skeleton_id_by_pattern[pattern_id] = section_skeleton_id
        exact_signature_to_family_id.setdefault(signature, family_id)

        if family_id not in section_family_records:
            section_family_records[family_id] = {
                'id': family_id,
                'sectionPatternIds': [],
                'sectionNames': [],
                'sectionFamilyMode': family_mode,
                'sectionPurpose': section_purpose_by_pattern[pattern_id],
                'sectionSkeletonIds': [],
            }

        section_family_records[family_id]['sectionPatternIds'].append(pattern_id)
        section_family_records[family_id]['sectionNames'].append(pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id)
        if section_skeleton_id not in section_family_records[family_id]['sectionSkeletonIds']:
            section_family_records[family_id]['sectionSkeletonIds'].append(section_skeleton_id)
        if family_mode != 'new':
            section_family_records[family_id]['sectionFamilyMode'] = family_mode

    return (
        section_family_id_by_pattern,
        section_family_mode_by_pattern,
        section_purpose_by_pattern,
        section_skeleton_id_by_pattern,
        list(section_family_records.values()),
    )


def _build_variation_family_maps(
    song_id: str,
    by_id: dict[str, dict[str, object]],
) -> tuple[dict[str, str | None], list[dict[str, object]]]:
    reverse_variant_index: dict[str, list[str]] = defaultdict(list)
    variation_family_id_by_pattern: dict[str, str | None] = {}
    variation_family_records: dict[str, dict[str, object]] = {}

    for pattern_id, pattern in by_id.items():
        variant_of = pattern.get('variantOf')
        if isinstance(variant_of, str) and variant_of in by_id:
            reverse_variant_index[variant_of].append(pattern_id)

    for pattern_id in by_id:
        explicit_root = _resolve_explicit_variation_root(pattern_id, by_id)
        family_root = explicit_root or (pattern_id if pattern_id in reverse_variant_index else None)
        if family_root is None:
            variation_family_id_by_pattern[pattern_id] = None
            continue

        family_id = f'variation-family:{song_id}:{family_root}'
        variation_family_id_by_pattern[pattern_id] = family_id
        variation_family_records.setdefault(family_id, {
            'id': family_id,
            'rootPatternId': family_root,
            'memberPatternIds': [],
        })
        variation_family_records[family_id]['memberPatternIds'].append(pattern_id)

    return variation_family_id_by_pattern, list(variation_family_records.values())


def _build_call_response_groups(
    song_id: str,
    by_id: dict[str, dict[str, object]],
    ordered_children: dict[str, list[str]],
) -> tuple[dict[str, str | None], list[dict[str, object]]]:
    call_response_group_by_pattern: dict[str, str | None] = {}
    groups: list[dict[str, object]] = []

    for parent_id, child_ids in ordered_children.items():
        call_ids: list[str] = []
        response_ids: list[str] = []
        for child_id in child_ids:
            child = by_id.get(child_id)
            if not child:
                continue
            normalized_name = _normalized_label(child.get('name') if isinstance(child.get('name'), str) else child_id)
            if 'call' in normalized_name:
                call_ids.append(child_id)
            if _contains_any(normalized_name, ('response', 'answer')):
                response_ids.append(child_id)

        if not call_ids or not response_ids:
            continue

        group_id = f'call-response:{song_id}:{parent_id}'
        member_ids = call_ids + response_ids
        groups.append({
            'id': group_id,
            'parentPatternId': parent_id,
            'memberPatternIds': member_ids,
        })
        for member_id in member_ids:
            call_response_group_by_pattern[member_id] = group_id

    return call_response_group_by_pattern, groups


def _build_section_asset_manifests(
    section_ids: list[str],
    by_id: dict[str, dict[str, object]],
    ordered_children: dict[str, list[str]],
    subsection_function_by_pattern: dict[str, str | None],
    section_purpose_by_pattern: dict[str, str | None],
) -> list[dict[str, object]]:
    manifests: list[dict[str, object]] = []

    for section_id in section_ids:
        pattern = by_id.get(section_id)
        if not pattern:
            continue
        child_ids = ordered_children.get(section_id, [])
        child_labels = [
            child.get('name') if isinstance(child.get('name'), str) else child_id
            for child_id in child_ids
            if (child := by_id.get(child_id))
        ]
        child_normalized_names = [
            _normalized_label(child.get('name') if isinstance(child.get('name'), str) else child_id) or child_id
            for child_id in child_ids
            if (child := by_id.get(child_id))
        ]
        child_functions = [subsection_function_by_pattern.get(child_id) for child_id in child_ids]

        manifests.append({
            'sectionPatternId': section_id,
            'sectionName': pattern.get('name') if isinstance(pattern.get('name'), str) else section_id,
            'sectionPurpose': section_purpose_by_pattern.get(section_id),
            'assetCount': len(child_ids),
            'assetPatternIds': child_ids,
            'assetLabels': child_labels,
            'assetNormalizedLabels': child_normalized_names,
            'loopAssetCount': sum(1 for value in child_functions if value == 'loop'),
            'fillAssetCount': sum(1 for value in child_functions if value == 'fill'),
            'callResponseAssetCount': sum(1 for value in child_functions if value in ('call', 'response')),
            'motifAssetCount': sum(1 for value in child_functions if value in ('motif_seed', 'motif_variation')),
        })

    return manifests


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
    source_order: dict[str, int] = {}
    issues: list[dict[str, str]] = []

    for pattern_index, pattern in enumerate(raw_patterns):
        if not isinstance(pattern, dict):
            issues.append({'kind': 'pattern', 'message': 'Encountered non-object pattern entry.'})
            continue
        pattern_id = pattern.get('id')
        if not isinstance(pattern_id, str) or not pattern_id:
            issues.append({'kind': 'pattern', 'message': 'Encountered pattern without a valid id.'})
            continue
        by_id[pattern_id] = pattern
        child_index[pattern_id] = []
        source_order[pattern_id] = pattern_index

    for pattern in by_id.values():
        parent_id = pattern.get('parentId')
        if isinstance(parent_id, str) and parent_id in child_index:
            child_index[parent_id].append(pattern['id'])

    ordered_children = {
        pattern_id: _ordered_child_ids(pattern_id, pattern, child_index, source_order)
        for pattern_id, pattern in by_id.items()
    }
    traversal_entries = _build_traversal_entries(by_id, ordered_children, source_order)
    canonical_id_by_pattern: dict[str, str] = {}
    reuse_seed_by_signature: dict[tuple[object, ...], str] = {}

    for entry in traversal_entries:
        pattern_id = str(entry['patternId'])
        pattern = by_id[pattern_id]
        explicit_canonical_id = _resolve_canonical_id(pattern_id, by_id)
        if explicit_canonical_id != pattern_id:
            canonical_id_by_pattern[pattern_id] = explicit_canonical_id
            continue

        name = pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id
        normalized_name = _normalized_label(name)
        reuse_signature = _build_reuse_signature(pattern_id, pattern, normalized_name, ordered_children, by_id)
        if reuse_signature and reuse_signature in reuse_seed_by_signature:
            canonical_id_by_pattern[pattern_id] = reuse_seed_by_signature[reuse_signature]
        else:
            canonical_id_by_pattern[pattern_id] = pattern_id
            if reuse_signature:
                reuse_seed_by_signature[reuse_signature] = pattern_id

    root_pattern_ids = [
        str(entry['patternId'])
        for entry in traversal_entries
        if entry['parentPatternId'] is None
    ]
    primary_root_id = 'root' if 'root' in by_id else (root_pattern_ids[0] if root_pattern_ids else None)

    section_ids: list[str] = []
    seen_section_ids: set[str] = set()
    for root_pattern_id in root_pattern_ids:
        root_children = ordered_children.get(root_pattern_id, [])
        candidate_ids = root_children if root_children else [root_pattern_id]
        for candidate_id in candidate_ids:
            if candidate_id not in seen_section_ids:
                section_ids.append(candidate_id)
                seen_section_ids.add(candidate_id)
    if primary_root_id and primary_root_id in seen_section_ids:
        section_ids = [pattern_id for pattern_id in section_ids if pattern_id != primary_root_id]
        seen_section_ids.discard(primary_root_id)

    section_ids_set = set(section_ids)
    subsection_root_ids = [
        pattern_id
        for pattern_id, pattern in by_id.items()
        if isinstance(pattern.get('parentId'), str) and pattern.get('parentId') in section_ids_set
    ]
    subsection_root_ids_set = set(subsection_root_ids)
    subsection_root_by_pattern: dict[str, str | None] = {}
    for pattern_id in by_id:
        subsection_root_by_pattern[pattern_id] = _find_ancestor_in_set(pattern_id, by_id, subsection_root_ids_set)

    (
        section_family_id_by_pattern,
        section_family_mode_by_pattern,
        section_purpose_by_pattern,
        section_skeleton_id_by_pattern,
        section_family_records,
    ) = _build_section_family_maps(song_id, section_ids, by_id, ordered_children)
    variation_family_id_by_pattern, variation_family_records = _build_variation_family_maps(song_id, by_id)
    call_response_group_by_pattern, call_response_groups = _build_call_response_groups(song_id, by_id, ordered_children)

    subsection_function_by_pattern: dict[str, str | None] = {}
    primitive_type_by_pattern: dict[str, str] = {}
    container_kind_by_pattern: dict[str, str | None] = {}
    reduction_lineage_by_pattern: dict[str, list[str]] = {}
    loop_policy_by_pattern: dict[str, str] = {}
    subsection_skeleton_id_by_pattern: dict[str, str | None] = {}
    explicit_subsection_roots: set[str] = set(subsection_root_ids)
    subsection_signature_to_skeleton_id: dict[tuple[str, ...], str] = {}
    subsection_root_to_skeleton_id: dict[str, str] = {}
    subsection_skeleton_sequence = 0

    for entry in traversal_entries:
        pattern_id = str(entry['patternId'])
        pattern = by_id[pattern_id]
        child_ids = ordered_children.get(pattern_id, [])
        normalized_name = _normalized_label(pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id)
        has_children = bool(child_ids)

        if pattern_id == primary_root_id:
            primitive_type = 'complete_song'
        elif pattern_id in section_ids_set:
            primitive_type = 'section_container' if has_children else 'leaf_pattern'
        elif has_children:
            primitive_type = 'subsection_container'
        else:
            primitive_type = 'leaf_pattern'

        subsection_function = _derive_pattern_subsection_function(pattern, normalized_name, has_children)
        container_kind = _derive_container_kind(primitive_type, normalized_name, subsection_function)
        reduction_lineage = _derive_reduction_lineage(primitive_type, int(entry['depth']), container_kind, subsection_function)

        primitive_type_by_pattern[pattern_id] = primitive_type
        subsection_function_by_pattern[pattern_id] = subsection_function
        container_kind_by_pattern[pattern_id] = container_kind
        reduction_lineage_by_pattern[pattern_id] = reduction_lineage

    for pattern_id in by_id:
        pattern = by_id[pattern_id]
        child_ids = ordered_children.get(pattern_id, [])
        child_functions = [subsection_function_by_pattern.get(child_id) for child_id in child_ids]
        normalized_name = _normalized_label(pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id)

        if subsection_function_by_pattern.get(pattern_id) == 'loop':
            loop_policy = 'loop'
        elif child_ids and 'loop' in child_functions and 'fill' in child_functions:
            loop_policy = 'loop_with_fill'
        elif primitive_type_by_pattern.get(pattern_id) == 'section_container' and _contains_any(normalized_name, ('intro', 'drop in', 'dropin')):
            loop_policy = 'play_once'
        elif primitive_type_by_pattern.get(pattern_id) == 'section_container' and 'loop' in child_functions:
            loop_policy = 'loop'
        else:
            loop_policy = 'play_once'
        loop_policy_by_pattern[pattern_id] = loop_policy

        if pattern_id in explicit_subsection_roots:
            signature = _build_section_signature(pattern_id, by_id, ordered_children)
            if pattern.get('variantOf') and isinstance(pattern.get('variantOf'), str):
                variant_root = subsection_root_by_pattern.get(pattern.get('variantOf'))
                if variant_root and variant_root in subsection_root_to_skeleton_id:
                    subsection_root_to_skeleton_id[pattern_id] = subsection_root_to_skeleton_id[variant_root]
                    subsection_skeleton_id_by_pattern[pattern_id] = subsection_root_to_skeleton_id[variant_root]
                    continue
            if signature in subsection_signature_to_skeleton_id:
                skeleton_id = subsection_signature_to_skeleton_id[signature]
            else:
                subsection_skeleton_sequence += 1
                skeleton_id = f'subsection-skeleton:{song_id}:{subsection_skeleton_sequence}'
                subsection_signature_to_skeleton_id[signature] = skeleton_id
            subsection_root_to_skeleton_id[pattern_id] = skeleton_id
            subsection_skeleton_id_by_pattern[pattern_id] = skeleton_id
        else:
            subsection_root_id = subsection_root_by_pattern.get(pattern_id)
            subsection_skeleton_id_by_pattern[pattern_id] = subsection_root_to_skeleton_id.get(subsection_root_id) if subsection_root_id else None

    section_asset_manifests = _build_section_asset_manifests(
        section_ids,
        by_id,
        ordered_children,
        subsection_function_by_pattern,
        section_purpose_by_pattern,
    )

    exported_patterns: list[dict[str, object]] = []
    pattern_instances: list[dict[str, object]] = []
    relationships: list[dict[str, object]] = []
    collection_candidates: list[dict[str, object]] = []
    label_groups: dict[str, set[str]] = {}
    relationship_type_counts = Counter()
    material_role_counts = Counter()
    primitive_type_counts = Counter()
    section_purpose_counts = Counter()
    subsection_function_counts = Counter()
    loop_policy_counts = Counter()
    container_kind_counts = Counter()
    section_family_mode_counts = Counter()
    seen_canonical_ids: set[str] = set()

    for entry in traversal_entries:
        pattern_id = str(entry['patternId'])
        pattern = by_id[pattern_id]
        child_ids = ordered_children.get(pattern_id, [])
        canonical_id = canonical_id_by_pattern.get(pattern_id, pattern_id)
        instance_id = f'instance:{pattern_id}'
        parent_pattern_id = entry['parentPatternId']
        parent_instance_id = f'instance:{parent_pattern_id}' if isinstance(parent_pattern_id, str) and parent_pattern_id in by_id else None
        material_role = _classify_material_role(pattern, canonical_id, seen_canonical_ids, parent_pattern_id is None)
        primitive_type = primitive_type_by_pattern.get(pattern_id, 'leaf_pattern')
        section_purpose = section_purpose_by_pattern.get(pattern_id)
        subsection_function = subsection_function_by_pattern.get(pattern_id)
        loop_policy = loop_policy_by_pattern.get(pattern_id, 'play_once')
        container_kind = container_kind_by_pattern.get(pattern_id)
        reduction_lineage = reduction_lineage_by_pattern.get(pattern_id, [])
        section_family_mode = section_family_mode_by_pattern.get(pattern_id)
        pattern_section_id = pattern_id if pattern_id in section_ids_set else _find_ancestor_in_set(pattern_id, by_id, section_ids_set)

        material_role_counts.update([material_role])
        primitive_type_counts.update([primitive_type])
        if section_purpose:
            section_purpose_counts.update([section_purpose])
        if subsection_function:
            subsection_function_counts.update([subsection_function])
        if loop_policy:
            loop_policy_counts.update([loop_policy])
        if container_kind:
            container_kind_counts.update([container_kind])
        if section_family_mode:
            section_family_mode_counts.update([section_family_mode])

        pattern_instances.append({
            'id': instance_id,
            'songId': song_id,
            'sourcePatternId': pattern_id,
            'canonicalPatternId': canonical_id,
            'parentInstanceId': parent_instance_id,
            'childInstanceIds': [f'instance:{child_id}' for child_id in child_ids],
            'orderIndex': entry['orderPath'][-1] if entry['orderPath'] else 0,
            'orderPath': entry['orderPath'],
            'depth': entry['depth'],
            'instanceType': 'song_root' if parent_pattern_id is None else ('container' if child_ids else 'leaf'),
            'materialRole': material_role,
            'primitiveType': primitive_type,
            'sectionId': pattern_section_id,
            'sectionFamilyId': section_family_id_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'sectionFamilyMode': section_family_mode_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'sectionPurpose': section_purpose if primitive_type == 'section_container' else section_purpose_by_pattern.get(pattern_section_id),
            'sectionSkeletonId': section_skeleton_id_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'subsectionRootId': subsection_root_by_pattern.get(pattern_id),
            'subsectionSkeletonId': subsection_skeleton_id_by_pattern.get(pattern_id),
            'subsectionFunction': subsection_function,
            'loopPolicy': loop_policy,
            'containerKind': container_kind,
            'variationFamilyId': variation_family_id_by_pattern.get(pattern_id),
            'callResponseGroupId': call_response_group_by_pattern.get(pattern_id),
            'reductionLineage': reduction_lineage,
            'range': pattern.get('range'),
            'mode': pattern.get('mode'),
            'instrumentCount': len(pattern.get('instruments', [])) if isinstance(pattern.get('instruments'), list) else 0,
            'instruments': pattern.get('instruments', []),
            'sourceRef': {
                'settingsPath': settings_path.name,
                'patternId': pattern_id,
                'instanceId': instance_id,
            },
        })
        seen_canonical_ids.add(canonical_id)

    for pattern_id, pattern in by_id.items():
        name = pattern.get('name') if isinstance(pattern.get('name'), str) else pattern_id
        normalized_name = _normalized_label(name)
        if normalized_name:
            label_groups.setdefault(normalized_name, set()).add(name)

        child_ids = ordered_children.get(pattern_id, [])
        relation_tags = _relation_tags(pattern)
        relationship_type_counts.update(tag for tag in relation_tags if tag not in ('container', 'leaf'))
        canonical_id = canonical_id_by_pattern.get(pattern_id, pattern_id)
        primitive_type = primitive_type_by_pattern.get(pattern_id, 'leaf_pattern')
        section_purpose = section_purpose_by_pattern.get(pattern_id)
        subsection_function = subsection_function_by_pattern.get(pattern_id)
        loop_policy = loop_policy_by_pattern.get(pattern_id, 'play_once')
        container_kind = container_kind_by_pattern.get(pattern_id)
        section_family_mode = section_family_mode_by_pattern.get(pattern_id)
        pattern_section_id = pattern_id if pattern_id in section_ids_set else _find_ancestor_in_set(pattern_id, by_id, section_ids_set)

        exported_pattern = {
            'id': pattern_id,
            'name': name,
            'normalizedName': normalized_name,
            'canonicalId': canonical_id,
            'parentId': pattern.get('parentId'),
            'children': child_ids,
            'orderedChildPatternIds': child_ids,
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
            'primitiveType': primitive_type,
            'sectionId': pattern_section_id,
            'sectionFamilyId': section_family_id_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'sectionFamilyMode': section_family_mode_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'sectionPurpose': section_purpose if primitive_type == 'section_container' else section_purpose_by_pattern.get(pattern_section_id),
            'sectionSkeletonId': section_skeleton_id_by_pattern.get(pattern_section_id) if pattern_section_id else None,
            'subsectionRootId': subsection_root_by_pattern.get(pattern_id),
            'subsectionSkeletonId': subsection_skeleton_id_by_pattern.get(pattern_id),
            'subsectionFunction': subsection_function,
            'loopPolicy': loop_policy,
            'containerKind': container_kind,
            'variationFamilyId': variation_family_id_by_pattern.get(pattern_id),
            'callResponseGroupId': call_response_group_by_pattern.get(pattern_id),
            'reductionLineage': reduction_lineage_by_pattern.get(pattern_id, []),
            'patternRole': 'canonical_seed' if canonical_id == pattern_id and not pattern.get('variantOf') else 'derived_pattern',
            'instanceIds': [f'instance:{pattern_id}'],
            'sourceOrder': source_order.get(pattern_id, 0),
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
                'scope': 'pattern',
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
                'scope': 'pattern',
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

    for group in call_response_groups:
        member_ids = list(group.get('memberPatternIds', []))
        for source_id, target_id in zip(member_ids, member_ids[1:]):
            relationships.append({
                'type': 'call_response',
                'from': source_id,
                'to': target_id,
                'scope': 'pattern',
                'groupId': group['id'],
            })

    for family in section_family_records:
        pattern_ids = list(family.get('sectionPatternIds', []))
        for source_id, target_id in zip(pattern_ids, pattern_ids[1:]):
            relationships.append({
                'type': 'section_family',
                'from': source_id,
                'to': target_id,
                'scope': 'pattern',
                'groupId': family['id'],
                'mode': family.get('sectionFamilyMode'),
            })

    relationship_type_counts = Counter(relationship['type'] for relationship in relationships)

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
    root_instance_ids = [
        instance['id']
        for instance in pattern_instances
        if instance.get('parentInstanceId') is None
    ]

    return {
        'exportVersion': EXPORT_VERSION,
        'schemaVersion': SCHEMA_VERSION,
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
        'songPlan': {
            'rootInstanceIds': root_instance_ids,
            'traversalOrderInstanceIds': [instance['id'] for instance in pattern_instances],
            'decompositionStrategy': 'ordered_child_instances',
            'rootPatternId': primary_root_id,
            'sectionPatternIds': section_ids,
        },
        'patterns': sorted(exported_patterns, key=lambda pattern: (pattern['depth'], pattern['name'].lower(), pattern['id'])),
        'patternInstances': pattern_instances,
        'relationships': relationships,
        'collectionCandidates': collection_candidates,
        'sectionFamilies': section_family_records,
        'variationFamilies': variation_family_records,
        'callResponseGroups': call_response_groups,
        'sectionAssetManifests': section_asset_manifests,
        'summary': {
            'patternCount': len(exported_patterns),
            'patternInstanceCount': len(pattern_instances),
            'relationshipCount': len(relationships),
            'collectionCount': len(collection_candidates),
            'sectionFamilyCount': len(section_family_records),
            'variationFamilyCount': len(variation_family_records),
            'callResponseGroupCount': len(call_response_groups),
            'sectionAssetManifestCount': len(section_asset_manifests),
            'rootPatternCount': sum(1 for pattern in exported_patterns if not pattern.get('parentId')),
            'rootInstanceCount': len(root_instance_ids),
            'leafPatternCount': sum(1 for pattern in exported_patterns if not pattern.get('children')),
            'relationshipTypeCounts': dict(relationship_type_counts.most_common()),
            'collectionTypeCounts': dict(collection_type_counts.most_common()),
            'materialRoleCounts': dict(material_role_counts.most_common()),
            'primitiveTypeCounts': dict(primitive_type_counts.most_common()),
            'sectionPurposeCounts': dict(section_purpose_counts.most_common()),
            'subsectionFunctionCounts': dict(subsection_function_counts.most_common()),
            'loopPolicyCounts': dict(loop_policy_counts.most_common()),
            'containerKindCounts': dict(container_kind_counts.most_common()),
            'sectionFamilyModeCounts': dict(section_family_mode_counts.most_common()),
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
    examples_root = export_root / 'examples'
    songs_root.mkdir(parents=True, exist_ok=True)
    examples_root.mkdir(parents=True, exist_ok=True)

    for stale_file in songs_root.glob('*.json'):
        stale_file.unlink()
    for stale_file in examples_root.glob('*.json'):
        stale_file.unlink()

    items: list[dict[str, object]] = []
    issues: list[dict[str, str]] = []
    relationship_type_counts = Counter()
    collection_type_counts = Counter()
    material_role_counts = Counter()
    primitive_type_counts = Counter()
    section_purpose_counts = Counter()
    subsection_function_counts = Counter()
    loop_policy_counts = Counter()
    container_kind_counts = Counter()
    section_family_mode_counts = Counter()
    label_variant_groups: list[dict[str, object]] = []
    total_patterns = 0
    total_pattern_instances = 0
    total_relationships = 0
    total_collections = 0
    representative_export: dict[str, object] | None = None

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
        total_pattern_instances += int(summary.get('patternInstanceCount', 0))
        total_relationships += int(summary['relationshipCount'])
        total_collections += int(summary['collectionCount'])
        relationship_type_counts.update(summary.get('relationshipTypeCounts', {}))
        collection_type_counts.update(summary.get('collectionTypeCounts', {}))
        material_role_counts.update(summary.get('materialRoleCounts', {}))
        primitive_type_counts.update(summary.get('primitiveTypeCounts', {}))
        section_purpose_counts.update(summary.get('sectionPurposeCounts', {}))
        subsection_function_counts.update(summary.get('subsectionFunctionCounts', {}))
        loop_policy_counts.update(summary.get('loopPolicyCounts', {}))
        container_kind_counts.update(summary.get('containerKindCounts', {}))
        section_family_mode_counts.update(summary.get('sectionFamilyModeCounts', {}))
        label_variant_groups.extend(summary.get('labelVariantGroups', []))
        issues.extend(song_export.get('issues', []))

        if representative_export is None or int(summary.get('patternInstanceCount', 0)) > int(representative_export['summary'].get('patternInstanceCount', 0)):
            representative_export = song_export

        items.append({
            'songId': song_export['songId'],
            'label': song_export['title'],
            'path': _relative_path(song_path, export_root),
            'sourcePath': song_export['source']['path'],
            'patternCount': summary['patternCount'],
            'patternInstanceCount': summary.get('patternInstanceCount', 0),
            'relationshipCount': summary['relationshipCount'],
            'collectionCount': summary['collectionCount'],
        })

    worked_example_path = None
    if representative_export is not None:
        worked_example_path = examples_root / 'representative_song.json'
        worked_example_path.write_text(json.dumps(representative_export, indent=2), encoding='utf-8')

    snapshot = {
        'generatedAt': generated_at,
        'exportPath': str(snapshot_path),
        'schemaVersion': SCHEMA_VERSION,
        'summaryCards': {
            'songCount': len(items),
            'patternCount': total_patterns,
            'patternInstanceCount': total_pattern_instances,
            'relationshipCount': total_relationships,
            'collectionCount': total_collections,
        },
        'relationshipTypeCounts': dict(relationship_type_counts.most_common()),
        'collectionTypeCounts': dict(collection_type_counts.most_common()),
        'materialRoleCounts': dict(material_role_counts.most_common()),
        'primitiveTypeCounts': dict(primitive_type_counts.most_common()),
        'sectionPurposeCounts': dict(section_purpose_counts.most_common()),
        'subsectionFunctionCounts': dict(subsection_function_counts.most_common()),
        'loopPolicyCounts': dict(loop_policy_counts.most_common()),
        'containerKindCounts': dict(container_kind_counts.most_common()),
        'sectionFamilyModeCounts': dict(section_family_mode_counts.most_common()),
        'labelVariantGroups': label_variant_groups[:20],
        'issues': issues[:200],
        'workedExample': {
            'path': _relative_path(worked_example_path, export_root) if worked_example_path else None,
            'songId': representative_export['songId'] if representative_export else None,
            'title': representative_export['title'] if representative_export else None,
            'patternInstanceCount': representative_export['summary'].get('patternInstanceCount', 0) if representative_export else 0,
        },
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
