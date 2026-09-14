# target/against; real wheel; tracked/live/mid/idle/scrollY; 5 CSS properties

类型：执行规范/工作流。主控保留视觉方向与用户选择；输入、渲染层、时序和验收按本条目落实。

## 成熟度与本地证据

```json
{
  "maturity": "execution-workflow",
  "implementation_claim": "工作流规范；邻近原语或纯状态模型不等于完整视觉实现",
  "alignment_status": "partial",
  "actual_local_evidence": [
    "项目验证记录（不随Skill发布）：tactile-browser.test.mjs"
  ],
  "runtime_required": "browser/design QA",
  "fallback": "保留真实内容与明确缺口；条件性能力不得以静态或元数据冒充实跑"
}
```

## 触发与输入

Playwright target URL/path; real mouse.wheel bursts; property churn, mid-flight, idle and scrollY

## 渲染层

tool-specific browser/media/static analysis; no product render equivalence claimed

## 版式与样式

output schema preserves operation-specific metrics/artifacts; no page layout implied

## 时序与轨道

operation timing/clock/viewport is part of the named CLI behavior

## 取消和中断

returns nonzero when --target floor is missed; Playwright page/browser closes via context

## 降级

missing Playwright or invalid target exits; no synthetic churn value

## 输出

tracked/live/churn/mid/idle/scrollY/hijacked and transform/opacity/stroke/background/color counts

## 工具输入样本

URL or local HTML target; optional reference URL via --against

## 清理

returns nonzero when --target floor is missed; Playwright page/browser closes via context

## 本地扩展

local QA adapter is separate and may be partial/missing

## 执行步骤

reproduce liveness/churn with complaint-specific browser probe

## 验收

correct + static-broken sample; input vs ambient split

## 具体检查

correct + static-broken sample; input vs ambient split

## 反例验收

source metrics only; known-good reference and intentionally static page are local negative fixtures

## 项目执行边界

输入与素材先满足该机制条件，再选择本地原语或按本工作流实现；未连接真实 DOM/Canvas/媒体的状态模型不能当视觉成品。参数示例可按内容与设备调整，调整后验证身份、几何、时序、取消、低动效与资源清理。工具需要的依赖应在执行前检查，缺失时给明确缺口，不输出伪测量结果。

## 素材与分发边界

选用第三方代码、字体、图片、地图和媒体时核验适用许可证与分发条件，并保留必要声明。范式规范不授予第三方资产的使用权；未核验资产不可默认打包。
