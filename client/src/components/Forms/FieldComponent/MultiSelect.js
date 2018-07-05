import React, {Component} from 'react';

class MultiSelect extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.outerTextInput = React.createRef();
        this.sizeInput = React.createRef();
        this.state = {
            suggestions: [{key: 1, label: 'apple'}, {key: 2, label: 'banana'}],
            suggestionsOpen: false,
            textWidth: 10,
            textValue: ''
        };
    }

    handleOnChange = (event) => {
        this.setState(
            { textValue: event.target.value },
            () => {this.setState({textWidth: Math.max(10, this.sizeInput.current.scrollWidth)})}
          );
    }

    handleOnClick = () => {
        if (this.textInput.current !== document.activeElement){
            this.textInput.current.focus();
        }
        
    }

    handleOnFocus = () => {
        this.setState({suggestionsOpen: true});
    }

    handleOnBlur = (e) => {
        if (e.relatedTarget === this.outerTextInput.current){
            e.preventDefault();
            this.textInput.current.focus();
        }else{
            this.setState({suggestionsOpen: false});
        }
        
    }
    
    render() {

        let suggestionList = null;

        if(this.state.suggestionsOpen){
            suggestionList = this.state.suggestions.map(({key, label}) => {
                return(
                    <div key={key}>
                        {label}
                    </div>
                );
            });
        }
    
        return (
            <div>
                <div 
                    ref={this.outerTextInput} 
                    tabIndex="0" 
                    onFocus={this.handleOnClick} 
                    onClick={this.handleOnClick} 
                    style={{padding: '1rem', backgroundColor: 'red', cursor: 'text', position: 'relative', display: 'flex'}}>
                    <div style={{display: 'flex', flexBasis: 'min-content'}}>
                        <input 
                            onFocus={this.handleOnFocus} 
                            onBlur={this.handleOnBlur} 
                            style={{outline: 'none', border: 'none', width: `${this.state.textWidth}px`}} 
                            ref={this.textInput} 
                            onChange={this.handleOnChange} 
                            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/> 
                    </div>
                </div>
                <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', backgroundColor: 'white'}}>
                    {suggestionList}
                </div>
                <input value={this.state.textValue} ref={this.sizeInput} style={{position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, width: 0}}/>
            </div>
        );
    }
}

export default MultiSelect;