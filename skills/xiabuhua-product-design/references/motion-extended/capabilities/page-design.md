# 机制驱动宏结构、字号/颜色/字体/空间、移动独立设计

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "xiabuhua-product-design/references/design-method.md",
    "xiabuhua-product-design/references/style-direction-workflow.md",
    "xiabuhua-product-design/references/mobile-app-method.md"
  ],
  "runtime_required": "design method + mobile",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 渲染机制

DOM/CSS page composition

## 版式与样式

measured type/space/shape values drive grid

## 时序与轨道

motion is layered after settled frame

## 取消与资源管理

direction change invalidates dependent motion

## 降级

mobile is a redesign, not scale-down

## 执行步骤

先结构/类型/空间再机制；证据来自当前项目

## 验收

motion off、type/space/contrast/shape 在目标视口成立

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
