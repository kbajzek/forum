import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import fields from './fields';
import FieldComponent from '../FieldComponent/FieldComponent';
import * as categoryActions from '../../../store/ducks/category';

class CategoryForm extends Component {

    onFormSubmit = ({ name }) => {
        this.props.onCreateCategory(name);
        this.props.closeForm();
    }

    handleClick = (e) => {
        e.stopPropagation();
    }

    renderFields = () => {
        return fields.map(({ label, name }) => {
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
        return (
            <div>
                <div onClick={this.props.closeForm} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: '500', backgroundColor: 'rgba(0,0,0,.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div onClick={this.handleClick} style={{ backgroundColor: '#fff', padding: '1rem', boxSizing: 'border-box' }}>
                        <form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                            {this.renderFields()}
                            <button style={{color: '#fff', backgroundColor: '#197CA3', margin: '.5rem', border: 'none', padding: '.5rem', borderRadius: '3px', cursor: 'pointer'}} type="submit">SUBMIT</button>
                            <button style={{color: '#fff', backgroundColor: '#DB2929', margin: '.5rem', border: 'none', padding: '.5rem', borderRadius: '3px', cursor: 'pointer'}} onClick={this.props.closeForm}>CANCEL</button>
                        </form>
                    </div>
                </div>
            </div>


        );
    }
};

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
        onCreateCategory: (name) => dispatch(categoryActions.createCategoryBegin(name))
    }
}

export default connect(null, mapDispatchToProps)(
    reduxForm({
        validate,
        form: 'categoryForm'
    })(CategoryForm)
);