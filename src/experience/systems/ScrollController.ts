import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { SECTIONS, sectionParam } from '../config/sections';
import { clamp, damp } from '../utils/math';

const SMOOTH_LERP = 0.1;       // Lenis DOM scroll easing — how fast the page position catches up.
const CAMERA_LAMBDA = 2.0;     // Camera follow speed — lower = more cinematic lag. Tune here.
const WHEEL_COOLDOWN_MS = 80;  // minimum ms between wheel-event section advances
const SWIPE_THRESHOLD_PX = 40; // minimum Y delta to count as an intentional swipe

// Section-locked navigation: each wheel notch or swipe advances to the next/previous
// section via a smooth Lenis animation. Multiple fast wheel events accumulate naturally
// (fast scroll can skip ahead). Dots + keyboard also call goTo, animated the same way.
//
// TWO-LAYER SMOOTHING:
//   1. Lenis eases the real DOM scroll position (SMOOTH_LERP). The Overlay's
//      IntersectionObserver and progress bar read from the actual scroll — unaffected.
//   2. The camera has its own separate damp (CAMERA_LAMBDA) that chases Lenis's eased
//      progress. This gives a cinematic lag — islands slide in from the distance rather
//      than cutting to them.
export class ScrollController {
  // Cinematic camera progress (0..1) — separately damped, drives the camera curve.
  t = 0;

  // The section index we are navigating to/at (reliable mid-animation, unlike lenis.progress).
  private activeIndex = 0;

  // Separately-tracked camera progress, damped toward the DOM scroll progress each frame.
  private cameraT = 0;

  private readonly reduceMotion: boolean;
  private lenis: Lenis | null = null;

  // Wheel cooldown: stamp of last advance, to stop one physical notch from registering
  // many times (trackpad jitter). Accumulation is still natural — fast scroll = many notches.
  private lastWheelMs = 0;

  // Touch tracking for swipe detection.
  private touchStartY = 0;

  constructor() {
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // --- Geometry helpers --------------------------------------------------------

  private scrollRange(): number {
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  private sectionOffset(index: number): number {
    return Math.round(sectionParam(index) * this.scrollRange());
  }

  // --- Per-frame ---------------------------------------------------------------

  update(dt: number): void {
    if (!this.lenis) return;
    const scrollT = this.lenis.progress || 0;
    // Camera ALWAYS damps — even when prefers-reduced-motion is on.
    // The 3D camera is the primary visual experience of this portfolio; we deliberately
    // decouple it from the OS motion setting. DOM scroll still respects reduce-motion
    // (see goTo → lenis.scrollTo immediate:true), but the camera always glides.
    this.cameraT = damp(this.cameraT, scrollT, CAMERA_LAMBDA, dt);
    this.t = this.cameraT;
  }

  // --- Navigation --------------------------------------------------------------

  goTo(index: number): void {
    this.activeIndex = clamp(Math.round(index), 0, SECTIONS.length - 1);
    this.lenis?.scrollTo(this.sectionOffset(this.activeIndex), {
      immediate: this.reduceMotion,
    });
  }

  next(): void {
    this.goTo(this.activeIndex + 1);
  }

  prev(): void {
    this.goTo(this.activeIndex - 1);
  }

  // --- Input -------------------------------------------------------------------

  bindInput(): void {
    this.lenis = new Lenis({
      autoRaf: true,
      lerp: SMOOTH_LERP,
      // We own the wheel — Lenis is only the animation engine here.
      smoothWheel: false,
    });
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });

    // Honor an initial deep-link (e.g. /#about) — jump straight there on load.
    // Seed cameraT immediately so the camera starts at the target section rather
    // than sliding in from section 0 on the first few frames.
    const initial = this.hashIndex();
    if (initial > 0) {
      this.activeIndex = initial;
      this.lenis.scrollTo(this.sectionOffset(initial), { immediate: true });
      const seedT = this.lenis.progress || sectionParam(initial);
      this.cameraT = seedT;
      this.t = seedT;
    }
  }

  unbindInput(): void {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchend', this.onTouchEnd);
    this.lenis?.destroy();
    this.lenis = null;
  }

  private hashIndex(): number {
    const id = window.location.hash.replace('#', '');
    return Math.max(0, SECTIONS.findIndex((s) => s.id === id));
  }

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const now = performance.now();
    if (now - this.lastWheelMs < WHEEL_COOLDOWN_MS) return;
    this.lastWheelMs = now;
    if (event.deltaY > 0) this.next();
    else if (event.deltaY < 0) this.prev();
  };

  private readonly onTouchStart = (event: TouchEvent): void => {
    this.touchStartY = event.touches[0]?.clientY ?? 0;
  };

  private readonly onTouchEnd = (event: TouchEvent): void => {
    const endY = event.changedTouches[0]?.clientY ?? this.touchStartY;
    const delta = this.touchStartY - endY; // positive = swipe up (scroll down)
    if (delta > SWIPE_THRESHOLD_PX) this.next();
    else if (delta < -SWIPE_THRESHOLD_PX) this.prev();
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'Spacebar':
        // Let focused interactive elements (dot-nav buttons, links) handle Space natively.
        if (event.target instanceof HTMLElement && event.target.closest('a,button,input,select,textarea')) break;
        event.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        this.prev();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(SECTIONS.length - 1);
        break;
      default:
        break;
    }
  };
}
