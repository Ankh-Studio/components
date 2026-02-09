# ankh-icon



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description                                                                                                                                                                                                  | Type                           | Default     |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ----------- |
| `filled`            | `filled`  | Whether to render the filled variant of the icon. Controls the FILL axis of the Material Symbols variable font.                                                                                              | `boolean`                      | `false`     |
| `label`             | `label`   | Accessible label for meaningful icons. When provided: sets role="img" and aria-label. When omitted: icon is treated as decorative (aria-hidden="true").                                                      | `string \| undefined`          | `undefined` |
| `name` _(required)_ | `name`    | Icon name from Material Symbols (e.g. "home", "settings", "favorite"). Uses ligature resolution — the name is rendered as text content and the Material Symbols font converts it to the corresponding glyph. | `string`                       | `undefined` |
| `size`              | `size`    | The rendered size of the icon. Maps to --icon-size-sm/md/lg/xl tokens with optical size tracking.                                                                                                            | `"lg" \| "md" \| "sm" \| "xl"` | `'md'`      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
