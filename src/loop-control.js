const { __ } = wp.i18n;
const {
    Component,
    Fragment
} = wp.element;

const {
    PanelBody,
    RangeControl,
    SelectControl,
    FormTokenField,
} = wp.components;

const {
    InspectorControls,
} = wp.blockEditor;

const { withSelect } = wp.data;

class LoopControl extends Component {

    constructor() {
        super(...arguments);
    }

    render() {
        const { setAttributes, postTaxonomies, postType, query, posts } = this.props;
        const taxonomySelects = [];

        postTaxonomies.map((taxonomy, tax) => {
            if (!taxonomy.terms)
                taxonomy.terms = [];
            taxonomySelects.push(<PanelBody title={taxonomy.name}>
                <FormTokenField
                    value={query[taxonomy.slug]}
                    suggestions={taxonomy.terms.map(term => term.name)}
                    onChange={terms => {
                        query[taxonomy.slug] = terms
                        setAttributes({ query });
                    }}
                />
            </PanelBody>)
        })

        return (
            <Fragment>

                <InspectorControls>

                    {postType &&
                        <PanelBody title={postType.name}>
                            <SelectControl
                                multiple
                                label={__('Select')}
                                value={query['post__in']}
                                onChange={(postIn) => {
                                    query['post__in'] = postIn;
                                    setAttributes({ query });
                                }}
                                options={posts.map((post) => {
                                    return {
                                        value: post.id,
                                        label: post.title.rendered
                                    }
                                })}
                            />
                        </PanelBody>
                    }
                    {taxonomySelects}

                    <PanelBody title={__('Order')}>
                        <SelectControl
                            value={query['orderBy'] ? query['orderBy'] : ''}
                            onChange={(orderBy) => {
                                query['orderBy'] = orderBy;
                                setAttributes({ query })
                            }}
                            options={[
                                {
                                    "value": "title",
                                    "label": __('A → Z')
                                },
                                {
                                    "value": "menu_order",
                                    "label": __('Menu order')
                                },
                                {
                                    "value": "date desc",
                                    "label": __('Newest to Oldest'),
                                },
                                {
                                    "value": "date asc",
                                    "label": __('Oldest to Newest'),
                                },
                            ]}
                        />
                    </PanelBody>

                    <PanelBody title={__('Number of items')}>
                        <RangeControl
                            value={query['showPosts'] ? query['showPosts'] : 10}
                            onChange={(showPosts) => {
                                query['showPosts'] = showPosts;
                                setAttributes({ query })
                            }}
                            min={1}
                            max={100}
                            required
                        />
                    </PanelBody>

                </InspectorControls>

            </Fragment>
        );
    }
}

export default withSelect((select, props) => {
    const { getEntityRecords, getPostType, getTaxonomy } = select('core');
    const postType = getPostType(props.postType);
    const posts = getEntityRecords('postType', props.postType, { per_page: 100, orderby: 'title', order: 'asc' })
    const postTaxonomies = [];

    if (postType && postType.taxonomies) {
        postType.taxonomies.map(tax => {
            const taxonomy = getTaxonomy(tax);
            if (taxonomy) {
                taxonomy.terms = getEntityRecords('taxonomy', tax, { per_page: 100 });
            }
            postTaxonomies.push(taxonomy);
        });
    }

    return {
        postType,
        posts,
        postTaxonomies
    };
})(LoopComponent);
