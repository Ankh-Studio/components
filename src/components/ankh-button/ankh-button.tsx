import { Component, Prop, h, Host } from '@stencil/core';
import { cn } from '@/utils';

/**
 * Button visual style variants
 */
export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';

/**
 * Button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  tag: 'ankh-button',
  styleUrl: 'ankh-button.css',
  shadow: false,
})
export class AnkhButton {
  /**
   * The visual style variant of the button
   */
  @Prop() variant: ButtonVariant = 'filled';

  /**
   * The size of the button
   */
  @Prop() size: ButtonSize = 'medium';

  /**
   * Whether the button should take full width of its container
   */
  @Prop({ attribute: 'full-width' }) fullWidth: boolean = false;

  /**
   * Whether the button is disabled
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * The type attribute for the button
   */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return (
      <Host class="ankh-btn-host">
        <button
          type={this.type}
          class={cn(
            'ankh-btn',
            `ankh-btn--${this.variant}`,
            `ankh-btn--${this.size}`,
            this.fullWidth && 'ankh-btn--full-width'
          )}
          disabled={this.disabled}
        >
          <ankh-focus-ring></ankh-focus-ring>
          <ankh-ripple disabled={this.disabled}></ankh-ripple>
          <span class="ankh-btn__content">
            <slot></slot>
          </span>
        </button>
      </Host>
    );
  }
}
