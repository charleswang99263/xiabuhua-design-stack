# page stack、token substrate、font metrics、@layer、file layout、image first paint、budget/deploy

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "xiabuhua-product-design/references/environment.md",
    "xiabuhua-product-design/references/style-implementation.md"
  ],
  "runtime_required": "environment + style",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 渲染机制

lowest page/motion stack rung

## 版式与样式

token/font/file layer fixed before components

## 时序与轨道

runtime/deploy timing depends on actual stack

## 取消与资源管理

abort build/load and cleanup assets

## 降级

fallback stack is declared

## 执行步骤

复用升级门槛/资源预算，发布走当前契约

## 验收

栈选择有缺口；字体/资源/构建/移动/产物路径可追溯

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
