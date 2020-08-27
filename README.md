# Loop Control
A WordPress Gutenberg loop component

## Usage

```js
<LoopControl
    postType="post"
    {...this.props.attributes}
/>
```

## Attributes

### Default attributes

Add these attributes to your block

```js
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
},
```

### Taxonomies

Add taxonomies attributes

```js
division: {
    type: 'array',
    default: [],
}
```


## Block

Add it to your custom block

```js
import LoopControl from './loop-control';

const { Component, Fragment } = wp.element;

export default class Edit extends Component {

    constructor() {
        super(...arguments);
    }

    render() {
        const {
            attributes: {
                division,
                orderBy,
                order,
                numberOfItems,
                offset,
                postIn,
            },
            setAttributes,
        } = this.props;
        return (
            <Fragment>
                <LoopControl
                    postType="post"
                    {...this.props.attributes}
                />
                …
            </Fragment>
        );
    }
}
```
