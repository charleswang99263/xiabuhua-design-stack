# floor + detent/beats/strings/stack/rail/layer/follow/flipbook/curtain/lyre

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "html-ppt-component-museum/validate-museum.mjs"
  ],
  "runtime_required": "browser/design QA",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 触发与输入

headless Chromium at 320/375/414/768/1440; floor plus selected domain flag; failure/verdict

## 渲染层

tool-specific browser/media/static analysis; no product render equivalence claimed

## 版式与样式

output schema preserves operation-specific metrics/artifacts; no page layout implied

## 时序与轨道

operation timing/clock/viewport is part of the named CLI behavior

## 取消和中断

browser closes after run; any failure prints failing checks and exits nonzero

## 降级

any floor/domain assertion failure returns nonzero VERDICT FAIL; no aggregate soft pass

## 输出

prints errors, overflow by WIDTHS, type ratio, layer/domain assertions and final VERDICT; flags select domain probes

## 工具输入样本

one case HTML or dev-server URL plus selected domain flag

## 清理

browser closes after run; any failure prints failing checks and exits nonzero

## 本地扩展

local QA adapter is separate and may be partial/missing

## 执行步骤

compose floor and one domain oracle; fail on known-broken mapping

## 验收

one complaint per oracle; real input + broken sample

## 具体检查

one complaint per oracle; real input + broken sample

## 反例验收

each case HTML is source fixture; broken layer/overflow/real-input behavior is negative fixture

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
