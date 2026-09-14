# Motion tools: real execution

这些工具读取真实 URL、HTML、MP4 或字体文件并执行采集/测量。它们不会把预先写好的 JSON 当作采集结果。

当前桌面环境优先使用 node-bridge.mjs：它通过 bundled Node Playwright 真实打开页面，支持 structure、churn、verify、record；record 会产出 PNG 和 WebM，ffmpeg 存在时才额外产出 GIF。原有 Python 工具仍保留，适用于 Python Playwright/ffmpeg/fontTools 已安装的环境。

已用 bridge-fixture.html 实跑：structure 读到标题 Bridge fixture、lang zh-CN、2 个 section；churn 在真实 wheel 后读到 live=1、transform=1；verify 的真实 wheel 与 hover 均为 true 且 verdict=PASS；record 产出非空 PNG/WebM，并清理临时 video 目录。bridge-fixture-broken.html 的 verify 返回非零退出。

| 工具 | 真实输入 | 真实产物 | 缺依赖行为 |
|---|---|---|---|
| measure_churn.py | URL 或 HTML | Chromium 驱动的 wheel、mid-flight、idle、scrollY、属性 churn JSON | 缺 Python Playwright/Chromium 明确 DEPENDENCY_ERROR |
| measure_structure.py | URL/URL 文件 | Chromium 1440×900 与 390×844 的 nav/section/button/form/media/meta/font JSON | 不可加载或缺依赖明确失败 |
| measure_frames.py | MP4 | ffprobe duration、ffmpeg decoded frames、sheet/palette 等真实结果 | 缺 ffmpeg/ffprobe/Pillow/numpy 明确失败 |
| record_showcases.py | cases 目录 | Playwright screenshot/WebM 与 ffmpeg GIF | 缺依赖、case 或 WebM 明确失败 |
| subset_fonts.py | OFL/Apache TTF/OTF | fontTools 真实 subset WOFF2 和内联 CSS | 缺 fontTools、许可证或字体明确失败 |
| verify_case.py | URL/HTML | Chromium overflow、h1/lang、真实 wheel/hover、layer、VERDICT | 失败检查返回非零 |

Node bridge 用法：

    node node-bridge.mjs structure page.html --out structure.json
    node node-bridge.mjs churn page.html
    node node-bridge.mjs verify page.html
    node node-bridge.mjs record page.html --out /tmp/motion-record

上游 MIT 机制已经按审计结果重新实现；本目录当前代码是 project-owned。工具不加载 CDN、不上传、不发布。浏览器/ffmpeg/fontTools 只有在环境存在时才执行，缺失时保留明确的 workflow gap。

示例：

    python3 measure_churn.py /path/to/page.html --bursts 8
    python3 measure_structure.py http://localhost:5173 --out structure.json
    python3 measure_frames.py sheet clip.mp4 --out sheet.png
    python3 record_showcases.py /path/to/cases --case wheel-rail
    python3 subset_fonts.py pack --out faces.css Grot=Inter-Variable
    python3 verify_case.py /path/to/page.html --layer dom
