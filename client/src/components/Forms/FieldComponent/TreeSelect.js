import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';

import * as actions from '../../../store/ducks/treeHierarchy';

class TreeSelect extends Component {

    componentDidMount(){
        this.props.onFetchTreeHierarchyData(this.props.input.value);
    }

    recursiveCreateSubcat(subcatData){
        const subcatChildren = subcatData.expanded ? subcatData.subcatChildren.map(subcat => {
            return this.recursiveCreateSubcat(subcat);
        }) : [];
        const threadChildren = subcatData.threadChildren.map(thread => {
            return (
                <div
                    style={{paddingLeft: '1rem'}}
                    key={thread.threadId}>
                    <div
                        style={{position: 'relative'}}>
                        {thread.threadName}
                        <div
                            style={{position: 'absolute', top: '0', left: '-.8rem'}}>
                            { '\u2022' }
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div
                style={{paddingLeft: '1rem'}}
                key={subcatData.subcategoryId}>
                <div
                    style={{position: 'relative'}}
                    onClick={() => this.props.onFetchExtraTreeHierarchyData(null, subcatData.subcategoryId, subcatData.fullAncestry)}>
                    {subcatData.subcategoryName}
                    <div
                        style={{position: 'absolute', top: '0', left: '-1.1rem'}}>
                        {subcatData.expanded ? '\u25BC' : '\u25B6' }
                    </div>
                </div>
                {subcatChildren}
                {threadChildren}
            </div>
        );
    }

    render(){
        let tree = <div>loading...</div>;
        if(!this.props.loading){
            tree = this.props.treeHierarchyData.map(elt => {
                const subcatChildren = elt.expanded ? elt.subcatChildren.map(subcat => {
                    return this.recursiveCreateSubcat(subcat);
                }) : [];
                return (
                    <div
                        key={elt.categoryId}>
                        <div
                            style={{position: 'relative'}}
                            onClick={() => this.props.onFetchExtraTreeHierarchyData(elt.categoryId, null, elt.fullAncestry)}>
                            {elt.categoryName}
                            <div
                                style={{position: 'absolute', top: '0', left: '-1.1rem'}}>
                                {elt.expanded ? '\u25BC' : '\u25B6' }
                            </div>
                        </div>
                        {subcatChildren}
                    </div>
                );
            });
        }
        return(
            <div
                style={{fontSize: '1rem'}}
                >{tree}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        treeHierarchyData: state.treeHierarchy.tree,
        loading: state.treeHierarchy.loading,
        error: state.treeHierarchy.error,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchTreeHierarchyData: (threadId) => dispatch(actions.fetchTreeHierarchyDataBegin(threadId)),
        onFetchExtraTreeHierarchyData: (categoryId, subcategoryId, fullAncestry) => dispatch(actions.fetchExtraTreeHierarchyDataBegin(categoryId, subcategoryId, fullAncestry))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelect);