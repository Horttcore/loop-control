# Loop Control
A WordPress Gutenberg loop component

## Usage

### Add the loop control attributes to your block

```js
export default {
    postLayout: {
        type: 'string',
        default: 'list',
    },
    gridColumns: {
        type: 'integer',
        default: -1,
    },
    orderBy: {
        type: 'string',
        default: 'title'
    },
    order: {
        type: 'string',
        default: 'asc'
    },
    numberOfItems: {
        type: 'number',
        default: 10,
    },
    offset: {
        type: 'number',
        default: 0
    },
    postIn: {
        type: 'array',
        default: [],
    }
}

```

```php
<?php
register_block_type(
    'block-slug',
    [
        'render_callback' => 'callback_function',
        'attributes'      => [
            'postLayout' => [
                'type' => 'string',
                'default' => 'list',
            ],
            'gridColumns' => [
                'type'=> 'integer',
                'default'=> -1,
            ],
            'orderBy' => [
                'type' => 'string',
                'default' => 'title',
            ],
            'order' => [
                'type' => 'string',
                'default' => 'asc',
            ],
            'numberOfItems' => [
                'type' => 'integer',
                'default' => 10,
            ],
            'offset' => [
                'type' => 'integer',
                'default' => 0,
            ],
            'postIn' => [
                'type' => 'array',
                'default' => [],
            ],
        ],
    ]
);

```

### Import loop-control.js

```js
import LoopControl from './loop-control';
```

### Taxonomies

For taxonomy support add camelCase attributes with taxonomy slug

```js
    …
    myTaxonomy: {
        type: 'array',
        default: [],
    }
    …
```

```php
<?php
register_block_type(
    'block-slug',
    [
        'render_callback' => 'callback_function',
        'attributes'      => [
            // …
            'my-taxonomy' => [
                'type'=> 'array',
                'default'=> [],
            ],
            // …
        ],
    ]
);

```

### Edit your block

- Add the loop control to you custom block
- Set `postType` attribute
- Set `setAttributes` attribute

```js
<LoopControl
    postType="post-type-slug"
    {...this.props.attributes}
    setAttributes={setAttributes}
/>
```

## Customization

### Custom values

```js
<LoopControl
    postType="post-type-slug"
    {...this.props.attributes}
    setAttributes={setAttributes}
    orderByValues={[
        {
            value: "title/asc",
            label: __("A → Z")
        },
        {
            value: "title/desc",
            label: __("Z → A")
        },
   ]}
   offsetMax=10
   
/>
```

### Disable features
```js
<LoopControl
    postType="post-type-slug"
    {...this.props.attributes}
    setAttributes={setAttributes}
    useGrid={false}
/>
```
