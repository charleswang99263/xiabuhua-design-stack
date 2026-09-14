# press-stack

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "html-ppt-component-museum/assets/primitives/scroll-stack.js"
  ],
  "runtime_required": "case authoring + local QA",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 触发与输入

real case gesture listed in invariants; probe cannot replace event

## 空间与输入

sticky top0; progress clamp from scrollY-offsetTop/vh; reduced readable stack

## 渲染机制

DOM sticky screens + canvas sleeves/records; 9 screens

## 几何与样式边界

case skin is source-specific; only mechanism reasoning transfers

## 时序与轨道

native scrollY progress; type wipe ~1.6s of scroll; pointer depth layers

## 取消和中断

real interruption, reduced/static and disposal required

## 等义替代

native scroll remains; Canvas draws all art at load; no bitmap pulls

## 本地扩展

partial Scroll Stack + graphics

## 执行步骤

复用 sticky 局部滚动，但单独补 Canvas art/wipe 合同

## 验收

scrollY/sticky/Scroll Stack + Canvas lifecycle + reduced

## 具体检查

scrollY/sticky/Scroll Stack + Canvas lifecycle + reduced

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
