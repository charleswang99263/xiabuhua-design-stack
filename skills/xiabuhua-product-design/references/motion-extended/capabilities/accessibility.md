# motion off、hover-free、键盘/焦点、44px、稳定布局、响应式、性能 floor

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "xiabuhua-product-design/references/motion-system.md",
    "xiabuhua-product-design/references/design-qa-checklist.md"
  ],
  "runtime_required": "design QA",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 渲染机制

semantic DOM; canvas has parallel text

## 版式与样式

target and reading geometry stay stable

## 时序与轨道

motion can be fully off

## 取消与资源管理

focus/gesture cancellation returns to owner

## 降级

reduced/static exposes full content

## 执行步骤

直接采用本地 QA，尺寸按目标平台声明

## 验收

静态内容、语义、焦点、触控、窄屏、hidden/offscreen pause 通过

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
