import { Component, Prop, h, Host } from '@stencil/core';
import { cn } from '@/utils';

/**
 * Icon size options, mapped to --icon-size-* tokens
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  tag: 'ankh-icon',
  styleUrl: 'ankh-icon.css',
  shadow: false,
})
export class AnkhIcon {
  /**
   * Icon name from Material Symbols (e.g. "home", "settings", "favorite").
   * Uses ligature resolution — the name is rendered as text content and
   * the Material Symbols font converts it to the corresponding glyph.
   */
  @Prop() name!: string;

  /**
   * The rendered size of the icon.
   * Maps to --icon-size-sm/md/lg/xl tokens with optical size tracking.
   * @default 'md'
   */
  @Prop() size: IconSize = 'md';

  /**
   * Whether to render the filled variant of the icon.
   * Controls the FILL axis of the Material Symbols variable font.
   * @default false
   */
  @Prop() filled: boolean = false;

  /**
   * Accessible label for meaningful icons.
   * When provided: sets role="img" and aria-label.
   * When omitted: icon is treated as decorative (aria-hidden="true").
   */
  @Prop() label?: string;

  render() {
    const isDecorative = !this.label;

    return (
      <Host class="ankh-icon-host">
        <span
          class={cn('ankh-icon', `ankh-icon--${this.size}`, this.filled && 'ankh-icon--filled')}
          role={isDecorative ? undefined : 'img'}
          aria-label={this.label || undefined}
          aria-hidden={isDecorative ? 'true' : undefined}
        >
          {this.name}
        </span>
      </Host>
    );
  }
}
