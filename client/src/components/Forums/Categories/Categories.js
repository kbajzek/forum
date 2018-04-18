import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import Category from './Category/Category';
import Spinner from '../../UI/Spinner/Spinner';
import CategoryForm from '../../Forms/CategoryForm/CategoryForm';

class Categories extends Component {

    state = {
        showCatForm: false
    };

    toggleCategoryCreator = () => {
        this.setState(function(prevState, props){
            return {showCatForm: !prevState.showCatForm}
         });
    }
    
    componentDidMount() {
        this.props.onInitCategoryData();
    }
    
    render() {

        let categories = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        let catForm;

        if (this.props.categoryData) {

            if(this.state.showCatForm) {
                catForm = <CategoryForm closeForm={this.toggleCategoryCreator} />
            }

            categories = this.props.categoryData.map(({id, name, subCategories}) => {
                return (
                    <Category 
                        key={id}
                        categoryId={id}
                        name={name} 
                        subcategories={subCategories} />
                );
            });
        }

        
    
        return (
            <div>
                <button onClick={this.toggleCategoryCreator}>CREATE CATEGORY</button>
                {catForm}
                {categories}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        categoryData: state.forums.categoryData,
        error: state.forums.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitCategoryData: () => dispatch(actions.initCategoryData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);