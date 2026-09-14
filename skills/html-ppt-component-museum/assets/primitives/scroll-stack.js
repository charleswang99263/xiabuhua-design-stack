/*
 * Scroll Stack / local research specimen
 *
 * Project-owned native HTML/CSS. The consuming museum can merge
 * SCROLL_STACK_RECORD into C, SCROLL_STACK_CSS into its stylesheet, and
 * SCROLL_STACK_REGISTRY into REGISTRY. It intentionally has no external
 * runtime, body-scroll capture, idle loop, or copied third-party source.
 */

const DEFAULT_SCROLL_STACK_STAGES = Object.freeze([
  {
    id: 'orient',
    kicker: '01 / ORIENT',
    title: '先把任务说清楚',
    body: '从用户要完成的动作开始，写下判断完成的条件。没有清楚的任务，后续进度只能制造错觉。',
    note: '任务范围 · 结束条件 · 未知项',
  },
  {
    id: 'sample',
    kicker: '02 / SAMPLE',
    title: '用代表性内容验证',
    body: '选择能暴露主流程、异常和边界的样本。卡片叠放保留前一步的依据，当前阶段仍然可以回看。',
    note: '代表性内容 · 正常路径 · 异常出口',
  },
  {
    id: 'observe',
    kicker: '03 / OBSERVE',
    title: '让状态变化可见',
    body: '操作、等待、完成和恢复都应有对应反馈。进度位置只表达浏览位置，不替代真实完成状态。',
    note: '进行中 · 结果 · 可恢复错误',
  },
  {
    id: 'handoff',
    kicker: '04 / HANDOFF',
    title: '留下可以交接的证据',
    body: '记录入口、依赖、验收结果和仍未验证的部分。交接完成后，使用者仍能沿着这条路径复核。',
    note: '入口 · 验收证据 · 限制说明',
  },
]);

function createScrollStack(stages = DEFAULT_SCROLL_STACK_STAGES) {
if (!Array.isArray(stages) || stages.length === 0) throw new Error('Scroll Stack needs at least one stage');
if (new Set(stages.map(stage=>stage.id)).size !== stages.length || stages.some(stage=>!/^[-\w]+$/.test(stage.id))) throw new Error('Stage IDs must be unique safe identifiers');
const SCROLL_STACK_STAGES = Object.freeze(stages.map(stage=>Object.freeze({...stage})));
const SCROLL_STACK_RECORD = Object.freeze({
  id: 'scroll-stack',
  name: 'Scroll Stack',
  group: '时间与顺序',
  task: '阶段叙事 / 局部滚动',
  fit: 'Editorial、Swiss、Collage',
  avoid: '需要精确时间比例或自动播放的流程',
  feedback: '局部滚动、按钮和键盘共同更新当前阶段；卡片按自然顺序渐进叠放',
  deps: '原生 HTML/CSS/DOM',
  source: '原创本地滚动机制；无外部运行时代码',
  quality: 'experimental',
  type: 'scrollStack',
  intro: '用一个局部滚动容器承载有依据的阶段，叠放帮助回看，不把滚动位置伪装成完成度。',
  how: '滚动右侧局部容器，或使用上/下一阶段、Home/End、方向键浏览。当前阶段会同步到可访问状态。',
  date: '2026-09-09',
});

const SCROLL_STACK_CSS = `
.scroll-stack-demo{width:100%;max-width:1080px;min-height:405px;color:var(--ink)}
.scroll-stack-layout{display:grid;grid-template-columns:minmax(180px,.72fr) minmax(0,1.28fr);gap:22px;align-items:start}
.scroll-stack-intro{padding:20px;background:var(--surface);border:1px solid var(--line)}
.scroll-stack-intro .eyebrow{margin-bottom:9px}
.scroll-stack-intro h3{font:650 25px/1.2 var(--display);margin:8px 0 10px;letter-spacing:-.04em}
.scroll-stack-intro p{font-size:12px;line-height:1.8;color:var(--muted)}
.scroll-stack-stage-list{display:grid;gap:5px;margin-top:20px}
.scroll-stack-stage{display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;min-height:48px;padding:7px 9px;text-align:left;background:none;border:1px solid transparent;border-radius:var(--r);color:var(--muted)}
.scroll-stack-stage:hover{background:var(--surface);border-color:var(--line)}
.scroll-stack-stage[aria-current=step]{background:var(--surface);border-color:var(--accent);color:var(--ink);box-shadow:inset 3px 0 0 var(--accent)}
.scroll-stack-stage span{font:10px var(--mono);color:var(--accent)}
.scroll-stack-stage strong{font-size:12px}
.scroll-stack-local-scroll{position:relative;max-height:min(67vh,570px);height:570px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:14px 12px 110px 4px;border-left:1px solid var(--line);outline-offset:-4px}
.scroll-stack-anchor{height:1px;scroll-margin-top:28px;pointer-events:none}
.scroll-stack-card{position:sticky;top:calc(14px + var(--stack-index) * 18px);z-index:calc(20 + var(--stack-index));display:flex;flex-direction:column;justify-content:space-between;min-height:205px;margin:0 0 18px;padding:22px 22px 18px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow);transform:translateY(calc(var(--stack-index) * 1px));transition:border-color .2s,transform .2s}
.scroll-stack-card[aria-current=step]{border-color:var(--accent);transform:translateY(0)}
.scroll-stack-card .scroll-stack-kicker{font:10px var(--mono);letter-spacing:.1em;color:var(--accent2)}
.scroll-stack-card h4{font:650 24px/1.2 var(--display);letter-spacing:-.04em;margin:14px 0 8px}
.scroll-stack-card p{font-size:13px;line-height:1.85;color:var(--muted);max-width:480px}
.scroll-stack-card .scroll-stack-note{margin-top:20px;padding-top:12px;border-top:1px solid var(--line);font:10px var(--mono);color:var(--accent2)}
.scroll-stack-tail{height:570px;pointer-events:none}
.scroll-stack-controls{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:16px}
.scroll-stack-controls button{min-height:44px}
.scroll-stack-status{margin-left:auto;font:11px var(--mono);color:var(--muted)}
.scroll-stack-demo[data-motion=reduce] .scroll-stack-card{position:relative;top:auto;transform:none;margin-bottom:12px;transition:none}
.scroll-stack-demo.is-static .scroll-stack-local-scroll{height:auto;max-height:none;overflow:visible;padding-bottom:0;border-left:0}
.scroll-stack-demo.is-static .scroll-stack-card{position:relative;top:auto;transform:none;margin-bottom:12px}
@media(max-width:680px){.scroll-stack-layout{grid-template-columns:1fr;gap:14px}.scroll-stack-intro{padding:16px}.scroll-stack-stage-list{grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-top:14px}.scroll-stack-stage{display:block;text-align:center;min-height:44px;padding:7px 4px}.scroll-stack-stage strong{display:block;font-size:10px;margin-top:3px}.scroll-stack-local-scroll{height:500px;max-height:62vh;border-left:0;border-top:1px solid var(--line);padding:12px 5px 90px}.scroll-stack-card{min-height:205px;padding:19px 17px 16px}.scroll-stack-card h4{font-size:21px}.scroll-stack-status{width:100%;margin-left:0}}
@media(max-width:390px){.scroll-stack-intro h3{font-size:22px}.scroll-stack-stage-list{grid-template-columns:repeat(2,minmax(0,1fr))}.scroll-stack-card{min-height:225px}.scroll-stack-controls{display:grid;grid-template-columns:1fr 1fr}.scroll-stack-controls button{width:100%}.scroll-stack-controls .scroll-stack-status{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.scroll-stack-card{transition:none}.scroll-stack-local-scroll{scroll-behavior:auto}}
`;

const clampScrollStackIndex = value => Math.max(0, Math.min(SCROLL_STACK_STAGES.length - 1, Number.isFinite(+value) ? Math.round(+value) : 0));
const readMuseumState = () => (typeof S === 'object' && S ? S : { static: false, paused: false, reduced: false });
const readEsc = value => (typeof esc === 'function' ? esc(value) : String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])));

function scrollStackInitial() {
  return { index: 0, scrollTop: 0 };
}

function scrollStackRender(data = {}, options = {}) {
  const museum = readMuseumState();
  const staticMode = options.static === undefined ? Boolean(museum.static) : Boolean(options.static);
  const index = clampScrollStackIndex(data.index);
  return `<div class="demo scroll-stack-demo${staticMode ? ' is-static' : ''}" data-scroll-stack data-current-stage="${index}" data-motion="${museum.reduced ? 'reduce' : 'normal'}">
    <div class="scroll-stack-layout">
      <section class="scroll-stack-intro" aria-label="Scroll Stack 说明">
        <div class="eyebrow">LOCAL SCROLL / ${SCROLL_STACK_STAGES.length} STAGES</div>
        <h3>回看每一步，<br>明确当前位置。</h3>
        <p>卡片在局部容器中自然顺序叠放。滚动表达浏览位置，阶段按钮和键盘提供等价入口。</p>
        <nav class="scroll-stack-stage-list" aria-label="Scroll Stack 阶段">
          ${SCROLL_STACK_STAGES.map((stage, i) => `<button class="scroll-stack-stage" data-scroll-stack-stage="${i}" aria-controls="scroll-stack-card-${stage.id}" aria-current="${i === index ? 'step' : 'false'}"><span>0${i + 1}</span><strong>${readEsc(stage.title)}</strong></button>`).join('')}
        </nav>
      </section>
      <div class="scroll-stack-local-scroll" data-scroll-stack-scroll tabindex="0" aria-label="滚动浏览 ${SCROLL_STACK_STAGES.length} 个阶段">
        ${SCROLL_STACK_STAGES.map((stage, i) => `<div class="scroll-stack-anchor" data-scroll-stack-anchor="${i}" aria-hidden="true"></div><article class="scroll-stack-card" id="scroll-stack-card-${stage.id}" data-scroll-stack-card="${i}" style="--stack-index:${i}" tabindex="-1" role="group" aria-labelledby="scroll-stack-title-${stage.id}" aria-current="${i === index ? 'step' : 'false'}"><div><div class="scroll-stack-kicker">${readEsc(stage.kicker)}</div><h4 id="scroll-stack-title-${stage.id}">${readEsc(stage.title)}</h4><p>${readEsc(stage.body)}</p></div><div class="scroll-stack-note">${readEsc(stage.note)}</div></article>`).join('')}<div class="scroll-stack-tail" aria-hidden="true"></div>
      </div>
    </div>
    <div class="scroll-stack-controls" data-scroll-stack-controls>
      <button data-scroll-stack-prev aria-label="上一个阶段">← 上一阶段</button>
      <button data-scroll-stack-next class="primary" aria-label="下一个阶段">下一阶段 →</button>
      <button data-scroll-stack-reset aria-label="回到第一个阶段">重置</button>
      <span class="scroll-stack-status" data-scroll-stack-status aria-live="polite">第 ${index + 1} / ${SCROLL_STACK_STAGES.length} 阶段</span>
    </div>
  </div>`;
}

function scrollStackSetup(root, data, scope, options = {}) {
  if (!root || !scope) return;
  const host = typeof root.matches === 'function' && root.matches('[data-scroll-stack]') ? root : root.querySelector('[data-scroll-stack]') || root;
  const viewport = host.querySelector('[data-scroll-stack-scroll]');
  const cards = [...host.querySelectorAll('[data-scroll-stack-card]')];
  const anchors = [...host.querySelectorAll('[data-scroll-stack-anchor]')];
  const stageButtons = [...host.querySelectorAll('[data-scroll-stack-stage]')];
  const previous = host.querySelector('[data-scroll-stack-prev]');
  const next = host.querySelector('[data-scroll-stack-next]');
  const reset = host.querySelector('[data-scroll-stack-reset]');
  const museum = () => {
    const baseMuseum = readMuseumState();
    return {
    ...baseMuseum,
    ...(options.state || {}),
    static: options.static === undefined ? Boolean((options.state || {}).static ?? baseMuseum.static) : Boolean(options.static),
    paused: options.paused === undefined ? Boolean((options.state || {}).paused ?? baseMuseum.paused) : Boolean(options.paused),
    reduced: options.reduced === undefined ? Boolean((options.state || {}).reduced ?? baseMuseum.reduced) : Boolean(options.reduced),
    };
  };
  if (!viewport || cards.length !== SCROLL_STACK_STAGES.length || anchors.length !== cards.length) return;

  let disposed = false;
  const blocked = () => disposed || museum().static || museum().paused;
  const reduced = () => Boolean(museum().reduced || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion:reduce)').matches));

  const paint = index => {
    const current = clampScrollStackIndex(index);
    data.index = current;
    data.scrollTop = viewport.scrollTop;
    host.dataset.currentStage = String(current);
    stageButtons.forEach((button, i) => {
      button.setAttribute('aria-current', i === current ? 'step' : 'false');
    });
    cards.forEach((card, i) => {
      card.setAttribute('aria-current', i === current ? 'step' : 'false');
    });
    if (previous) previous.disabled = current === 0 || blocked();
    if (next) next.disabled = current === cards.length - 1 || blocked();
    if (reset) reset.disabled = current === 0 || blocked();
    const status = host.querySelector('[data-scroll-stack-status]');
    if (status) status.textContent = `第 ${current + 1} / ${cards.length} 阶段：${SCROLL_STACK_STAGES[current].title}`;
  };

  const nearestStage = () => {
    const anchor = viewport.getBoundingClientRect().top + 28;
    return anchors.reduce((best, marker, i) => {
      const distance = Math.abs(marker.getBoundingClientRect().top - anchor);
      return distance < best.distance ? { index: i, distance } : best;
    }, { index: clampScrollStackIndex(data.index), distance: Infinity }).index;
  };

  const goTo = (index, focus = false) => {
    if (blocked()) return;
    const current = clampScrollStackIndex(index);
    const card = cards[current];
    const marker = anchors[current];
    paint(current);
    const target = Math.max(0, marker.offsetTop - 14);
    if (typeof viewport.scrollTo === 'function') viewport.scrollTo({ top: target, behavior: 'auto' });
    else viewport.scrollTop = target;
    data.scrollTop = target;
    if (focus) card.focus({ preventScroll: true });
  };

  const onScroll = () => {
    if (disposed) return;
    if (museum().static || museum().paused) {
      if (!museum().static && Number.isFinite(+data.scrollTop)) viewport.scrollTop = +data.scrollTop;
      return;
    }
    data.scrollTop = viewport.scrollTop;
    paint(nearestStage());
  };
  const onKey = event => {
    if (blocked()) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); goTo(data.index + 1); }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); goTo(data.index - 1); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(cards.length - 1); }
  };
  const bindStageButton = (button, event) => { if (event.defaultPrevented) return; goTo(+button.dataset.scrollStackStage, true); };
  const refresh = () => {
    host.dataset.motion = reduced() ? 'reduce' : 'normal';
    if (!museum().static && Number.isFinite(+data.scrollTop)) viewport.scrollTop = Math.max(0, +data.scrollTop);
    paint(data.index);
  };

  scope.on(viewport, 'scroll', onScroll, { passive: true });
  scope.on(viewport, 'keydown', onKey);
  stageButtons.forEach(button => scope.on(button, 'click', event => bindStageButton(button, event)));
  scope.on(previous, 'click', () => goTo(data.index - 1, true));
  scope.on(next, 'click', () => goTo(data.index + 1, true));
  scope.on(reset, 'click', () => goTo(0, true));
  if (typeof window !== 'undefined') scope.on(window, 'resize', refresh);
  if (typeof document !== 'undefined') scope.on(document, 'museum-motion', refresh);
  scope.cleanup(() => { disposed = true; });

  refresh();
}

const SCROLL_STACK_REGISTRY = Object.freeze({
  initial: scrollStackInitial,
  render: scrollStackRender,
  setup: scrollStackSetup,
});

return Object.freeze({
  SCROLL_STACK_STAGES,
  SCROLL_STACK_RECORD,
  SCROLL_STACK_CSS,
  SCROLL_STACK_REGISTRY,
  scrollStackInitial,
  scrollStackRender,
  scrollStackSetup,
});
}
const SCROLL_STACK_API = Object.freeze({...createScrollStack(), createScrollStack});
if (typeof module !== 'undefined' && module.exports) module.exports = SCROLL_STACK_API;
if (typeof globalThis !== 'undefined') Object.assign(globalThis, SCROLL_STACK_API);
