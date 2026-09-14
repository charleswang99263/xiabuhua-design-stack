/*
 * Minimal HTML Deck Runtime for a fixed-stage HTML deck.
 *
 * The host supplies slide markup and presentation CSS. This runtime provides
 * stage scaling, slide state, navigation, input routing, and focus handling.
 * Execution CSS is supplied by viewport-base.css.
 */

(() => {
  const DEFAULT_WIDTH = 1920;
  const DEFAULT_HEIGHT = 1080;
  const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable]';
  const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, [contenteditable], [role="button"], [role="slider"], [data-deck-interactive]';

  const isPositiveFinite = (value) => Number.isFinite(value) && value > 0;
  const isEditable = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(EDITABLE_SELECTOR)) || target.isContentEditable;
  };

  class DeckStage extends HTMLElement {
    static get observedAttributes() { return ['width', 'height', 'noscale']; }
    static _active = null;
    static _instances = new Set();

    static _activate(deck) {
      if (DeckStage._active === deck) return;
      const previous = DeckStage._active;
      DeckStage._active = deck;
      previous?.removeAttribute('data-html-deck-runtime-active');
      deck?.setAttribute('data-html-deck-runtime-active', '');
    }

    connectedCallback() {
      if (this._connected || this._initPending) return;
      if (this.children.length) { this._initialize(); return; }
      this._initPending = true;
      // A runtime script in <head> can upgrade the element before its slides
      // are parsed. Wait until authored children exist.
      queueMicrotask(() => {
        this._initPending = false;
        if (!this.isConnected || this._connected) return;
        if (!this.children.length) {
          this._childObserver = new MutationObserver(() => {
            if (!this.children.length || this._initTimer) return;
            this._initTimer = window.setTimeout(() => {
              this._initTimer = null;
              this._childObserver?.disconnect();
              this._childObserver = null;
              this._initialize();
            }, 0);
          });
          this._childObserver.observe(this, { childList: true });
          return;
        }
        this._initialize();
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue || !this._connected) return;
      if (name === 'noscale') { this._scale(); return; }
      if (name === 'width' || name === 'height') this._applyDimensions();
    }

    _readDimension(name, fallback) {
      const raw = this.getAttribute(name);
      if (raw == null || raw.trim() === '') return fallback;
      const value = Number(raw);
      if (!isPositiveFinite(value)) {
        const message = `deck-stage ${name} must be a positive finite number; keeping ${fallback}`;
        this.setAttribute('data-html-deck-runtime-error', message);
        console.error(message);
        return fallback;
      }
      return value;
    }

    _applyDimensions() {
      this._width = this._readDimension('width', this._width || DEFAULT_WIDTH);
      this._height = this._readDimension('height', this._height || DEFAULT_HEIGHT);
      this.style.setProperty('--html-deck-runtime-stage-width', `${this._width}px`);
      this.style.setProperty('--html-deck-runtime-stage-height', `${this._height}px`);
      this._scale();
    }

    _initialize() {
      if (this._connected || !this.isConnected) return;
      this._connected = true;
      DeckStage._instances.add(this);
      this.classList.add('execution-viewport');
      this.setAttribute('data-html-deck-runtime-runtime', '');
      this.tabIndex = this.tabIndex < 0 ? 0 : this.tabIndex;
      this._width = DEFAULT_WIDTH;
      this._height = DEFAULT_HEIGHT;
      this._applyDimensions();
      this._index = 0;
      this._wheelLock = false;
      this._lastFocus = null;
      this._touchStart = null;
      if (!this._canvas) this._buildFrame();
      this._bindEvents();
      if (typeof ResizeObserver === 'function') {
        this._resizeObserver = new ResizeObserver(() => this._scale());
        this._resizeObserver.observe(this);
      } else {
        this._onResize = () => this._scale();
        window.addEventListener('resize', this._onResize);
      }
      this._scale();
      this._setActive(0, 'init', false);
      if (!DeckStage._active) DeckStage._activate(this);
    }

    disconnectedCallback() {
      this._childObserver?.disconnect();
      this._childObserver = null;
      window.clearTimeout(this._initTimer);
      this._initTimer = null;
      this._resizeObserver?.disconnect();
      if (this._onResize) window.removeEventListener('resize', this._onResize);
      this._unbindEvents?.();
      window.clearTimeout(this._wheelTimer);
      DeckStage._instances.delete(this);
      if (DeckStage._active === this) DeckStage._activate([...DeckStage._instances][0] || null);
      this._connected = false;
    }

    get currentIndex() { return this._index; }
    get stageWidth() { return this._width; }
    get stageHeight() { return this._height; }
    get slides() { return this._slides ? [...this._slides] : []; }

    _buildFrame() {
      this._slides = [...this.children].filter((node) => node.nodeType === Node.ELEMENT_NODE);
      this._frame = document.createElement('div');
      this._frame.className = 'execution-frame';
      this._canvas = document.createElement('div');
      this._canvas.className = 'execution-canvas deck-stage';
      this._canvas.setAttribute('aria-live', 'polite');
      this._frame.append(this._canvas);
      this.append(this._frame);
      this._slides.forEach((slide, index) => {
        slide.classList.add('slide');
        slide.dataset.slideIndex = String(index);
        slide.tabIndex = -1;
        this._canvas.append(slide);
      });
    }

    _bindEvents() {
      this._onPointerDown = () => DeckStage._activate(this);
      this._onFocusIn = () => DeckStage._activate(this);
      this._onKeyDown = (event) => {
        // Only one deck owns document/body keyboard events at a time.
        if (DeckStage._active !== this) return;
        const target = event.target;
        const inDeck = this.contains(target) || target === document.body || target === document.documentElement;
        if (!inDeck || isEditable(target) || event.ctrlKey || event.metaKey || event.altKey) return;
        if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) return;
        const key = event.key;
        const direction = key === 'ArrowRight' || key === 'PageDown' || key === ' ' ? 1
          : key === 'ArrowLeft' || key === 'PageUp' ? -1 : 0;
        if (direction) {
          event.preventDefault();
          this.goTo(this._index + direction, 'keyboard', true);
          return;
        }
        if (key === 'Home' || key === 'End') {
          event.preventDefault();
          this.goTo(key === 'Home' ? 0 : this._slides.length - 1, 'keyboard', true);
          return;
        }
        if (/^[0-9]$/.test(key)) {
          const targetIndex = key === '0' ? 9 : Number(key) - 1;
          if (targetIndex < this._slides.length) {
            event.preventDefault();
            this.goTo(targetIndex, 'keyboard', true);
          }
        }
      };
      this._onWheel = (event) => {
        if (!this.contains(event.target) || isEditable(event.target) || this._wheelLock) return;
        if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
        DeckStage._activate(this);
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 12) return;
        event.preventDefault();
        this._wheelLock = true;
        this.goTo(this._index + (event.deltaY > 0 ? 1 : -1), 'wheel', true);
        this._wheelTimer = window.setTimeout(() => { this._wheelLock = false; }, 360);
      };
      this._onTouchStart = (event) => {
        if (event.touches.length !== 1 || isEditable(event.target) || event.target.closest?.(INTERACTIVE_SELECTOR)) {
          this._touchStart = null;
          return;
        }
        DeckStage._activate(this);
        this._touchStart = event.touches[0];
      };
      this._onTouchEnd = (event) => {
        if (!this._touchStart || isEditable(event.target)) return;
        const end = event.changedTouches[0];
        const dx = end.clientX - this._touchStart.clientX;
        const dy = end.clientY - this._touchStart.clientY;
        this._touchStart = null;
        if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) {
          event.preventDefault();
          this.goTo(this._index + (dx < 0 ? 1 : -1), 'touch', true);
        }
      };
      this.addEventListener('pointerdown', this._onPointerDown);
      this.addEventListener('focusin', this._onFocusIn);
      document.addEventListener('keydown', this._onKeyDown);
      this.addEventListener('wheel', this._onWheel, { passive: false });
      this.addEventListener('touchstart', this._onTouchStart, { passive: true });
      this.addEventListener('touchend', this._onTouchEnd, { passive: false });
      this._unbindEvents = () => {
        this.removeEventListener('pointerdown', this._onPointerDown);
        this.removeEventListener('focusin', this._onFocusIn);
        document.removeEventListener('keydown', this._onKeyDown);
        this.removeEventListener('wheel', this._onWheel);
        this.removeEventListener('touchstart', this._onTouchStart);
        this.removeEventListener('touchend', this._onTouchEnd);
      };
    }

    _scale() {
      if (!this._canvas || !isPositiveFinite(this._width) || !isPositiveFinite(this._height)) return;
      const scale = this.hasAttribute('noscale') ? 1 : Math.min(
        this.clientWidth / this._width,
        this.clientHeight / this._height,
      );
      this._canvas.style.transform = `scale(${Math.max(0, scale)})`;
    }

    _setActive(rawIndex, reason, shouldFocus) {
      if (!this._slides.length) return;
      const nextIndex = Math.max(0, Math.min(this._slides.length - 1, rawIndex));
      const previousIndex = this._index;
      const previousSlide = this._slides[previousIndex] || null;
      const slide = this._slides[nextIndex];
      if (previousSlide && previousSlide !== slide && this.contains(document.activeElement)) this._lastFocus = document.activeElement;
      this._index = nextIndex;
      this._slides.forEach((item, index) => {
        const active = index === nextIndex;
        item.classList.toggle('active', active);
        item.classList.toggle('visible', active);
        item.setAttribute('aria-hidden', active ? 'false' : 'true');
        item.inert = !active;
        if (active) item.removeAttribute('inert');
        else item.setAttribute('inert', '');
      });
      if (shouldFocus && slide && !isEditable(document.activeElement)
        && (this._canvas.contains(document.activeElement) || document.activeElement === document.body)) {
        slide.focus({ preventScroll: true });
      }
      this.dispatchEvent(new CustomEvent('slidechange', {
        bubbles: true,
        composed: true,
        detail: { index: nextIndex, previousIndex, total: this._slides.length, slide, previousSlide, reason },
      }));
    }

    goTo(index, reason = 'api', shouldFocus = false) { this._setActive(index, reason, shouldFocus); }
    next(reason = 'api') { this.goTo(this._index + 1, reason, reason !== 'api'); }
    prev(reason = 'api') { this.goTo(this._index - 1, reason, reason !== 'api'); }

    prepareForPrint() {
      DeckStage._activate(this);
      this.setAttribute('data-html-deck-runtime-print', '');
      return { width: this._width, height: this._height, slideCount: this._slides.length };
    }

    restoreAfterPrint() { this.removeAttribute('data-html-deck-runtime-print'); }

    restoreFocus() {
      if (this._lastFocus instanceof HTMLElement && this.contains(this._lastFocus) && !this._lastFocus.closest('[inert]')) {
        this._lastFocus.focus({ preventScroll: true });
      } else {
        this._slides[this._index]?.focus({ preventScroll: true });
      }
    }
  }

  if (!customElements.get('deck-stage')) customElements.define('deck-stage', DeckStage);
})();
