import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';


import PostForm from '../Forms/PostForm/PostForm';
import Categories from './Categories/Categories';
import SubCategoryPage from './SubCategoryPage/SubCategoryPage';
import Thread from './Thread/Thread';

import classes from './Forums.module.css';
import { Redirect } from 'react-router-dom';

class Forums extends Component {

    state={
        postEditorActive: false,
        showPostEditor: false,
        postEditorThread: null,
        postEditorSlug: '',
        postEditorPost: null
    }

    openPostEditor = (threadId, slug) => {
        this.setState({showPostEditor: true, postEditorThread: threadId, postEditorSlug: slug});
    }

    togglePostEditor = () => {
        this.setState((prevState) => {
            return {showPostEditor: !prevState.showPostEditor}
         });
    }

    closePostEditor = () => {
        this.setState({showPostEditor: false});
    }

    render() {

        let editor=null;
        // let postCreated=null;
        // if(this.state.NewPost){
        //     const path = "/thread/" + this.state.postEditorThread + "/" + this.state.postEditorSlug;
        //     postCreated=<Redirect to={path} />;
        // }
        if(this.state.showPostEditor){
            editor=(
                <PostForm 
                    closeForm={this.closePostEditor} 
                    threadId={this.state.postEditorThread || 1} 
                    path={"/thread/" + this.state.postEditorThread + "/" + this.state.postEditorSlug} />
            );
        }

        return (
            <div className={classes.Forums}>
                <Switch>
                    <Route path="/forums" exact render={() => {
                        return <Categories />
                    }} />
                    <Route path="/forums/thread/:id/:slug" render={({match}) => {
                        let editorButton = (
                            <button 
                                onClick={() => {this.openPostEditor(match.params.id, match.params.slug)}} 
                                style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                                EDITOR
                            </button>
                        );
                        return (
                            <div>
                                <Thread key={match.params.id} id={match.params.id} slug={match.params.slug} />
                                {editorButton}
                            </div>
                        );
                        
                    }} />
                    <Route path="/forums/:id/:slug" render={({match}) => {
                        return (
                            <SubCategoryPage key={match.params.id} id={match.params.id} slug={match.params.slug} />
                        );
                    }} />
                </Switch>
                {editor}

    
                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        PostData: state.forums.postEditorData
    };
}


export default connect(mapStateToProps, null)(Forums);