import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';

import * as actions from '../../../store/ducks/treeHierarchy';

class TreeSelect extends Component {

    componentDidMount(){
        this.props.onFetchTreeHierarchyData(this.props.input.value);
    }

    recursiveCreateSubcat(subcatData){
        const subcatChildren = subcatData.subcatChildren.map(subcat => {
            return this.recursiveCreateSubcat(subcat);
        });
        const threadChildren = subcatData.threadChildren.map(thread => {
            return (
                <div
                    style={{paddingLeft: '.8rem'}}
                    key={thread.threadId}>
                    <div
                        style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                            { '\u00A0\u2022\u00A0\u00A0' }
                        </div>
                        <div>
                            {thread.threadName}
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div
                style={{paddingLeft: '.8rem'}}
                key={subcatData.subcategoryId}>
                <div
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <div>
                        {subcatData.expanded ? '\u25BC\u00A0' : '\u25B6\u00A0' }
                    </div>
                    <div>
                        {subcatData.subcategoryName}
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
                const subcatChildren = elt.subcatChildren.map(subcat => {
                    return this.recursiveCreateSubcat(subcat);
                });
                return (
                    <div
                        key={elt.categoryId}>
                        <div
                            style={{display: 'flex', flexDirection: 'row'}}>
                            <div>
                                {elt.expanded ? '\u25BC\u00A0' : '\u25B6\u00A0' }
                            </div>
                            <div>
                                {elt.categoryName}
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
        onFetchTreeHierarchyData: (threadId) => dispatch(actions.fetchTreeHierarchyDataBegin(threadId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelect);