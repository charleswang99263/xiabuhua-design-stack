#!/usr/bin/env python3
"""Validate a Xiabuhua Product Design interaction manifest."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


SCREEN_FIELDS = ("id", "name", "role", "entry", "terminal")
EDGE_FIELDS = (
    "id",
    "source",
    "trigger",
    "target",
    "gate",
    "gateId",
    "requiredOutcomes",
    "resolvesGate",
    "returnContext",
    "preservedState",
    "cancelTarget",
    "retryTarget",
    "hotspot",
)


def non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def positive_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="Path to interaction-manifest JSON")
    parser.add_argument("--min-width", type=float, default=None, help="Override minimum target width")
    parser.add_argument("--min-height", type=float, default=None, help="Override minimum target height")
    return parser.parse_args()


def load_manifest(path: Path) -> tuple[dict[str, Any] | None, list[str]]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None, [f"manifest does not exist: {path}"]
    except json.JSONDecodeError as exc:
        return None, [f"invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}"]
    except OSError as exc:
        return None, [f"cannot read manifest: {exc}"]

    if not isinstance(raw, dict):
        return None, ["manifest root must be a JSON object"]
    return raw, []


def interaction_target(
    manifest: dict[str, Any], width_override: float | None, height_override: float | None, errors: list[str]
) -> tuple[float, float]:
    declared = manifest.get("interactionTarget")
    if not isinstance(declared, dict):
        errors.append("interactionTarget must explicitly declare platform, inputMode, unit, and minimum")
        return 0.0, 0.0
    for field in ("platform", "inputMode", "unit"):
        if not non_empty_string(declared.get(field)):
            errors.append(f"interactionTarget.{field} must be a non-empty string")
    minimum = declared.get("minimum")
    if not isinstance(minimum, dict):
        errors.append("interactionTarget.minimum must be an object with width and height")
        return 0.0, 0.0
    width = width_override if width_override is not None else minimum.get("width")
    height = height_override if height_override is not None else minimum.get("height")
    if not positive_number(width) or not positive_number(height):
        errors.append("interactionTarget minimum width and height must be positive numbers")
        return 0.0, 0.0
    return float(width), float(height)


def validate(
    manifest: dict[str, Any], min_width_override: float | None = None, min_height_override: float | None = None
) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not non_empty_string(manifest.get("version")):
        errors.append("version is required and must be a non-empty string")

    graph_mode = manifest.get("graphMode")
    if graph_mode not in ("journey", "navigation"):
        errors.append("graphMode must be 'journey' or 'navigation'")

    gate_types = manifest.get("gateTypes")
    if not isinstance(gate_types, list) or not gate_types or not all(non_empty_string(item) for item in gate_types):
        errors.append("gateTypes is required and must be a non-empty array of strings")
        gate_types = []
    elif len(set(gate_types)) != len(gate_types):
        errors.append("gateTypes must not contain duplicates")
    if gate_types and "none" not in gate_types:
        errors.append("gateTypes must include 'none'")

    screens = manifest.get("screens")
    edges = manifest.get("edges")
    if not isinstance(screens, list) or not screens:
        errors.append("screens is required and must be a non-empty array")
        screens = []
    if not isinstance(edges, list):
        errors.append("edges is required and must be an array")
        edges = []
    elif len(screens) > 1 and not edges:
        errors.append("a multi-screen manifest must contain at least one edge")

    min_width, min_height = interaction_target(manifest, min_width_override, min_height_override, errors)

    screen_ids: set[str] = set()
    valid_screens: dict[str, dict[str, Any]] = {}
    for index, screen in enumerate(screens):
        label = f"screens[{index}]"
        if not isinstance(screen, dict):
            errors.append(f"{label} must be an object")
            continue
        for field in SCREEN_FIELDS:
            if field not in screen:
                errors.append(f"{label}.{field} is required")
        screen_id = screen.get("id")
        if not non_empty_string(screen_id):
            errors.append(f"{label}.id must be a non-empty string")
            continue
        if screen_id in screen_ids:
            errors.append(f"duplicate screen id: {screen_id}")
        else:
            screen_ids.add(screen_id)
            valid_screens[screen_id] = screen
        if not non_empty_string(screen.get("name")):
            errors.append(f"{label}.name must be a non-empty string")
        if not non_empty_string(screen.get("role")):
            errors.append(f"{label}.role must be a non-empty string")
        for flag in ("entry", "terminal"):
            if flag in screen and not isinstance(screen[flag], bool):
                errors.append(f"{label}.{flag} must be a boolean")

    edge_ids: set[str] = set()
    valid_edges: list[dict[str, Any]] = []
    gate_edges: dict[str, dict[str, Any]] = {}
    gate_resolutions: dict[str, dict[str, dict[str, Any]]] = {}
    incoming = {screen_id: 0 for screen_id in screen_ids}
    outgoing = {screen_id: 0 for screen_id in screen_ids}
    for index, edge in enumerate(edges):
        label = f"edges[{index}]"
        if not isinstance(edge, dict):
            errors.append(f"{label} must be an object")
            continue
        for field in EDGE_FIELDS:
            if field not in edge:
                errors.append(f"{label}.{field} is required")

        edge_id = edge.get("id")
        if not non_empty_string(edge_id):
            errors.append(f"{label}.id must be a non-empty string")
        elif edge_id in edge_ids:
            errors.append(f"duplicate edge id: {edge_id}")
        else:
            edge_ids.add(edge_id)
            valid_edges.append(edge)

        source = edge.get("source")
        target = edge.get("target")
        for field, value in (("source", source), ("target", target)):
            if not non_empty_string(value):
                errors.append(f"{label}.{field} must be a non-empty string")
            elif value not in screen_ids:
                errors.append(f"{label}.{field} references unknown screen: {value}")
        if source in outgoing:
            outgoing[source] += 1
        if target in incoming:
            incoming[target] += 1

        if not non_empty_string(edge.get("trigger")):
            errors.append(f"{label}.trigger must be a non-empty string")
        gate = edge.get("gate")
        if not non_empty_string(gate):
            errors.append(f"{label}.gate must be a non-empty string")
        elif gate_types and gate not in gate_types:
            errors.append(f"{label}.gate uses undeclared gate type: {gate}")
        gate_id = edge.get("gateId")
        required_outcomes = edge.get("requiredOutcomes")
        resolves_gate = edge.get("resolvesGate")
        return_context = edge.get("returnContext")
        if gate != "none":
            if not non_empty_string(gate_id):
                errors.append(f"{label}.gateId must be a non-empty string when gate is not 'none'")
            elif gate_id in gate_edges:
                errors.append(f"duplicate gateId: {gate_id}")
            else:
                gate_edges[gate_id] = edge
            if not isinstance(required_outcomes, list) or not required_outcomes or not all(
                non_empty_string(item) for item in required_outcomes
            ):
                errors.append(f"{label}.requiredOutcomes must be a non-empty array for a gated edge")
            elif len(set(required_outcomes)) != len(required_outcomes):
                errors.append(f"{label}.requiredOutcomes must not contain duplicates")
            elif "success" not in required_outcomes:
                errors.append(f"{label}.requiredOutcomes must include 'success'")
            if resolves_gate is not None:
                errors.append(f"{label}.resolvesGate must be null on the gated entry edge")
            if not isinstance(return_context, dict):
                errors.append(f"{label}.returnContext must be an object when gate is not 'none'")
            else:
                context_screen = return_context.get("screen")
                resume_trigger = return_context.get("resumeTrigger")
                if not non_empty_string(context_screen) or context_screen not in screen_ids:
                    errors.append(f"{label}.returnContext.screen must reference an existing screen")
                if not non_empty_string(resume_trigger):
                    errors.append(f"{label}.returnContext.resumeTrigger must be a non-empty string")
        elif return_context is not None:
            errors.append(f"{label}.returnContext must be null when gate is 'none'")
        else:
            if gate_id is not None:
                errors.append(f"{label}.gateId must be null when gate is 'none'")
            if required_outcomes != []:
                errors.append(f"{label}.requiredOutcomes must be an empty array when gate is 'none'")

        if resolves_gate is not None:
            if not isinstance(resolves_gate, dict):
                errors.append(f"{label}.resolvesGate must be null or an object")
            else:
                resolved_id = resolves_gate.get("gateId")
                outcome = resolves_gate.get("outcome")
                if not non_empty_string(resolved_id) or not non_empty_string(outcome):
                    errors.append(f"{label}.resolvesGate requires non-empty gateId and outcome")
                else:
                    outcomes = gate_resolutions.setdefault(resolved_id, {})
                    if outcome in outcomes:
                        errors.append(f"duplicate resolution outcome for gate {resolved_id}: {outcome}")
                    else:
                        outcomes[outcome] = edge

        preserved_state = edge.get("preservedState")
        if not isinstance(preserved_state, list) or not all(non_empty_string(item) for item in preserved_state):
            errors.append(f"{label}.preservedState must be an array of non-empty strings")

        for field in ("cancelTarget", "retryTarget"):
            value = edge.get(field)
            if value is not None and (not non_empty_string(value) or value not in screen_ids):
                errors.append(f"{label}.{field} must be null or reference an existing screen")

        hotspot = edge.get("hotspot")
        if hotspot is not None:
            if not isinstance(hotspot, dict):
                errors.append(f"{label}.hotspot must be null or an object with width and height")
            else:
                width = hotspot.get("width")
                height = hotspot.get("height")
                if not positive_number(width) or not positive_number(height):
                    errors.append(f"{label}.hotspot width and height must be positive numbers")
                else:
                    if width < min_width:
                        errors.append(f"{label}.hotspot width {width:g} is below minimum {min_width:g}")
                    if height < min_height:
                        errors.append(f"{label}.hotspot height {height:g} is below minimum {min_height:g}")

    for screen_id, screen in valid_screens.items():
        if not screen.get("entry", False) and incoming[screen_id] == 0:
            errors.append(f"screen has no incoming edge and is not an entry: {screen_id}")
        if not screen.get("terminal", False) and outgoing[screen_id] == 0:
            errors.append(f"screen has no outgoing edge and is not terminal: {screen_id}")
        if screen.get("terminal", False) and outgoing[screen_id] > 0:
            errors.append(f"terminal screen has an outgoing edge: {screen_id}")

    entry_ids = {screen_id for screen_id, screen in valid_screens.items() if screen.get("entry") is True}
    if not entry_ids:
        errors.append("at least one entry screen is required")

    adjacency = {screen_id: set() for screen_id in screen_ids}
    reverse = {screen_id: set() for screen_id in screen_ids}
    for edge in valid_edges:
        source, target = edge.get("source"), edge.get("target")
        if source in adjacency and target in adjacency:
            adjacency[source].add(target)
            reverse[target].add(source)

    def reachable(starts: set[str], graph: dict[str, set[str]]) -> set[str]:
        seen = set(starts)
        stack = list(starts)
        while stack:
            current = stack.pop()
            for next_id in graph[current]:
                if next_id not in seen:
                    seen.add(next_id)
                    stack.append(next_id)
        return seen

    from_entries = reachable(entry_ids, adjacency)
    for screen_id in screen_ids - from_entries:
        errors.append(f"screen is unreachable from any entry: {screen_id}")

    terminal_ids = {screen_id for screen_id, screen in valid_screens.items() if screen.get("terminal") is True}
    if graph_mode == "journey":
        if not terminal_ids:
            errors.append("journey mode requires at least one terminal screen")
        else:
            to_terminal = reachable(terminal_ids, reverse)
            for screen_id in screen_ids - terminal_ids - to_terminal:
                errors.append(f"non-terminal screen cannot reach a terminal: {screen_id}")

    for gate_id, gate_edge in gate_edges.items():
        gate_target = gate_edge.get("target")
        target_screen = valid_screens.get(gate_target)
        if target_screen and target_screen.get("role") != "gate":
            errors.append(f"gate {gate_id} must target a screen with role 'gate': {gate_target}")
        required = gate_edge.get("requiredOutcomes") if isinstance(gate_edge.get("requiredOutcomes"), list) else []
        resolutions = gate_resolutions.get(gate_id, {})
        for outcome in required:
            resolution = resolutions.get(outcome)
            if resolution is None:
                errors.append(f"gate {gate_id} is missing required outcome edge: {outcome}")
                continue
            if resolution.get("source") != gate_target:
                errors.append(f"gate {gate_id} outcome {outcome} must start from gate screen {gate_target}")
            gate_state = set(gate_edge.get("preservedState") or [])
            resolution_state = set(resolution.get("preservedState") or [])
            if not gate_state.issubset(resolution_state):
                errors.append(f"gate {gate_id} outcome {outcome} does not preserve required state")
            if outcome == "cancel":
                return_screen = (gate_edge.get("returnContext") or {}).get("screen")
                cancel_target = gate_edge.get("cancelTarget") or return_screen
                if resolution.get("target") != cancel_target:
                    errors.append(f"gate {gate_id} cancel outcome must return to {cancel_target}")
    for resolved_id in gate_resolutions:
        if resolved_id not in gate_edges:
            errors.append(f"resolution references unknown gateId: {resolved_id}")

    return errors, warnings


def main() -> int:
    args = parse_args()
    manifest, load_errors = load_manifest(args.manifest)
    if manifest is None:
        for error in load_errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 2

    errors, warnings = validate(manifest, args.min_width, args.min_height)
    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        print(f"FAILED: {len(errors)} error(s), {len(warnings)} warning(s)", file=sys.stderr)
        return 1

    status = "PASS WITH WARNINGS" if warnings else "PASS"
    print(f"{status}: interaction manifest checked "
          f"({len(manifest['screens'])} screens, {len(manifest['edges'])} edges, {len(warnings)} warning(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
