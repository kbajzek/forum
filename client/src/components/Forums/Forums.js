import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';



import Categories from './Categories/Categories';
import SubCategoryPage from './SubCategoryPage/SubCategoryPage';
import Thread from './Thread/Thread';

import classes from './Forums.module.css';

class Forums extends Component {

    render() {
        return (
            <div className={classes.Forums}>
                <Switch>
                    <Route path="/forums" exact render={() => {
                        return <Categories />
                    }} />
                    <Route path="/forums/thread/:id/:slug" render={({match}) => {
                        return <Thread id={match.params.id} slug={match.params.slug} />
                    }} />
                    <Route path="/forums/:id/:slug" render={({match}) => {
                        return <SubCategoryPage key={match.params.id} id={match.params.id} slug={match.params.slug} />
                    }} />
                </Switch>
    
                
            </div>
        );
    }
}



export default Forums;