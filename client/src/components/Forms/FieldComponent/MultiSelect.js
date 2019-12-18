import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

class MultiSelect extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.outerTextInput = React.createRef();
        this.sizeInput = React.createRef();
        this.suggestions = React.createRef();
        this.state = {
            suggestionsLoading: false,
            suggestionsOpen: false,
            textWidth: 10,
            textValue: ''
        };
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 8 && this.textInput.current.value === '' && this.props.input.value.length > 0) { // backspace was pressed
            this.removeSelection(this.props.input.value[this.props.input.value.length - 1].key);
        }
    }

    changeValues = (newSelections) => {
        this.props.input.onChange(newSelections);
    }

    removeSelection = (key) => {
        const newSelections = this.props.input.value.filter(sel => sel.key !== key);
        this.changeValues(newSelections);
    }

    addSelection = (e, key) => {
        e.preventDefault();
        const selected = this.props.userlistData.find((sugg) => sugg.key === key);
        const newSelections = this.props.input.value.concat(selected);
        this.changeValues(newSelections);
        this.clearInput();
    }

    clearInput = () => {
        this.textInput.current.value = '';
        this.setState({
            textValue: '', 
            textWidth: 10,
            suggestionsOpen: false,
            suggestionsLoading: false
        });
    }

    handleOnChange = (event) => {
        let suggestionIsOpen = false;
        if(event.target.value === ''){
            suggestionIsOpen = false;
        }else{
            suggestionIsOpen = true;
        }
        this.setState(
            { 
                textValue: event.target.value,
                suggestionsOpen: suggestionIsOpen,
                suggestionsLoading: suggestionIsOpen
            },
            () => {
                this.setState({textWidth: Math.max(10, this.sizeInput.current.scrollWidth)});
                this.handleDebouncing();
            }
        );
        
        
    }

    handleDebouncing = debounce(() => {
        if(this.state.suggestionsOpen){
            this.props.onFetchUserlistInit(this.state.textValue);
            this.setState({suggestionsLoading: false})
        }
    }, 500)

    handleOnClick = () => {
        if (this.textInput.current !== document.activeElement){
            this.textInput.current.focus();
        }
        
    }

    handleOnFocus = () => {
        if(this.state.textValue !== ''){
            this.setState({suggestionsOpen: true});
        }
    }

    handleOnBlur = (e) => {
        if (e.relatedTarget === this.outerTextInput.current || e.relatedTarget === this.suggestions.current){
            e.preventDefault();
            this.textInput.current.focus();
        }else{
            this.setState({suggestionsOpen: false});
        }
    }
    
    render() {

        let suggestionList = null;
        let selectionList = null;

        if(this.state.suggestionsOpen && !this.state.suggestionsLoading){
            const suggestions = this.props.userlistData.filter(sugg => !this.props.input.value.find(sel => sel.key === sugg.key));
            if(suggestions.length < 1){
                suggestionList = (
                    <div>
                        No Results
                    </div>
                );
            }else{
                suggestionList = suggestions.map(({key, label}) => {
                    return(
                        <div key={key} onClick={(e) => this.addSelection(e, key)}>
                            {label}
                        </div>
                    );
                });
            }
        }

        if(this.state.suggestionsLoading || this.props.userlistLoading){
            suggestionList = (
                <div>
                    Loading...
                </div>
            );
        }

        selectionList = this.props.input.value.map(({key, label}) => {
            return(
                <div key={key} style={{display: 'flex', flexDirection: 'row', backgroundColor: 'blue', color: 'white', padding: '.5rem', boxSizing: 'border-box', borderRadius: '3px', fontSize: '1.3rem', marginRight: '.5rem'}}>
                    <button style={{border: 'none', backgroundColor: 'blue', color: 'white', fontWeight: 700, marginRight: '.5rem'}} onClick={(e) => this.removeSelection(key)}>X</button>
                    <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>{label}</div>
                </div>
            );
        });

        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{marginRight: '.5rem', fontSize: '1.5rem'}}>{this.props.label + ':'}</label>
                <div 
                    ref={this.outerTextInput} 
                    tabIndex="0" 
                    onFocus={this.handleOnClick} 
                    onClick={this.handleOnClick} 
                    style={{padding: '.5rem', backgroundColor: 'white', cursor: 'text', position: 'relative', display: 'flex', width: '18rem', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {selectionList}
                    <input 
                        onFocus={this.handleOnFocus} 
                        onBlur={this.handleOnBlur}
                        onKeyDown={this.handleKeyDown}
                        style={{marginLeft: '.5rem', outline: 'none', border: 'none', width: `${this.state.textWidth}px`}} 
                        ref={this.textInput} 
                        onChange={this.handleOnChange} 
                        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/> 
                    <div ref={this.suggestions} tabIndex="0" style={{position: 'absolute', display: 'flex', flexDirection: 'column', backgroundColor: 'white', cursor: 'pointer', top: '100%', left: 0}}>
                        {suggestionList}
                    </div>
                </div>
                <input value={this.state.textValue} ref={this.sizeInput} style={{position: 'absolute', visibility: 'hidden', height: 0, width: 0}}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userlistData: state.forums.userlistData,
        userlistLoading: state.forums.userlistLoading,
        error: state.forums.error,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchUserlistInit: (search) => dispatch(actions.fetchUserlistInit(search))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelect);