import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import * as subCategoryActions from '../../../store/ducks/subCategory';

import ErrorPage from '../ErrorPage/ErrorPage';
import SubCategory from './../Categories/Category/SubCategory/SubCategory';
import ThreadPreview from '../ThreadPreview/ThreadPreview';
import Spinner from '../../UI/Spinner/Spinner';
import SubCategoryForm from '../../Forms/SubCategoryForm/SubCategoryForm';

import classes from './SubCategoryPage.module.css';

class SubCategoryPage extends Component {

    state = {
        showSubCatForm: false
    }

    toggleSubCategoryCreator = () => {
        this.setState((prevState) => {
            return {showSubCatForm: !prevState.showSubCatForm}
         });
    }

    closeSubCategoryCreator = () => {
        this.setState({showSubCatForm: false});
    }

    handleThreadCreator = () => {
        this.props.handleThreadCreate(this.props.id);
    }

    componentDidMount() {
        this.props.onInitSubCategoryPageData(this.props.id);
    }
    
    render() {

        let subCatForm;
        let subCatBreadcrumb;

        let subCatButton = this.props.auth ? <button onClick={this.toggleSubCategoryCreator}>CREATE SUBCATEGORY</button> : null;

        let threadButton = this.props.auth ? <button onClick={this.handleThreadCreator}>CREATE THREAD</button> : null;

        const subCategoryErrors = subCategoryActions.getSubCategoryErrors(this.props.subCategoryData);
        const subCategoryLoading = subCategoryActions.getSubCategoryLoading(this.props.subCategoryData);
        const subCategoryLoaded = subCategoryActions.getSubCategoryLoaded(this.props.subCategoryData);
        const subCategorySubCategories = subCategoryActions.getSubCategorySubCategories(this.props.subCategoryData);
        const subCategoryThreads = subCategoryActions.getSubCategoryThreads(this.props.subCategoryData);
        const subCategoryName = subCategoryActions.getSubCategoryName(this.props.subCategoryData);
        const subCategoryId = subCategoryActions.getSubCategoryId(this.props.subCategoryData);
        const subCategoryBreadcrumb = subCategoryActions.getSubCategoryBreadcrumb(this.props.subCategoryData);

        let subcategorypage;

        if(subCategoryErrors.length > 0){

            subcategorypage = <ErrorPage error = {subCategoryErrors[0]}/>

        // }else if(subCategoryLoading){

        //     subcategorypage = <Spinner />

        }else if(subCategoryLoaded){

            subCatBreadcrumb = subCategoryBreadcrumb.reduce((array, crumb, index) => {
                if(crumb.categoryId){
                    return array.concat([(
                        <Link
                            style={{textDecoration: 'none', fontSize: '1.6rem'}}
                            key={crumb.categoryId  + " (category)"}
                            to={{
                                pathname: "/forums"
                            }}>
                            {crumb.categoryName}
                        </Link>
                    )]);
                }else{
                    return array.concat([(
                        <div
                            key={crumb.subcategoryId + "/"}
                            style={{fontSize: '1.6rem', padding: '0 .3rem'}}
                            >
                            /
                        </div>
                    ),(
                        subCategoryBreadcrumb.length - 1 !== index
                        ? <Link
                            style={{textDecoration: 'none', fontSize: '1.6rem'}}
                            key={crumb.subcategoryId}
                            to={{
                                pathname: "/forums" + crumb.subcategoryPath
                            }}>
                            {crumb.subcategoryName}
                        </Link> 
                        : <div
                            style={{fontSize: '1.6rem'}}
                            key={crumb.subcategoryId}>
                            {crumb.subcategoryName}
                        </div> 
                    )]);
                }
            }, []);

            if(this.state.showSubCatForm) {
                subCatForm = <SubCategoryForm closeForm={this.closeSubCategoryCreator} subCategoryId={subCategoryId} path={"/" + this.props.id + "/" + this.props.slug} />
            }

            const subcat_markup = subCategorySubCategories.map(({id, name, description, totalPosts, lastActiveThread, path}) => {
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
        
            const thread_markup = subCategoryThreads.map(({id, name, creator, createdOn, totalViews, totalReplies, lastPost, path}) => {
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
                    {subCatButton}
                    {subCatForm}
                    {threadButton}
                    <div className={classes.Header}>{subCategoryName}</div>
                    <div
                        style={{display: 'flex', flexDirection: 'row', margin: '2rem'}}
                        >{subCatBreadcrumb}</div>
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
        subCategoryData: state.subCategory,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitSubCategoryPageData: (subCategoryId) => dispatch(subCategoryActions.fetchSubCategoryDataBegin(subCategoryId))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubCategoryPage));