const apiFetch = wp.apiFetch;
const { __ } = wp.i18n;

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    FormTokenField,
    TextControl,
    IconButton
} = wp.components;
const { InspectorControls } = wp.blockEditor;
const { withSelect } = wp.data;

class LoopComponent extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            searchValue: "",
            searchResult: []
        };
    }

    render() {
        const {
            query,
            setAttributes,
            postTaxonomies,
            postType,
            posts
        } = this.props;
        const taxonomySelects = [];
        const searchResult = [];
        const selectedPosts = [];

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
                                query[taxonomy.slug] = terms;
                                setAttributes({ query });
                            }}
                        />
                    </PanelBody>
                );
            });
        }

        if (posts) {
            posts.map((post, index) => {
                selectedPosts.push(
                    <>
                        <IconButton
                            key={`remove-item-${index}`}
                            onClick={() => {
                                this.removePost(post);
                            }}
                            icon="dismiss"
                        >
                            {post.title.rendered}
                        </IconButton>
                        <br />
                    </>
                );
            });

            if (posts.length > 0) {
                selectedPosts.push(<hr />)
            }
        }

        this.state.searchResult.map((post, index) => {
            searchResult.push(
                <>
                    <IconButton
                        key={`add-item-${index}`}
                        onClick={() => {
                            this.addPost(post);
                        }}
                        icon="plus-alt"
                    >
                        {post.title}
                    </IconButton>
                    <br />
                </>
            );
        });

        return (
            <Fragment>
                <InspectorControls>
                    {taxonomySelects}
                    <PanelBody title={__("Order")}>
                        <SelectControl
                            value={query.orderBy ? query.orderBy : ""}
                            onChange={orderBy => {
                                query.orderBy = orderBy;
                                setAttributes({ query });
                            }}
                            options={[
                                {
                                    value: "title",
                                    label: __("A → Z")
                                },
                                {
                                    value: "menu_order",
                                    label: __("Menu order")
                                },
                                {
                                    value: "date desc",
                                    label: __("Newest to Oldest")
                                },
                                {
                                    value: "date asc",
                                    label: __("Oldest to Newest")
                                }
                            ]}
                        />
                    </PanelBody>

                    <PanelBody title={__("Number of items")}>
                        <RangeControl
                            value={query.showPosts ? query.showPosts : 10}
                            onChange={showPosts => {
                                query.showPosts = showPosts;
                                setAttributes({ query: query });
                            }}
                            min={1}
                            max={100}
                            required
                        />
                    </PanelBody>

                    <PanelBody title={__("Offset")}>
                        <RangeControl
                            value={query.offset ? query.offset : 0}
                            onChange={offset => {
                                query.offset = offset;
                                setAttributes({ query: query });
                            }}
                            min={0}
                            max={100}
                            required
                        />
                    </PanelBody>

                    {postType && (
                        <PanelBody title={postType.name}>
                            {selectedPosts}
                            <TextControl
                                label={__("Search")}
                                value={this.state.searchValue}
                                onChange={searchValue => {
                                    this.setState({ searchValue });
                                    this.searchPost();
                                }}
                                type="search"
                            />
                            <ul>{searchResult}</ul>
                        </PanelBody>
                    )}
                </InspectorControls>
            </Fragment>
        );
    }

    searchPost() {
        apiFetch({
            path:
                "/wp/v2/search?type=post&subtype=staff&search=" + this.state.searchValue
        }).then(res => {
            this.state.searchResult = res;
        });
    }

    addPost(post) {
        const {
            attributes: { query },
            setAttributes
        } = this.props;

        if (!query.postIn) {
            query.postIn = [];
        }

        query.postIn.push(post.id);
        this.setState({
            searchValue: "",
            searchResult: []
        });
        setAttributes({ query });
    }

    removePost(post) {
        const {
            attributes: { query },
            setAttributes
        } = this.props;

        query.postIn.splice(query.postIn.indexOf(post.id), 1);

        setAttributes({ query });
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

    if (props.query.postIn) {
        posts = getEntityRecords("postType", props.postType, {
            per_page: 100,
            orderby: "include",
            include: props.query.postIn
        });
    }

    return {
        postType,
        posts,
        postTaxonomies,
        searchResult
    };
})(LoopComponent);
