import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';

import * as actions from '../../../store/ducks/treeHierarchy';

class TreeSelect extends Component {

    componentDidMount(){
        this.props.onFetchTreeHierarchyData(this.props.input.value);
    }

    render(){
        let tree = <div>loading...</div>;
        if(!this.props.loading){
            tree = this.props.treeHierarchyData.map(elt => {
                return (
                    <div
                        key={elt.categoryId}>
                        {elt.categoryName}
                    </div>
                );
            });
        }
        return(
            <div>{tree}</div>
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