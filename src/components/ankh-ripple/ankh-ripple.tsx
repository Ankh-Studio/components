import { Component, Prop, State, Element, h, Host } from '@stencil/core';
import { cn } from '@/utils';

/**
 * Ripple interaction states
 */
enum RippleState {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

/**
 * Animation timing constants
 * Values align with @ankh-studio/themes motion tokens
 */
const PRESS_GROW_MS = 450; // --duration-long1
const MINIMUM_PRESS_MS = 225; // ~--duration-medium1
const TOUCH_DELAY_MS = 150; // --duration-short3
const INITIAL_ORIGIN_SCALE = 0.2;
const EASING_STANDARD = 'cubic-bezier(0.2, 0, 0, 1)'; // --easing-standard

@Component({
  tag: 'ankh-ripple',
  styleUrl: 'ankh-ripple.css',
  shadow: false,
})
export class AnkhRipple {
  @Element() el!: HTMLElement;

  /**
   * Whether the ripple effect is disabled
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * Internal hover state
   */
  @State() hovered: boolean = false;

  /**
   * Internal pressed state
   */
  @State() pressed: boolean = false;

  private state: RippleState = RippleState.INACTIVE;
  private growAnimation: Animation | null = null;
  private pressStartTime: number = 0;
  private touchDelayTimer: ReturnType<typeof setTimeout> | null = null;
  private control: HTMLElement | null = null;
  private surfaceEl: HTMLElement | null = null;

  connectedCallback() {
    this.control = this.el.parentElement;
    if (this.control) {
      this.attachListeners();
    }
  }

  disconnectedCallback() {
    this.detachListeners();
    this.clearTouchDelayTimer();
  }

  private attachListeners() {
    if (!this.control) return;

    this.control.addEventListener('pointerdown', this.handlePointerDown);
    this.control.addEventListener('pointerup', this.handlePointerUp);
    this.control.addEventListener('pointerenter', this.handlePointerEnter);
    this.control.addEventListener('pointerleave', this.handlePointerLeave);
    this.control.addEventListener('pointercancel', this.handlePointerCancel);
    this.control.addEventListener('click', this.handleClick);
    this.control.addEventListener('contextmenu', this.handleContextMenu);
  }

  private detachListeners() {
    if (!this.control) return;

    this.control.removeEventListener('pointerdown', this.handlePointerDown);
    this.control.removeEventListener('pointerup', this.handlePointerUp);
    this.control.removeEventListener('pointerenter', this.handlePointerEnter);
    this.control.removeEventListener('pointerleave', this.handlePointerLeave);
    this.control.removeEventListener('pointercancel', this.handlePointerCancel);
    this.control.removeEventListener('click', this.handleClick);
    this.control.removeEventListener('contextmenu', this.handleContextMenu);
  }

  private clearTouchDelayTimer() {
    if (this.touchDelayTimer) {
      clearTimeout(this.touchDelayTimer);
      this.touchDelayTimer = null;
    }
  }

  private handlePointerEnter = () => {
    if (!this.disabled) {
      this.hovered = true;
    }
  };

  private handlePointerLeave = () => {
    this.hovered = false;
    if (this.state !== RippleState.INACTIVE) {
      this.endPressAnimation();
    }
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (this.disabled || !event.isPrimary) return;

    if (event.pointerType === 'touch') {
      // Touch: delay to distinguish from scroll
      this.state = RippleState.TOUCH_DELAY;
      this.touchDelayTimer = setTimeout(() => {
        this.state = RippleState.HOLDING;
        this.startPressAnimation(event);
      }, TOUCH_DELAY_MS);
    } else {
      // Mouse/pen: immediate feedback
      this.state = RippleState.HOLDING;
      this.startPressAnimation(event);
    }
  };

  private handlePointerUp = () => {
    if (this.state === RippleState.TOUCH_DELAY) {
      // Touch was released before delay - still show quick ripple
      this.clearTouchDelayTimer();
      this.state = RippleState.WAITING_FOR_CLICK;
    } else if (this.state === RippleState.HOLDING) {
      this.state = RippleState.WAITING_FOR_CLICK;
    }
  };

  private handlePointerCancel = () => {
    this.clearTouchDelayTimer();
    this.endPressAnimation();
    this.state = RippleState.INACTIVE;
  };

  private handleClick = () => {
    if (this.disabled) return;

    if (this.state === RippleState.WAITING_FOR_CLICK) {
      this.endPressAnimation();
    } else if (this.state === RippleState.INACTIVE) {
      // Keyboard activation - show ripple from center
      this.startPressAnimation(null);
      this.endPressAnimation();
    }
    this.state = RippleState.INACTIVE;
  };

  private handleContextMenu = () => {
    if (this.disabled) return;
    this.hovered = false;
    this.clearTouchDelayTimer();
    this.endPressAnimation();
    this.state = RippleState.INACTIVE;
  };

  private startPressAnimation(event: PointerEvent | null) {
    this.pressed = true;
    this.pressStartTime = Date.now();

    if (!this.surfaceEl) return;

    const { width, height } = this.surfaceEl.getBoundingClientRect();
    const rippleSize = Math.hypot(width, height) + 10; // Add padding

    // Calculate origin
    let startX: number;
    let startY: number;

    if (event) {
      const rect = this.surfaceEl.getBoundingClientRect();
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
    } else {
      // Center for keyboard
      startX = width / 2;
      startY = height / 2;
    }

    // End position (centered)
    const endX = (width - rippleSize) / 2;
    const endY = (height - rippleSize) / 2;

    this.growAnimation = this.surfaceEl.animate(
      {
        top: [`${startY - rippleSize / 2}px`, `${endY}px`],
        left: [`${startX - rippleSize / 2}px`, `${endX}px`],
        width: [`${rippleSize}px`, `${rippleSize}px`],
        height: [`${rippleSize}px`, `${rippleSize}px`],
        transform: [
          `scale(${INITIAL_ORIGIN_SCALE})`,
          'scale(1)',
        ],
      },
      {
        duration: PRESS_GROW_MS,
        easing: EASING_STANDARD,
        fill: 'forwards',
        pseudoElement: '::after',
      }
    );
  }

  private async endPressAnimation() {
    const pressElapsed = Date.now() - this.pressStartTime;
    const remainingTime = Math.max(0, MINIMUM_PRESS_MS - pressElapsed);

    await new Promise((resolve) => setTimeout(resolve, remainingTime));

    this.pressed = false;

    if (this.growAnimation) {
      this.growAnimation.cancel();
      this.growAnimation = null;
    }
  }

  render() {
    return (
      <Host aria-hidden="true">
        <span
          class={cn(
            'ankh-ripple',
            this.hovered && 'ankh-ripple--hovered',
            this.pressed && 'ankh-ripple--pressed'
          )}
          ref={(el) => (this.surfaceEl = el as HTMLElement)}
        ></span>
      </Host>
    );
  }
}
