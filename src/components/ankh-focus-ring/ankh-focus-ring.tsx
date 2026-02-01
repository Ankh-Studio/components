import { Component, Prop, Element, h, Host } from '@stencil/core';
import { cn } from '@/utils';

@Component({
  tag: 'ankh-focus-ring',
  styleUrl: 'ankh-focus-ring.css',
  shadow: false,
})
export class AnkhFocusRing {
  @Element() el!: HTMLElement;

  /**
   * Whether the focus ring is visible
   */
  @Prop({ reflect: true, mutable: true }) visible: boolean = false;

  /**
   * Whether to animate inward instead of outward
   */
  @Prop({ reflect: true }) inward: boolean = false;

  private control: HTMLElement | null = null;

  connectedCallback() {
    this.control = this.el.parentElement;
    if (this.control) {
      this.attachListeners();
    }
  }

  disconnectedCallback() {
    this.detachListeners();
  }

  private attachListeners() {
    if (!this.control) return;

    this.control.addEventListener('focusin', this.handleFocusIn);
    this.control.addEventListener('focusout', this.handleFocusOut);
    this.control.addEventListener('pointerdown', this.handlePointerDown);
  }

  private detachListeners() {
    if (!this.control) return;

    this.control.removeEventListener('focusin', this.handleFocusIn);
    this.control.removeEventListener('focusout', this.handleFocusOut);
    this.control.removeEventListener('pointerdown', this.handlePointerDown);
  }

  private handleFocusIn = () => {
    // Only show focus ring for keyboard focus
    if (this.control?.matches(':focus-visible')) {
      this.visible = true;
    }
  };

  private handleFocusOut = () => {
    this.visible = false;
  };

  private handlePointerDown = () => {
    this.visible = false;
  };

  render() {
    return (
      <Host aria-hidden="true">
        <span
          class={cn(
            'ankh-focus-ring',
            this.visible && 'ankh-focus-ring--visible',
            this.inward && 'ankh-focus-ring--inward'
          )}
        ></span>
      </Host>
    );
  }
}
