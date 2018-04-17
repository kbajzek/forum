import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import categoryForm from '../fields';
import * as actions from '../../../store/actions';

class CategoryForm extends Component {

    onSurveySubmit = ({name}) => {
        this.props.onInitCreateCategory(name);
        this.props.closeCatForm();
    }

    renderFields = () => {
        return categoryForm.map( ({label, name})  => {
          return (
            <Field
              key={name}
              component="input"
              type="text"
              label={label}
              name={name}
            />
          );
        });
      }

    validate = (values) => {
        const errors = {};
        
        categoryForm.forEach(({ name }) => {
            if (!values[name]) {
            errors[name] = 'You must provide a value';
            }
        });
        
        return errors;
    }

    render() {
        return(
            <form onSubmit={this.props.handleSubmit(this.onSurveySubmit)}>
                {this.renderFields()}
                <button type="submit">SUBMIT</button>
                <button onClick={this.props.closeCatForm}>CANCEL</button>
            </form>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onInitCreateCategory: (name) => dispatch(actions.initCreateCategory(name))
    }
}

export default connect(null, mapDispatchToProps)(
    reduxForm({
        validate: this.validate,
        form: 'categoryForm'
    })(CategoryForm)
);