# 组件状态

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "exists",
  "actual_local_evidence": [
    "xiabuhua-product-design/references/component-geometry-and-system-truth.md",
    "html-ppt-component-museum/references/component-catalog.md"
  ],
  "runtime_required": "local task contract",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 任务触发

named component request

## 路由结果

component state matrix

## 排除情形

exclude style-only copy

## 渲染层

DOM/native semantics

## 版式与样式

component state matrix owns its page/component layout before motion

## 状态编排

micro feedback only

## 取消与资源管理

route can stop before implementation; built interaction must support interruption/return as declared by local contract

## 降级

keyboard/focus/disabled/error

## 本地扩展

keyboard/focus/disabled/error

## 执行步骤

先列 state matrix，再选一个局部机制

## 验收

route is explicit, static/reduced state is readable, and required real input/oracle is named

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
