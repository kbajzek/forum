import React, {Component} from 'react';

class FieldComponent extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.textarea = React.createRef();
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 9) { // tab was pressed
            e.preventDefault();
            // get caret position/selection
            let val = this.textarea.current.value,
                start = this.textarea.current.selectionStart,
                end = this.textarea.current.selectionEnd;
    
            // set textarea value to: text before caret + tab + text after caret
            const updatedValue = val.substring(0, start) + '    ' + val.substring(end);

            // update textarea value to stop rerender and killing cursor position
            this.textarea.current.value = updatedValue;
    
            // update form value
            this.props.change('content', updatedValue);

            // put caret at right position again
            this.textarea.current.selectionStart = start + 4;
            this.textarea.current.selectionEnd = start + 4;
    
        }
    };

    render() {
        const { input, label, meta: { error, touched } } = this.props;
        return (
            <div>
                <label>{label}</label>
                <textarea ref={this.textarea} onKeyDown={this.handleKeyDown} {...input} style={{ marginBottom: '5px', width: '100%', height: '10rem', boxSizing: 'border-box' }} />
                <div style={{ marginBottom: '20px', color: 'red' }}>
                    {touched && error}
                </div>
            </div>
        );
    }
}

export default FieldComponent;