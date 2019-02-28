import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../../store/ducks/treeHierarchy';
import TreeHierarchy from './TreeHierarchy/TreeHierarchy';

class TreeSelect extends Component {

    componentDidMount(){
        this.props.onFetchTreeHierarchyData(this.props.input.value);
    }

    changeValues = (newSelections) => {
        this.props.input.onChange(newSelections);
    }

    selectNewDestination = (newLocation) => {
        this.changeValues(newLocation);
    }

    render(){
        return(
            <div
                style={{position: 'relative'}}>
                <div
                    style={{position: 'absolute', right: '0', bottom: '0', minWidth: '15rem', backgroundColor: '#eeeeee'}}>
                    <TreeHierarchy
                        treeHierarchyData={this.props.treeHierarchyData}
                        loading={this.props.loading}
                        error={this.props.error}
                        auth={this.props.auth}
                        selectNewDestination={this.selectNewDestination}
                        onFetchTreeHierarchyData={this.props.onFetchTreeHierarchyData}
                        onFetchExtraTreeHierarchyData={this.props.onFetchExtraTreeHierarchyData} />
                </div>
            </div>
            
        );
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
        onFetchExtraTreeHierarchyData: (categoryId, subcategoryId, fullAncestry, expanded, loaded) => dispatch(actions.fetchExtraTreeHierarchyDataBegin(categoryId, subcategoryId, fullAncestry, expanded, loaded))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelect);