const { __ } = wp.i18n;

/**
 * WordPress dependencies
 */
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
const { InspectorControls } = wp.blockEditor;
const { withSelect } = wp.data;

class LoopComponent extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            query: {}
        };
    }

    update(key, value) {
        const state = this.state.query;
        state[key] = value;
        this.setState({ query: state })
        this.props.setAttributes({ query: state })
        this.forceUpdate();
    }

    render() {
        const {
            query,
            postTaxonomies,
            postType,
            posts,
            orderBy,
            showPostsMax,
            offsetMax,
        } = this.props;
        const taxonomySelects = [];
        const orderByValue = (orderBy) ? orderBy : [
            {
                value: "title/asc",
                label: __("A → Z")
            },
            {
                value: "date/desc",
                label: __("Newest to Oldest")
            },
            {
                value: "date/asc",
                label: __("Oldest to Newest")
            },
            {
                value: "menu_order/asc",
                label: __("Menu order")
            },
        ];
        const showPostsValue = (showPostsMax) ? showPostsMax : 100;
        const offsetMaxValue = (offsetMax) ? offsetMax : 100;

        if (postTaxonomies) {
            postTaxonomies.map((taxonomy, index) => {
                if (!taxonomy.terms) taxonomy.terms = [];
                taxonomySelects.push(
                    <PanelBody
                        key={`taxonomy-${index}`}
                        title={taxonomy.name}
                    >
                        <FormTokenField
                            value={query[taxonomy.slug]}
                            suggestions={taxonomy.terms.map(term => term.name)}
                            onChange={terms => {
                                this.update(taxonomy.slug, terms);
                            }}
                        />
                    </PanelBody>
                );
            });
        }

        let postsFieldValue = [];
        let postNames = [];
        if (posts !== null) {
            let selectedPosts = query.postIn ? query.postIn : [];
            postNames = posts.map((post) => post.title.raw);
            postsFieldValue = selectedPosts.map((postId) => {
                let wantedPost = posts.find((post) => {
                    return post.id === postId;
                });
                if (wantedPost === undefined || !wantedPost) {
                    return false;
                }
                return wantedPost.title.raw;
            });
        }

        return (
            <Fragment>
                <InspectorControls>
                    {taxonomySelects}
                    <PanelBody title={__("Order")}>
                        <SelectControl
                            value={query.orderBy ? query.orderBy : ""}
                            onChange={orderBy => {
                                this.update('orderBy', orderBy);
                            }}
                            options={orderByValue}
                        />
                    </PanelBody>

                    <PanelBody title={__("Number of items")}>
                        <RangeControl
                            value={query.showPosts ? query.showPosts : 10}
                            onChange={showPosts => {
                                this.update('showPosts', showPosts);
                            }}
                            min={1}
                            max={showPostsValue}
                            required
                        />
                    </PanelBody>

                    <PanelBody title={__("Offset")}>
                        <RangeControl
                            value={query.offset ? query.offset : 0}
                            onChange={offset => {
                                this.update('offset', offset);
                            }}
                            min={0}
                            max={offsetMaxValue}
                            required
                        />
                    </PanelBody>

                    {posts && (
                        <PanelBody title={postType.name}>
                            <FormTokenField
                                label=""
                                value={postsFieldValue}
                                suggestions={postNames}
                                maxSuggestions={20}
                                onChange={(selectedPosts) => {
                                    let selectedPostsArray = [];
                                    selectedPosts.map(
                                        (postName) => {
                                            const matchingPost = posts.find((post) => {
                                                return post.title.raw === postName;

                                            });
                                            if (matchingPost !== undefined) {
                                                selectedPostsArray.push(matchingPost.id);
                                            }
                                        }
                                    )
                                    query.postIn = selectedPostsArray;
                                    this.update('postIn', selectedPostsArray);
                                }}
                            />
                        </PanelBody>
                    )}
                </InspectorControls>
            </Fragment>
        );
    }
}

export default withSelect((select, props) => {
    const { getEntityRecords, getPostType, getTaxonomy } = select("core");
    const postType = getPostType(props.postType);
    const postTaxonomies = [];
    let posts = [];
    let searchResult = [];

    if (postType && postType.taxonomies) {
        postType.taxonomies.map(tax => {
            const taxonomy = getTaxonomy(tax);
            if (taxonomy) {
                taxonomy.terms = getEntityRecords("taxonomy", tax, { per_page: 100 });
            }
            postTaxonomies.push(taxonomy);
        });
    }

    posts = getEntityRecords("postType", props.postType, {
        per_page: 100,
    });

    return {
        postType,
        posts,
        postTaxonomies,
        searchResult
    };
})(LoopComponent);
