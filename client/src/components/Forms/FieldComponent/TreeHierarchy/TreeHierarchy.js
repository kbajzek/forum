import React, {Component} from 'react';

import Spinner from '../../../UI/Spinner2/Spinner2';

import * as classes from './TreeHierarchy.module.css';

class TreeHierarchy extends Component {

    recursiveCreateSubcat(subcatData){
        const subcatChildren = subcatData.expanded ? subcatData.subcatChildren.map(subcat => {
            return this.recursiveCreateSubcat(subcat);
        }) : [];
        const threadChildren = subcatData.expanded ? subcatData.threadChildren.map(thread => {
            let hoveredStyle = {position: 'relative'};
            if(thread.threadId === this.props.selectedId){
                hoveredStyle = {position: 'relative', backgroundColor: 'rgb(138, 117, 208)'};
            }
            return (
                <div
                    style={{paddingLeft: '1rem'}}
                    key={thread.threadId}>
                    <div
                        className={classes.ThreadSelection}
                        style={hoveredStyle}
                        onClick={() => this.props.selectNewDestination({id: thread.threadId, name: thread.threadName})}>
                        {thread.threadName}
                        <div
                            style={{position: 'absolute', top: '0', left: '-.8rem'}}>
                            { '\u2022' }
                        </div>
                    </div>
                </div>
            );
        }) : null;
        return (
            <div
                style={{paddingLeft: '1rem'}}
                key={subcatData.subcategoryId}>
                <div
                    className={classes.NodeSelection}
                    style={{position: 'relative'}}
                    onClick={() => this.props.onFetchExtraTreeHierarchyData(null, subcatData.subcategoryId, subcatData.fullAncestry, subcatData.expanded, subcatData.loaded)}>
                    {subcatData.subcategoryName}
                    <div
                        style={{position: 'absolute', top: '0', left: '-1.1rem', width: '.9rem', height: '100%'}}>
                        {subcatData.loading ? <Spinner /> : (subcatData.expanded ? '\u25BC' : '\u25B6') }
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
                            className={classes.NodeSelection}
                            style={{position: 'relative'}}
                            onClick={() => this.props.onFetchExtraTreeHierarchyData(elt.categoryId, null, elt.fullAncestry, elt.expanded, elt.loaded)}>
                            {elt.categoryName}
                            <div
                                style={{position: 'absolute', top: '0', left: '-1.1rem', width: '.9rem', height: '100%'}}>
                                {elt.loading ? <Spinner /> : (elt.expanded ? '\u25BC' : '\u25B6') }
                            </div>
                        </div>
                        {subcatChildren}
                    </div>
                );
            });
        }
        return(
            <div
                style={{fontSize: '1rem', paddingLeft: '1.5rem', paddingTop: '.5rem', paddingBottom: '.5rem'}}
                >{tree}
            </div>
        )
    }
}

export default TreeHierarchy;