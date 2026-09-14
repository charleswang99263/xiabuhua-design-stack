# Fireworks Tech Graph · 技术图执行指南

本文件承载实现细节。入口 [SKILL.md](../SKILL.md) 只负责触发、路由、语义边界和验收；数据图的字段、分母、缺失值和读者模式以产品设计主契约为准：[`chart-design-contract.md`](../../xiabuhua-product-design/references/chart-design-contract.md)。

## 使用顺序

1. 识别对象：分析数据图、流程/状态/时序图、架构/网络图或 UML 图。
2. 从输入提取节点、层、边、方向、条件、数据量和语义分组。
3. 先采用父级项目已经批准的风格协议；未指定时只使用中性图形默认值。模板和样式参考是技术实现参考，不是新的品牌方向。
4. 选择布局、映射形状、规划箭头通道，写出 SVG。
5. 做 XML、拓扑、标注、可读性和导出检查；有条件时再做浏览器渲染自检。

## 图型与布局速查

| 类型 | 结构重点 | 默认画布 |
| --- | --- | --- |
| Architecture | Client → Gateway → Services → Data/Storage；按层分组 | 960×600 / 960×800 |
| Data Flow | 每条主路径写数据类型；数据线与控制线区分 | 960×600 |
| Flowchart | 过程框、菱形决策、输入输出、成功/失败出口 | 960×640 |
| Agent / Memory | Input、Agent core、Memory、Tools、Output；读写路径分开 | 960×700 / 960×720 |
| Sequence | 参与者顶部标签、垂直 lifeline、按时间向下；loop/alt 有边界 | 960×(80+50×消息数) |
| Comparison matrix | 列是系统、行是属性；最多 5 列，超出拆图 | 960×620 |
| Timeline / Gantt | 横轴是时间，纵轴是事项，里程碑用菱形或圆点 | 960×520 |
| Mind / Concept map | 中心节点、弧线分支、分层避免交叠 | 960×620 |
| Class / ER / Use Case | UML 形状、关系、基数和边界要完整 | 960×600–700 |
| State machine | 初始/终止/选择、状态转换、guard/action | 960×620 |
| Network topology | Internet → Edge → Core → Access → Endpoints；区域用虚线容器 | 960×620 |

UML 映射：Component/Deployment/Package/Composite Structure 归 Architecture；Activity 归 Flowchart；Communication 近似 Sequence；Timing 归 Timeline；Interaction Overview 归 Flowchart。没有明确结构时不要用关系网络替代技术图。

## 形状语义

| 概念 | 推荐形状 |
| --- | --- |
| User / Human | 圆头加身体路径 |
| LLM / Model | 圆角矩形，可有中性模型标记 |
| Agent / Orchestrator | 六边形或双边框圆角矩形 |
| Ephemeral memory | 虚线圆角矩形 |
| Persistent store | 圆柱；Vector Store 可加网格线 |
| Tool / Function | 带工具标记的矩形 |
| API / Gateway | 六边形 |
| Queue / Stream | 横向管道 |
| File / Artifact | 折角矩形 |
| Decision | 菱形，仅用于流程/状态分支 |
| Process / Step | 圆角矩形 |
| Data / I/O | 平行四边形 |

形状说明概念，不能覆盖用户已批准的形状、品牌或拓扑。

## 箭头和空间

箭头必须表达关系，不仅靠颜色：主数据流用实线并写数据类型，控制/触发可用橙色或虚线，读写/事件/反馈使用项目协议中定义的线型并附图例。箭头从节点边缘出入，优先正交路由；同层节点至少留 80px，层间至少留 120px，画布边界至少留 40px。

箭头标签优先放在线上方 6–8px 或竖线侧方 8px；只有仍会碰撞时才加不透明背景。并行线错开 15–20px。无法避免交叉时使用 5/7/9px 跳线弧；禁止直线穿过节点内部、标题或 legend。

## 结构与拓扑检查

- 每个节点 id 唯一；每条边的 source/target 都存在，关键路径不能悬空。
- 流程、状态、时序和数据流图拒绝意外孤立节点；架构图允许明确标注的独立外部系统/边界节点，并在图例或旁注说明它不在当前路径。
- 决策节点至少有两个有条件标签的出口；状态转换写事件/guard/action；时序图保留参与者责任和同步/异步含义。
- 流量图的带宽对应量，入口/出口、损耗、新增和回流可加总；不以视觉宽度替代核算。
- 长中文标签换行且保留完整实体名；关键文字默认 ≥12px，刻度和脚注例外时提供对比度与文本替代。

## 代表性输入

### Agentic RAG

`Query → Embed → VectorSearch → Retrieve → Augment → LLM → Response`。如果存在规划和工具调用，插入 Agent loop，并用反馈箭头回到规划节点；如果存在记忆写入，单独画 write path，不把它和 response path 混为一条线。

### Multi-agent

`Orchestrator → [SubAgent A / B / C] → Aggregator → Output`。子 Agent 的责任、并行/串行和失败汇聚条件要写在节点或旁注中。

### Tool call

`LLM → Tool Selector → Tool Execution → Result Parser → LLM`。循环是语义关系，不能因为画布需要而随意添加。

## SVG 生成和脚本

复杂图优先使用项目内脚本：

```bash
./scripts/generate-diagram.sh -t architecture -s 1 -o ./output/arch.svg
python3 ./scripts/generate-from-template.py architecture ./output/arch.svg '{"title":"示例","nodes":[],"arrows":[]}'
./scripts/validate-svg.sh ./output/arch.svg
```

`generate-from-template.py` 会从 `templates/` 读取已存在的类型模板，转义文本、应用样式和箭头语义。它是起点，不会替代节点布局、业务语义或人工视觉检查。简单图也可以用 Python 列表逐行生成，避免长字符串截断；不要用网络模板或运行时在线资源。

四个脚本的职责边界：`generate-diagram.sh` 负责已有 SVG 的验证与 PNG 导出；`generate-from-template.py` 负责从模板生成起点；`validate-svg.sh` 负责 XML、marker、属性和箭头碰撞检查；`test-all-styles.sh` 负责批量回归各个可选样式。批量脚本只使用仓库中已经存在的工具，不自动安装依赖。

SVG 必须包含 `viewBox`、内嵌字体 fallback、`defs` 中的 marker/gradient/filter（如使用），并按背景 → 容器 → 箭头 → 节点 → 文本 → legend 的顺序绘制。浏览器生成的 SVG 用宿主已有浏览器渲染；简单 SVG 才使用宿主已有 CairoSVG 或 rsvg-convert。此 Skill 不下载浏览器或安装依赖。

```bash
python3 -c "import xml.etree.ElementTree as ET; ET.parse('./output/arch.svg')"
```

浏览器或 CairoSVG 导出 PNG 前，先确认 CJK 字体可用；Cairo 的字体 fallback 可能把中文渲染为空框，SVG 应作为主要交付格式。可用宿主浏览器时，对最终 PNG 做一次视觉回读。

对既有图只优化箭头时，保留节点、容器、样式和布局，只修改对应 JSON 的 arrow：优先使用 `source_port` / `target_port`，再用 `corridor_x` / `corridor_y`，必要时用保持正交的 `route_points`；`routing_padding` 和 `port_clearance` 是高级间距参数，`label_style` 可选 `offset` 或 `badge`。改完重新生成并运行 `validate-svg.sh`，不要借机重排内容。

## 可选样式与模板

`templates/` 和 `references/style-1-flat-icon.md` 至 `style-8-dark-luxury.md` 只在父级方向协议没有锁定对应细节时作为技术参考。不要自动选择、替换或叠加主题；不要把任何样式表当成 Xiabuhua 的默认品牌。`style-diagram-matrix.md` 仅帮助匹配技术；`icons.md` 仅用于核对产品图标来源。

可选样式的实现表：Flat Icon 适合文档；Dark Terminal 适合开发说明；Blueprint 适合工程架构；Notion Clean 适合极简协作页；Glassmorphism 适合已批准的产品展示；Claude/OpenAI 参考只在项目协议明确时使用；Dark Luxury 是独立的手工技术参考。上述用途不是默认主题，也不授权把某个品牌视觉带入项目。

现有模板包括 `architecture.svg`、`data-flow.svg`、`flowchart.svg`、`sequence.svg`、`state-machine.svg`、`comparison-matrix.svg`、`timeline.svg`、`er-diagram.svg`、`network-topology.svg`、`agent-architecture.svg` 等。模板来源、许可证和 Required Notice 以本目录 [`LICENSE`](../LICENSE) 及随附声明为准；分发时保留许可证。

## 交付边界

输出 SVG 与可用时的 PNG 路径，说明风格协议、数据/拓扑假设、渲染器和未覆盖的视觉 QA。静态 SVG 仍需包含完整标签、方向、图例和异常出口；HTML/浏览器交互不能掩盖缺失的结构。
