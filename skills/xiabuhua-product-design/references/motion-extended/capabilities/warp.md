# corner-pin homography、凸四边形、asin edge tilt clamp、投影测量

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "conditional",
  "actual_local_evidence": [
    "html-ppt-component-museum/references/graphics-runtime-contract.md"
  ],
  "runtime_required": "graphics runtime",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 渲染机制

homography canvas/WebGL or measured CSS

## 版式与样式

convex quad and edge tilt protect viewport

## 时序与轨道

corner updates scrub geometry

## 取消与资源管理

cancel gesture and release texture

## 降级

flat image fallback when unsupported

## 执行步骤

只在真实贴面/弯折目标成立时实验；不以 CSS skew 伪装已覆盖

## 验收

凸性、边缘倾角、分辨率、遮挡、fallback 和真实投影误差可测

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
