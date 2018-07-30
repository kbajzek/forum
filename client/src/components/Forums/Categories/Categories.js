import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as categoryActions from '../../../store/ducks/category';

import ErrorPage from '../ErrorPage/ErrorPage';
import Category from './Category/Category';
import Spinner from '../../UI/Spinner/Spinner';
import CategoryForm from '../../Forms/CategoryForm/CategoryForm';

class Categories extends Component {

    state = {
        showCatForm: false
    };

    toggleCategoryCreator = () => {
        this.setState(function(prevState){
            return {showCatForm: !prevState.showCatForm}
         });
    }
    
    componentDidMount() {
        this.props.onInitCategoryData();
    }
    
    render() {

        let catForm;
        let catButton = this.props.auth ? <button onClick={this.toggleCategoryCreator}>CREATE CATEGORY</button> : null;

        const categoryErrors = categoryActions.getCategoryErrors(this.props.categoryData);
        const categoryLoading = categoryActions.getCategoryLoading(this.props.categoryData);
        const categoryLoaded = categoryActions.getCategoryLoaded(this.props.categoryData);
        const categoryCategories = categoryActions.getCategoryCategories(this.props.categoryData);

        let categories;

        if(categoryErrors.length > 0){

            categories = <ErrorPage error = {categoryErrors[0]}/>

        }else if(categoryLoading){

            categories = <Spinner />

        }else if(categoryLoaded){

            if(this.state.showCatForm) {
                catForm = <CategoryForm closeForm={this.toggleCategoryCreator} />
            }

            categories = categoryCategories.map(({id, name, subCategories}) => {
                return (
                    <Category 
                        key={id}
                        categoryId={id}
                        name={name} 
                        subcategories={subCategories}
                        auth={this.props.auth} />
                );
            });
        }

        
    
        return (
            <div>
                {catButton}
                {catForm}
                {categories}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        categoryData: state.category,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitCategoryData: () => dispatch(categoryActions.fetchCategoryDataBegin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);