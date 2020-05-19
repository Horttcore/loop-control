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
const { InspectorControls } = wp.blockEditor;
const { withSelect } = wp.data;

class LoopComponent extends Component {

    constructor() {
        super(...arguments);
    }

    render() {

        const {
            setAttributes,
            order,
            orderBy,
            numberOfItems,
            orderByValues,
            offset,
            postIn,
            postTaxonomies,
            postType,
            posts,
            showPostsMax,
            offsetMax,
        } = this.props;

        const taxonomySelects = [];

        const orderByValue = [orderBy, order].join('/');
        const orderBySelectValues = (orderByValues) ? orderByValues : [
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

        const showPostsMaxValue = (showPostsMax) ? showPostsMax : 100;

        const offsetMaxValue = (offsetMax) ? offsetMax : 100;

        const snakeToCamel = (str) => str.replace(
            /([-_][a-z])/g,
            (group) => group.toUpperCase()
                .replace('-', '')
                .replace('_', '')
        );

        if (postTaxonomies) {
            postTaxonomies.map((taxonomy, index) => {
                let termsFieldValue = [];
                if (taxonomy.terms !== null) {
                    let selectedTerms = this.props[snakeToCamel(taxonomy.slug)];
                    termsFieldValue = selectedTerms.map((termId) => {
                        let wantedTerm = taxonomy.terms.find((term) => term.id === termId);
                        return (wantedTerm === undefined || !wantedTerm) ? false : wantedTerm.name;
                    });
                }
                if (!taxonomy.terms) taxonomy.terms = [];
                taxonomySelects.push(
                    <PanelBody
                        key={`taxonomy-${index}`}
                        title={taxonomy.name}
                    >
                        <FormTokenField
                            value={termsFieldValue}
                            suggestions={taxonomy.terms.map(term => term.name)}
                            onChange={(selectedTerms) => {
                                let selectedTermsArray = [];
                                selectedTerms.map(
                                    (termName) => {
                                        const matchingTerm = taxonomy.terms.find((term) => {
                                            return term.name === termName;

                                        });
                                        if (matchingTerm !== undefined) {
                                            selectedTermsArray.push(matchingTerm.id);
                                        }
                                    }
                                )
                                let attr = [];
                                attr[snakeToCamel(taxonomy.slug)] = selectedTermsArray;
                                attr = { ...attr }
                                setAttributes(attr)
                            }}
                        />
                    </PanelBody>
                );
            });
        }

        let postsFieldValue = [];
        let postNames = [];
        if (posts !== null) {
            postsFieldValue = postIn.map((postId) => {
                let wantedPost = posts.find((post) => post.id === postId);
                return (wantedPost === undefined || !wantedPost) ? false : wantedPost.title.raw;
            });
        }
        return (
            <Fragment>
                <InspectorControls>
                    {taxonomySelects}

                    <PanelBody title={__("Order")}>
                        <SelectControl
                            value={orderByValue}
                            onChange={orderByValue => {
                                orderByValue = orderByValue.split('/');
                                setAttributes({
                                    orderBy: orderByValue[0],
                                    order: orderByValue[1],
                                })
                            }}
                            options={orderBySelectValues}
                        />
                    </PanelBody>

                    <PanelBody title={__("Number of items")}>
                        <RangeControl
                            value={numberOfItems}
                            onChange={numberOfItems => { setAttributes({ numberOfItems }) }}
                            min={1}
                            max={showPostsMaxValue}
                            required
                        />
                    </PanelBody>

                    <PanelBody title={__("Offset")}>
                        <RangeControl
                            value={offset}
                            onChange={offset => { setAttributes({ offset }) }}
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
                                    setAttributes({ postIn: selectedPostsArray });
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
