# uniform、noise/ripple/liquid/glitch/grain/2.5D/trail/text texture、编译陷阱、降级

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "conditional",
  "actual_local_evidence": [
    "html-ppt-component-museum/references/graphics-runtime-contract.md",
    "html-ppt-component-museum/assets/primitives/graphics-three.js"
  ],
  "runtime_required": "graphics + three",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 渲染机制

WebGL fragment/vertex pipeline

## 版式与样式

shader geometry/colour-space rules are explicit

## 时序与轨道

time uniform and seekable loop only when needed

## 取消与资源管理

cancel RAF and release GPU resources

## 降级

DOM/CSS/image fallback for compile/mobile failure

## 执行步骤

只抽取 uniform/色彩空间/深度/DPR/visibility/fallback

## 验收

编译错误、色彩空间、WebGL fallback、移动/reduced 可测

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
