# Loop Control
A WordPress Gutenberg loop component

## Usage

* Your block **MUST HAVE** a attribute called `query`

Add it to your custom block
```js
import LoopComponent from '@horttcore/loop-control';

const { Component, Fragment } = wp.element;

export default class Edit extends Component {

    constructor() {
        super(...arguments);
    }

    render() {
        const {
            attributes: {
                category,
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
                <LoopComponent
                    postType="post"
                    {...this.props.attributes}
                    setAttributes={setAttributes}
                />
                …
            </Fragment>
        );
    }
}
```
