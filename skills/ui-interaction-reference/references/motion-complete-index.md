# Motion Complete Local Index

在 interaction-pattern-selection.md 完成任务/视觉方向判断后，使用这个索引选择本地机制。它是执行路由，不是新的风格选择器。

## 已有可复用机制

| 本地实现 | 可承接 | 不能直接替代 |
|---|---|---|
| tactile-magnetic.js | bounded magnetic hysteresis、drag capture、Escape/cancel | source recipe 的具体 strength/timing，需项目调参 |
| tactile-velocity.js | pointer velocity deformation、dt/filter/cap | recipe-04 的 native scroll velocity |
| tactile-parallax.js | pointer/touch/keyboard layer offsets | scroll-driven .2/.5/.8 需单独接 scroll source |
| sticker-peel.js | reversible reveal、progress、pointer/keyboard | SVG goo filter 与 corner pin |
| scroll-stack.js | local scroll、stable DOM、linear/reduced fallback | source Canvas art/wipe、wheel hijack |
| text-entry.js | accessible short text entrance、decode/word/type/fade | source line-by-line visual wrapping |
| graphics-common.js | seeded clock、visibility、dispose、DPR | 完整 audio/video/3D scene |
| graphics-three.js | optional WebGL ownership、fallback、resource stats | ink crowd/image-plane/lighting full case |

## Motion Complete API

其余 12 个或近邻机制在 html-ppt-component-museum/assets/motion-complete/runtime.js：clipCurtain、horizontalRail、customCursor、routeTransition、pinnedSequence、counterReveal、gooMask、scrollOwner、adaptiveHeader、annotationRing、verletCurtain、nativeReveal、cornerPin、verletCardChain、slackString、cumulativeEmergence 与基础 textSplitReveal、magneticHover、scrollVelocity、parallaxDepth。

每个 API 都暴露 state、来源输入/通道/时序、状态推进、取消或反向路径和 dispose()。用 motion-complete/lab.html 做机制级检查，再在目标项目写真实输入 oracle。

## 条件能力

- SVG goo、homography、Verlet cloth/card chain、WebGL ink/image-plane、音频 bus、视频帧分析和大场景 streaming 都是条件或新实验。
- 必须先有 layer/asset/permission/budget/fallback 合同；没有时保持 partial、conditional 或 missing。
- quiet/plain motion 是有效结果；不得为了消耗 recipe 配额添加动效。

## 证据边界

本索引只指向本地项目拥有文件。外部参考只提供机制事实和参数，不能作为本地实现或产品视觉方向的证据。任何使用上游 MIT 内容的未来适配，都必须保留许可证 notice；本目录当前代码为原创实现。
