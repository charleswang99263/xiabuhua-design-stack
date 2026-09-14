# Motion Complete Contract

这是 Xiabuhua 的本地执行合同。它把 motion-web 的可迁移机制改写成项目拥有的 API 与验证字段，不改变上层产品、品牌和页面结构合同。

## 选择顺序

1. 先写静态完成态、真实内容、语义 DOM 和目标视口。
2. 再声明输入：native scroll、pointer/touch、keyboard、route、viewport entry、ambient clock 或 media evidence。
3. 再锁定 render layer：DOM、SVG、Canvas 2D、WebGL 或 media。一个属性只由一个 controller 写。
4. 再写 source timing、geometry、cancel/reversal、pause、dispose 和 reduced/static fallback。
5. 最后从 assets/motion-complete/runtime.js 选择一个 API；motion-complete-manifest.json 记录 recipe 与 case workflow。

## 状态字段

    trigger/input -> source state -> visual state -> committed state
                             \-> cancel/reverse -> stable fallback

source_* 字段描述来源机制；local_extension 只描述本地新增的键盘、触摸、reduced、visibility、资源清理或错误恢复规则。扩展不能改变来源的几何、时序、输入含义或数据真值。

## 覆盖等级

- implemented：本地纯模型/API可运行，已覆盖状态、取消和 dispose。
- workflow：本地已有精确合同和 API，但需要消费项目用真实 DOM、内容和输入实跑。
- conditional：依赖 WebGL、滤镜、音频、视频、重纹理或特殊资产；必须先通过能力探针和预算门。
- partial：只有邻近机制或部分字段，不能宣称同构实现。
- missing：没有可复用同构能力，保留实施目标和 fallback。

## 运行时边界

runtime.js 是无依赖的纯状态层；它不自动接管页面滚动、不强制 RAF、不加载 CDN、不提供品牌皮肤。Canvas/WebGL、音频、视频和图片资产由消费项目显式挂载，并必须保留可读 DOM/SVG 或静态替代。隐藏标签、离屏对象和 prefers-reduced-motion 是独立门，不可用一个开关代替。

## 验收

每次适配至少记录：真实输入是否触发、状态提交是否早于装饰动画、取消/反转是否回到稳定态、重排/resize 是否重新测量、资源是否 dispose、reduced/static 是否保留意义、目标视口是否无横溢出。具体 oracle 只对应一个抱怨；不得输出综合 motion 分。
