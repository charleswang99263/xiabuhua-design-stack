# wheel-rail

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "html-ppt-component-museum/assets/primitives/scroll-stack.js",
    "html-ppt-component-museum/assets/primitives/tactile-parallax.js"
  ],
  "runtime_required": "case authoring + local QA",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 触发与输入

real case gesture listed in invariants; probe cannot replace event

## 空间与输入

rail translates while scrollY0; far plane 7× near; word opacity/stroke scrub

## 渲染机制

DOM + inline SVG; zero canvas; wheel rail + 3 pointer planes + radar

## 几何与样式边界

case skin is source-specific; only mechanism reasoning transfers

## 时序与轨道

wheel passive:false preventDefault; exponential k6.2; pointer corner sweep; radar 3.95s turn

## 取消和中断

real interruption, reduced/static and disposal required

## 等义替代

ambient radar continues; native scroll is preferred local extension; reduced freezes nonessential

## 本地扩展

partial scroll/parallax

## 执行步骤

默认保留原生滚动，只有展示任务成立才实验 wheel hijack

## 验收

preventDefault/scrollY/lag/depth/churn/idle/keyboard if justified

## 具体检查

preventDefault/scrollY/lag/depth/churn/idle/keyboard if justified

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
