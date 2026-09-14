# Motion Complete Recipe Execution Index

| ID | 本地 API | 来源输入与关键参数 | 本地执行边界 |
|---|---|---|---|
| 01 | textSplitReveal | in-view；line wrapper；700ms/80ms | 真实文本保留在 DOM；不把 words 入口误当 line split |
| 02 | magneticHover | mousemove；strength .35/.4；0.1s 入、0.5s 回 | hitbox 不随 transform 扩大；粗指针走静态反馈 |
| 03 | clipCurtain | in-view；inset 100→0；.8–.9s；内图 1.15→1 | reverse/cancel；reduced 直接揭示 |
| 04 | scrollVelocity | native scroll delta/dt；max 5deg；decay .9 | 这是 scroll velocity；tactile-velocity.js 的 pointer velocity 不能冒充 |
| 05 | horizontalRail | vertical scroll；pin/scrub1/snap | 桌面局部 pin；移动端 vertical stack，不 hijack 页面 |
| 06 | parallaxDepth | pointer/touch/keyboard；depth .2/.5/.8 | 保留三层深度关系；输入路径必须可替代 |
| 07 | customCursor | document pointer；follower .12；24→48px | 只对 fine pointer；不隐藏系统 cursor |
| 08 | routeTransition | route key；enter .45s/exit .25s/mode wait | 状态、焦点和 return context 属于路由合同 |
| 09 | pinnedSequence | scroll/step；end 200vh/scrub1.5 | 移动端线性步骤；不让动画完成冒充业务完成 |
| 10 | counterReveal | viewport entry；1.4s/power2/once | 数据立即 commit；动画只显示插值 |
| 11 | gooMask | pointer drag/hover；6-point lag；blur22/matrix22-9 | SVG filter 条件能力；必须有第二层和 filter fallback |
| 12 | scrollOwner | wheel/native/Lenis clock；lerp .085 | 保证单一 scroll owner；销毁 ticker/listener |
| 13 | adaptiveHeader | header 下 computed background；probe y38/luminance145 | 静态 class 与动态 luminance 分开 |
| 14 | annotationRing | painted bbox/dwell；perimeter341/bbox1.22–1.30 | 标记是 affordance；透明 margin 不参与定位 |
| 15 | verletCurtain | pointer repulsion + wheel energy；5 passes/.35/.97 | 新 cloth lab；独立列、零横向链接、DOM fallback |
| 16 | nativeReveal | view/trigger；.35s/sibling60ms/@supports | 先写 finished CSS；Firefox/reduced 不得隐藏 |
| 17 | cornerPin | four corner positions；matrix3d；tilt asin(h/w)×.85 | 新 homography lab；凸性/边缘倾角/清晰度 gate |
| 18 | verletCardChain | pointer head；N7/rest118/gravity.55/16 iter | 新 card-chain lab；稳定 identity、segment oracle、dispose |
| 19 | slackString | exact datum + real drag；dt1/120/tipK1600/body3×.5 | 新 slack lab；endpoint accuracy 与 sag 双判据 |
| 20 | cumulativeEmergence | visible dealing clock；tick167/skips1/2/3/CAP46 | hard placement；dealt 与 live 分离；z-order 按到达 |

Recipe 11、15、17、18、19 属于 conditional/new lab；recipe 04、06 的本地近邻 primitive 输入不同，保持 partial。所有 recipe 都必须在目标项目重新验证，lab 的状态不等于产品验收。
