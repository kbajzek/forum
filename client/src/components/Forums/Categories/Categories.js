import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import Category from './Category/Category';
import Spinner from '../../UI/Spinner/Spinner';

class Categories extends Component {
    
    componentDidMount() {
        this.props.onInitCategoryData();
    }
    
    render() {

        let categories = this.props.error ? <p>error occured with the backend api</p> : <Spinner />;

        if (this.props.categoryData) {
            categories = this.props.categoryData.map(({id, name, subcategories}) => {

                return (
                    <Category 
                        key={id}
                        name={name} 
                        subcategories={subcategories} />
                );
            });
        }

        
    
        return (
            <div>
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