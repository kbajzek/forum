import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {change, getFormValues} from 'redux-form';

import * as actions from '../../store/actions';

import PostForm from '../Forms/PostForm/PostForm';
import Categories from './Categories/Categories';
import SubCategoryPage from './SubCategoryPage/SubCategoryPage';
import Thread from './Thread/Thread';

import classes from './Forums.module.css';

class Forums extends Component {

    state={
        postEditorActive: false,
        showPostEditor: false,
        postEditorThread: null,
        postEditorPost: null,
        postEditorSlug: '',
        postEditorThreadName: '',
        postEditorSubCategory: null,
        postEditorSubCategoryName: ''
    }

    handlePostEdit = (postId, postContent, threadId, slug, threadName) => {
        //this.setState({showPostEditor: true, postEditorThread: threadId, postEditorSlug: slug, postEditorActive: true, postEditorThreadName: threadName});
        this.props.changePostEditor(postContent);
        this.setState({
            showPostEditor: true, 
            postEditorThread: threadId, 
            postEditorSlug: slug, 
            postEditorActive: true, 
            postEditorThreadName: threadName, 
            postEditorPost: postId,
            postEditorSubCategory: null,
            postEditorSubCategoryName: ''
        });
    }

    handlePostDelete = (postId, id, slug) => {
        const path = "/thread/" + id + "/" + slug;
        this.props.onDeletePost(postId, path, this.props.history);
    }

    handlePostQuote = (userName, postId, threadId, threadSlug, threadName, postContent) => {
        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/thread/" + threadId + "/" + threadSlug + "#" + postId + "]" + threadName + "[/url]:";

        const quoteContent = "\n[quote]" + postContent + "[/quote]\n\n";

        const oldContent = this.props.postValues ? this.props.postValues.content : '';

        if(!this.state.postEditorActive){
            this.openPostEditor(threadId, threadSlug, threadName);
        }else if(!this.state.showPostEditor){
            this.togglePostEditor();
        }
        this.props.changePostEditor(oldContent + quoteHeader + quoteContent);
    }

    handlePostReply = (userName, postId, threadId, threadSlug, threadName, postContent) => {
        let beginning = '\n\n';
        if(!this.props.postValues || !this.props.postValues.content || this.props.postValues.content === '') {
            beginning = '';
        }
        const quoteHeader = beginning + userName + " said in [url=/forums/thread/" + threadId + "/" + threadSlug + "#" + postId + "]" + threadName + "[/url]:";

        const quoteContent = "\n[quote]" + postContent + "[/quote]\n\n";

        const oldContent = this.props.postValues ? this.props.postValues.content : '';

        this.openPostEditor(threadId, threadSlug, threadName);
        this.props.changePostEditor(oldContent + quoteHeader + quoteContent);
    }

    handleThreadCreate = (slug, subCategoryId, subCategoryName) => {
        this.props.changePostEditor('');
        this.setState({
            showPostEditor: true, 
            postEditorThread: null, 
            postEditorSlug: slug, 
            postEditorActive: true, 
            postEditorThreadName: '', 
            postEditorSubCategory: subCategoryId,
            postEditorSubCategoryName: subCategoryName
        });
    }

    openPostEditor = (threadId, slug, threadName, subCategoryId, subCategoryName) => {
        this.setState({
            showPostEditor: true, 
            postEditorThread: threadId, 
            postEditorSlug: slug, 
            postEditorActive: true, 
            postEditorThreadName: threadName, 
            postEditorSubCategory: subCategoryId,
            postEditorSubCategoryName: subCategoryName
        });
    }

    togglePostEditor = () => {
        this.setState((prevState) => {
            return {showPostEditor: !prevState.showPostEditor}
         });
    }

    closePostEditor = () => {
        this.setState({
            postEditorActive: false,
            showPostEditor: false,
            postEditorThread: null,
            postEditorPost: null,
            postEditorSlug: '',
            postEditorThreadName: '',
            postEditorSubCategory: null,
            postEditorSubCategoryName: ''
        });
    }

    render() {

        let editor=null;
        // let postCreated=null;
        // if(this.state.NewPost){
        //     const path = "/thread/" + this.state.postEditorThread + "/" + this.state.postEditorSlug;
        //     postCreated=<Redirect to={path} />;
        // }

        let pad='0rem';

        if(this.state.showPostEditor){
            pad = '40rem';
            let pathBeginning = "/thread/" + this.state.postEditorThread;
            if (!this.state.postEditorThread){
                pathBeginning = "/" + this.state.postEditorSubCategory;
            }
            editor=(
                <div style={{position: 'fixed', bottom: '0px', left: '0px', right: '0px', backgroundColor: '#778899', height: '40rem'}}>
                    <PostForm 
                        closeForm={this.closePostEditor} 
                        threadId={this.state.postEditorThread || 1} 
                        path={pathBeginning + "/" + this.state.postEditorSlug}
                        threadName={this.state.postEditorThreadName || ''}
                        postId={this.state.postEditorPost}
                        subCategoryId={this.state.postEditorSubCategory}
                        subCategoryName={this.state.postEditorSubCategoryName} />
                </div>
            );
        }

        return (
            <div className={classes.Forums} style={{paddingBottom: `${pad}`}}>
                <Switch>
                    <Route path="/forums" exact render={() => {
                        let editorButton;
                        if (this.state.postEditorActive) {
                            editorButton = (
                                <button 
                                    onClick={this.togglePostEditor} 
                                    style={{position: 'fixed', bottom: '0px', right: '0px', 'zIndex': '10'}}>
                                    EDITOR
                                </button>
                            );
                        }
                        return (
                            <div>
                                <Categories />
                                {editorButton}
                            </div>
                        )
                    }} />
                    <Route path="/forums/thread/:id/:slug" render={({match}) => {
                        let editorButton;
                        if (this.state.postEditorActive) {
                            editorButton = (
                                <button 
                                    onClick={this.togglePostEditor} 
                                    style={{position: 'fixed', bottom: '0px', right: '0px', 'zIndex': '10'}}>
                                    EDITOR
                                </button>
                            );
                        }
                        return (
                            <div>
                                <Thread 
                                    key={match.params.id} 
                                    id={match.params.id} 
                                    slug={match.params.slug} 
                                    handlePostCreate={this.openPostEditor}
                                    handlePostEdit={this.handlePostEdit}
                                    handlePostDelete={this.handlePostDelete}
                                    handlePostQuote={this.handlePostQuote}
                                    handlePostReply={this.handlePostReply}/>
                                {editorButton}
                            </div>
                        );
                        
                    }} />
                    <Route path="/forums/:id/:slug" render={({match}) => {
                        let editorButton;
                        if (this.state.postEditorActive) {
                            editorButton = (
                                <button 
                                    onClick={this.togglePostEditor} 
                                    style={{position: 'fixed', bottom: '0px', right: '0px', 'zIndex': '10'}}>
                                    EDITOR
                                </button>
                            );
                        }
                        return (
                            <div>
                                <SubCategoryPage key={match.params.id} id={match.params.id} slug={match.params.slug} handleThreadCreate={this.handleThreadCreate}/>
                                {editorButton}
                            </div>
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
        threadData: state.forums.threadData,
        postValues: getFormValues('postForm')(state)
    };
}

const mapDispatchToProps = (dispatch) => {
	return {
        changePostEditor : (value) => dispatch(change('postForm', 'content', value)),
        onDeletePost: (postId, path, history) => dispatch(actions.deletePost(postId, path, history))
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Forums));