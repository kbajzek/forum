import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import fields from './fields';
import FieldComponent from '../FieldComponent/FieldComponent';
import * as subCategoryActions from '../../../store/ducks/subCategory';

class SubCategoryForm extends Component {

    onFormSubmit = ({name, description}) => {
        this.props.onCreateSubCategory(name, description, this.props.categoryId, this.props.subCategoryId);
        this.props.closeForm();
    }

    renderFields = () => {
        return fields.map( ({label, name})  => {
            return (
                <Field
                    key={name}
                    component={FieldComponent}
                    type="text"
                    label={label}
                    name={name}
                />
            );
        });
    }

    render() {
        return(
            <form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                {this.renderFields()}
                <button type="submit">SUBMIT</button>
                <button onClick={this.props.closeForm}>CANCEL</button>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    
    fields.forEach(({ name }) => {
        if (!values[name]) {
        errors[name] = 'You must provide a value';
        }
    });
    
    return errors;
}

const mapDispatchToProps = dispatch => {
    return {
        onCreateSubCategory: (name, description, categoryId, subCategoryId) => dispatch(subCategoryActions.createSubCategoryBegin(name, description, categoryId, subCategoryId))
    }
}

export default connect(null, mapDispatchToProps)(
    reduxForm({
        validate,
        form: 'subCategoryForm'
    })(SubCategoryForm)
);