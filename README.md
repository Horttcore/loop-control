# Loop Control
A WordPress Gutenberg loop component

## Usage

* Your block **MUST HAVE** a attribute called `query`

Add it to your custom block
```js
import LoopComponent from '@ralfhortt/loop-control';

const { Component, Fragment } = wp.element;

export default class Edit extends Component {

    constructor() {
        super(...arguments);
    }

    render() {
        const {
            attributes: {
                query
            }
        } = this.props;
        return (
            <Fragment>
                <LoopComponent
                    postType="post"
                    query={query}
                    {...{ ...this.props }}
                />
                …
            </Fragment>
        );
    }
}
```
