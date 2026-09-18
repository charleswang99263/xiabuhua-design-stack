# 兼容、依赖与验收范围

## 安装

安装器使用 Python 3 标准库（建议3.10及以上）。宿主须允许访问本地文件并运行命令；纯聊天平台不能凭一句话自动修改本机，云端上传也可能有大小限制。本仓库不假装是所有平台都可直接上传的单 Skill ZIP。

| 宿主 | 目录与说明 |
|---|---|
| Codex | 默认 `~/.agents/skills`；检查同一宿主旧 `~/.codex/skills` 六成员及遗留名称 |
| Claude Code | 默认 `~/.claude/skills`；项目级范围应显式指定 `--target` |
| Cursor | 默认 `~/.cursor/skills`；项目级范围应显式指定 `--target` |
| 其他 Agent | `--host generic --target "宿主已确认的技能目录"`；可直接读取 SKILL.md 与相对引用 |

文件格式/目录来源：[Claude Code](https://code.claude.com/docs/en/skills)、[Cursor](https://cursor.com/docs/skills)。宿主规则可能变化，安装 Agent 应核对自己的实际配置。刷新或新会话后检查技能发现列表，文件复制成功不保证当前会话已刷新缓存。

## 运行

| 工作 | 所需环境 | 缺失时 |
|---|---|---|
| 设计方法、风格、图表与交互规范 | Agent 能读取文件 | 不依赖 Codex 专有 API |
| 组件/触感/数据图与风格演示 | 现代浏览器，本地HTTP服务 | 不用安装 npm；图形失败有明确替代状态 |
| Three空间场景 | 浏览器WebGL | 明示二维降级，不冒充GPU成功 |
| 浏览器测量与录制 | Node + Playwright + Chromium，或Python Playwright | 明确依赖缺口；不输出伪测量 |
| 视频解码/GIF | ffmpeg、ffprobe及对应脚本依赖 | 保留截图/WebM等可用产物，标明未生成项 |
| 字体子集 | fontTools、Brotli和适用字体许可 | 保留原字体/系统替代并说明边界 |
| 自动PDF/PPTX/PNG辅助 | 对应Playwright、python-pptx、SVG渲染器等 | 可用浏览器打印等路径时需实看输出 |
| 新位图、Figma/Sketch/MasterGo编辑 | 当前宿主对应工具/连接 | 不声称已有画布访问或编辑能力 |

Hugeicons / Iconoir 图标包以及 GSAP / @gsap/react 不随设计栈安装。内置的是选择与执行规范；消费项目需要时按其依赖管理和授权规则配置。高级 GSAP API 通过固定审核版本的官方 Skill 索引与当前适用 API 文档按主题核验；离线时不得将未核验的新能力宣称可用。

安装不会静默下载依赖、浏览器、字体、付费组件或创建账号。需要的依赖由 Agent 在当前任务明确需要时按用户授权配置。

## 已验证与未验证

本地已验证 macOS/Chromium 下的交互、图表与资源加载，磁吸/Tab/滑动边界，以及安装迁移、失败恢复、回滚保护等测试。仓库自动化测试进一步检查文件完整性和安装行为。

跨宿主目录兼容不等于已实测所有 Agent、OS、浏览器与模型。Windows/Linux 的文件操作行为以本仓库 CI 结果为准；Claude/Cursor 的真实技能发现仍需安装后的宿主验证。视频解码与字体子集依赖未在当前机器齐备，未宣称这些完整链路已经实跑。

61图表、12报告、20配方是规范覆盖；实验性模型和条件性工作流不是完整生产组件。生产数据、响应速度和最终设计质量必须在消费项目中验证。
