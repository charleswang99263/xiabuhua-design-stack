# Scroll-Velocity Skew

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "html-ppt-component-museum/assets/primitives/tactile-velocity.js"
  ],
  "runtime_required": "tactile velocity contract",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 触发与输入

native scroll event delta

## 影响的语义内容

source element remains in DOM and readable

## 图层与几何

passive native scroll listener; will-change only when abs(skew)>.05

## 几何与样式边界

preserve host geometry and approved style; recipe does not supply skin

## 运动参数示例

scroll delta→velocity; max skew 5deg; target velocity×.08; velocity decay .9; settle spring .1

## 状态模型

scroll delta→velocity; max skew 5deg; target velocity×.08; velocity decay .9; settle spring .1

## 取消和中断

define reversal, pointercancel/Escape, unmount and resource cleanup

## 本地扩展

separate local contract/primitive; does not rewrite source timing

## 执行步骤

map native scroll velocity to capped skew

## 验收

dt/clamp; readable geometry

## 具体检查

dt/clamp; readable geometry

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
