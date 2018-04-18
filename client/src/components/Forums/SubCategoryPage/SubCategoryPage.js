import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import SubCategory from './../Categories/Category/SubCategory/SubCategory';
import ThreadPreview from '../ThreadPreview/ThreadPreview';
import Spinner from '../../UI/Spinner/Spinner';
import SubCategoryForm from '../../Forms/SubCategoryForm/SubCategoryForm';
import ThreadForm from '../../Forms/ThreadForm/ThreadForm';

import classes from './SubCategoryPage.module.css';

class SubCategoryPage extends Component {

    state = {
        showSubCatForm: false,
        showThreadForm: false
    }

    toggleSubCategoryCreator = () => {
        this.setState((prevState) => {
            return {showSubCatForm: !prevState.showSubCatForm}
         });
    }

    closeSubCategoryCreator = () => {
        this.setState({showSubCatForm: false});
    }

    toggleThreadCreator = () => {
        this.setState((prevState) => {
            return {showThreadForm: !prevState.showThreadForm}
         });
    }

    closeThreadCreator = () => {
        this.setState({showThreadForm: false});
    }

    componentDidMount() {
        this.props.onInitSubCategoryPageData("/" + this.props.id + "/" + this.props.slug);
    }
    
    render() {

        let subCatForm;
        let threadForm;
        
        let subcategorypage = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        if (this.props.subCategoryPageData) {

            if(this.state.showSubCatForm) {
                subCatForm = <SubCategoryForm closeForm={this.closeSubCategoryCreator} subCategoryId={this.props.subCategoryPageData.id} path={"/" + this.props.id + "/" + this.props.slug} />
            }
    
            
            if(this.state.showThreadForm) {
                threadForm = <ThreadForm closeForm={this.closeThreadCreator} subCategoryId={this.props.subCategoryPageData.id} path={"/" + this.props.id + "/" + this.props.slug} />
            }

            const subcat_markup = this.props.subCategoryPageData.subCategories.map(({id, name, description, totalPosts, lastActiveThread, path}) => {
                return (
                    <SubCategory 
                        key={id}
                        name={name}
                        description={description}
                        totalPosts={totalPosts}
                        lastActiveThread={lastActiveThread}
                        pathName={path} />
                );
            });
        
            const thread_markup = this.props.subCategoryPageData.threads.map(({id, name, creator, createdOn, totalViews, totalReplies, lastPost, path}) => {
                return (
                    <ThreadPreview 
                        key={id}
                        name={name}
                        creator={creator}
                        createdOn={createdOn}
                        totalViews={totalViews}
                        totalReplies={totalReplies}
                        lastPost={lastPost}
                        pathName={path} />
                );
            });

            subcategorypage = (
                <div>
                    <button onClick={this.toggleSubCategoryCreator}>CREATE SUBCATEGORY</button>
                    {subCatForm}
                    <button onClick={this.toggleThreadCreator}>CREATE THREAD</button>
                    {threadForm}
                    <div className={classes.Header}>{this.props.subCategoryPageData.name}</div>
                    <div className={classes.SubCat}>{subcat_markup}</div>
                    <div>{thread_markup}</div>
        
        
        
                </div>
            );
        }

        return (
            <div>
                {subcategorypage}
            </div>
        )

        
    
    
        
    }
}

const mapStateToProps = state => {
    return {
        subCategoryPageData: state.forums.subCategoryPageData,
        error: state.forums.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitSubCategoryPageData: (path) => dispatch(actions.initSubCategoryPageData(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubCategoryPage));