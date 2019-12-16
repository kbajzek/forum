import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../../store/ducks/treeHierarchy';
import TreeHierarchy from './TreeHierarchy/TreeHierarchy';

class TreeSelect extends Component {

    state = {
        SelectOpen: false
    }

    componentDidMount(){
        this.props.onFetchTreeHierarchyData(this.props.input.value.id);
    }

    changeValues = (newSelections) => {
        this.props.input.onChange(newSelections);
    }

    selectNewDestination = (newLocation) => {
        this.changeValues(newLocation);
        this.toggleSelect();
    }

    toggleSelect = () => {
        this.setState((prevState) => {
            return {SelectOpen: !prevState.SelectOpen}
        })
    }

    render(){

        let selectComponent = (
            <div
                style={{display: 'flex', maxWidth: '30rem', minWidth: '10rem', padding: '.3rem', backgroundColor: '#ddd', justifyContent: 'space-between'}}
                onClick={this.toggleSelect}>
                <div>
                    {this.props.input.value.name}
                </div>
                <div
                    style={{border: '1px solid grey', width: '2rem', height: '100%', marginLeft: '.3rem'}}>
                    {'\u25BC'}
                </div>
            </div>
            
        );

        if(this.state.SelectOpen){
            selectComponent = (
                <div
                    style={{position: 'absolute', right: '0', top: '0', minWidth: '15rem', backgroundColor: '#eeeeee'}}>
                    <TreeHierarchy
                        treeHierarchyData={this.props.treeHierarchyData}
                        loading={this.props.loading}
                        error={this.props.error}
                        auth={this.props.auth}
                        selectedId={this.props.input.value.id}
                        selectNewDestination={this.selectNewDestination}
                        onFetchTreeHierarchyData={this.props.onFetchTreeHierarchyData}
                        onFetchExtraTreeHierarchyData={this.props.onFetchExtraTreeHierarchyData} />
                </div>
            );
        }

        return(
            <div
                style={{position: 'relative'}}>
                {selectComponent}
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