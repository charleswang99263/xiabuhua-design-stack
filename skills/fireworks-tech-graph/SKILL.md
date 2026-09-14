---
name: fireworks-tech-graph
metadata:
  version: "5.1.0"
description: >-
  Use when the user wants a technical diagram such as architecture, data flow,
  flowchart, sequence, agent/memory, UML, network topology, or concept map,
  including SVG+PNG export. Trigger on: "画图" "帮我画" "生成图" "做个图"
  "架构图" "流程图" "可视化一下" "出图" "generate diagram" "draw diagram"
  "visualize".
---

# Fireworks Tech Graph

Create project-owned, production-quality technical diagrams as SVG and, when
the host can render it, PNG. This skill is a semantic and topology router;
the detailed execution guide is in
[references/technical-diagram-guide.md](references/technical-diagram-guide.md).

This v5 copy is local and project-owned. Use only available files and runtimes;
never install, update, overwrite, or publish an upstream package automatically.
Keep [LICENSE](LICENSE) and any required notices with distributed copies.

## Route the request

1. Classify the object: measured data chart, process/state/sequence, system
   architecture/network, or UML.
2. Extract nodes, layers, edges, direction, conditions, quantities, ownership,
   and the one question the diagram must answer.
3. Inherit the parent-approved project style agreement. Existing templates and
   `style-*` references are optional implementation references and cannot
   choose or replace the project's visual direction.
4. Read the execution guide for layout, shape, arrow, template, export, and
   validation details. For measured data, read the sibling product-design
   [chart-design-contract](../xiabuhua-product-design/references/chart-design-contract.md);
   do not invent a second chart-selection contract here.
5. Generate, validate, render, and report the exact artifact paths and limits.

## Non-negotiable semantics

- A chart and its accessible table use the same computed rows. Preserve unit,
  denominator, grain, time interval, aggregation, source, zero, negative,
  unknown, and missing values. A dot plot does not require a zero baseline;
  choose and disclose its range for the reading task.
- Relationship data is not a flowchart, state machine, sequence diagram, or
  architecture diagram. Technical diagrams preserve topology, direction,
  responsibility boundaries, conditions, synchronous/asynchronous meaning,
  and explicit success/error exits.
- Reject duplicate ids, missing endpoints, accidental orphan nodes, dangling
  arrows, arrows through node interiors, unlabeled decision branches, and text
  that leaves its node. An explicitly labeled independent external system or
  boundary node is a valid architecture exception when the legend explains it.
- Arrow color, dash, width, and label carry relation meaning; include a legend
  when two or more meanings appear. Route labels around nodes and titles.
- Preserve full Chinese labels and provide keyboard/static text alternatives
  where interaction is used. Key semantic text defaults to 12px or larger;
  smaller ticks/footnotes need contrast and a readable alternative.
- Validate flow quantities for conservation when width encodes amount. Do not
  make a visually complete diagram out of invalid topology.

## Required validation

Use the project scripts where applicable:

Resolve `diagram_skill_dir` to this Skill’s actual absolute directory and `diagram_output` to an absolute SVG output path in the user project before running the commands below. Do not depend on the current working directory or write artifacts into the installed Skill.

```bash
python3 "$diagram_skill_dir/scripts/generate-from-template.py" architecture "$diagram_output" '{"title":"示例","nodes":[],"arrows":[]}'
bash "$diagram_skill_dir/scripts/validate-svg.sh" "$diagram_output"
python3 -c "import sys, xml.etree.ElementTree as ET; ET.parse(sys.argv[1])" "$diagram_output"
```

Run the browser or an already available SVG renderer for generated output when
possible. A successful build, non-empty container, or HTTP 200 alone is not
visual or semantic acceptance. Do not download browsers or install packages
from this skill. For the full type map, route examples, optional style table,
SVG rules, export caveats, and template guidance, read
[technical-diagram-guide.md](references/technical-diagram-guide.md).

## Local assets and license

The local `templates/`, `references/`, and `scripts/` directories are optional
project assets. Their paths resolve relative to this Skill directory; do not
assume a global installation. The included [LICENSE](LICENSE) is MIT and must
remain with copies of the skill. The sibling Xiabuhua skills and any external
renderer keep their own licenses and are not silently bundled.

