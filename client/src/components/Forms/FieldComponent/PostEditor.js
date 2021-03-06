import React, {Component} from 'react';

import PostContent from '../../Forums/Thread/Post/PostContent/PostContent';

import * as classes from './PostEditor.module.css';

class PostEditor extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.textarea = React.createRef();
        this.postPreview = React.createRef();
    }

    // handleKeyDown = (e) => {
    //     if (e.keyCode === 9) { // tab was pressed
    //         e.preventDefault();
    //         // get caret position/selection
    //         let val = this.textarea.current.value,
    //             start = this.textarea.current.selectionStart,
    //             end = this.textarea.current.selectionEnd;
    
    //         // set textarea value to: text before caret + tab + text after caret
    //         const updatedValue = val.substring(0, start) + '    ' + val.substring(end);

    //         // update textarea value to stop rerender and killing cursor position
    //         this.textarea.current.value = updatedValue;
    
    //         // update form value
    //         this.props.change('content', updatedValue);

    //         // put caret at right position again
    //         this.textarea.current.selectionStart = start + 4;
    //         this.textarea.current.selectionEnd = start + 4;
    
    //     }
    // };

    handleScroll = (e) => {
        this.postPreview.current.scrollTop = (this.postPreview.current.scrollHeight-this.postPreview.current.clientHeight) * (e.target.scrollTop/(e.target.scrollHeight-e.target.clientHeight));
    }

    handleBold = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[b]" + val.substring(start, end) + "[/b]" + val.substring(end);

        const strLength = "[b]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 3;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleItalicize = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[i]" + val.substring(start, end) + "[/i]" + val.substring(end);

        const strLength = "[i]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 3;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleUnderline = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[u]" + val.substring(start, end) + "[/u]" + val.substring(end);

        const strLength = "[u]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 3;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleStrikethrough = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[s]" + val.substring(start, end) + "[/s]" + val.substring(end);

        const strLength = "[s]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 3;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleLeft = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[left]" + val.substring(start, end) + "[/left]" + val.substring(end);

        const strLength = "[left]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 6;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleRight = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[right]" + val.substring(start, end) + "[/right]" + val.substring(end);

        const strLength = "[right]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 7;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleCenter = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[center]" + val.substring(start, end) + "[/center]" + val.substring(end);

        const strLength = "[center]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 8;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleJustify = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[justify]" + val.substring(start, end) + "[/justify]" + val.substring(end);

        const strLength = "[justify]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 9;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleIndent = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[indent]" + val.substring(start, end) + "[/indent]" + val.substring(end);

        const strLength = "[indent]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 8;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleColor = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[color=#000000]" + val.substring(start, end) + "[/color]" + val.substring(end);

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 8;
        this.textarea.current.selectionEnd = start + 14;
    };

    handleSize = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[size=16]" + val.substring(start, end) + "[/size]" + val.substring(end);

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 6;
        this.textarea.current.selectionEnd = start + 8;
    };

    handleUrl = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        let updatedValue = val.substring(0, start) + "[url=]" + val.substring(start, end) + "[/url]" + val.substring(end);

        if(start===end){
            updatedValue = val.substring(0, start) + "[url][/url]" + val.substring(end);
        }

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 5;
        this.textarea.current.selectionEnd = start + 5;
    };

    handleImage = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[image]" + val.substring(start, end) + "[/image]" + val.substring(end);

        const strLength = "[image]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 7;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleYoutube = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[youtube]" + val.substring(start, end) + "[/youtube]" + val.substring(end);

        const strLength = "[youtube]" + val.substring(start, end);
        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 9;
        this.textarea.current.selectionEnd = start + strLength.length;
    };

    handleCode = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        const updatedValue = val.substring(0, start) + "[code=coffeescript]" + val.substring(start, end) + "[/code]" + val.substring(end);

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + 6;
        this.textarea.current.selectionEnd = start + 18;
    };

    handleOrderedList = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        let n = '\n';
        if (val.substring(start-1,start) === '\n' || start === 0){
            n = '';
        }

        let n2 = '\n';
        if (val.substring(end,end+1) === '\n' || end === val.length){
            n2 = '';
        }

        let updatedValue = val.substring(0, start) + n + "[list=o]\n[li]" + val.substring(start, end) + "[/li]\n[/list]" + n2 + val.substring(end);

        if(start===end){
            updatedValue = val.substring(0, start) + n + "[list=o]\n[li]" + val.substring(start, end) + "[/li]\n[li][/li]\n[li][/li]\n[/list]" + n2 + val.substring(end);
        }

        const lengthStr = n + "[list=o]\n[li]" + val.substring(start, end);
        const lengthStr2 = n + "[list=o]\n[li]";

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + lengthStr2.length;
        this.textarea.current.selectionEnd = start + lengthStr.length;
    };

    handleUnorderedList = (e) => {
        e.preventDefault();
        // get caret position/selection
        let val = this.textarea.current.value,
            start = this.textarea.current.selectionStart,
            end = this.textarea.current.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        let n = '\n';
        if (val.substring(start-1,start) === '\n' || start === 0){
            n = '';
        }

        let n2 = '\n';
        if (val.substring(end,end+1) === '\n' || end === val.length){
            n2 = '';
        }

        let updatedValue = val.substring(0, start) + n + "[list=u]\n[li]" + val.substring(start, end) + "[/li]\n[/list]" + n2 + val.substring(end);

        if(start===end){
            updatedValue = val.substring(0, start) + n + "[list=u]\n[li]" + val.substring(start, end) + "[/li]\n[li][/li]\n[li][/li]\n[/list]" + n2 + val.substring(end);
        }

        const lengthStr = n + "[list=o]\n[li]" + val.substring(start, end);
        const lengthStr2 = n + "[list=o]\n[li]";

        // update textarea value to stop rerender and killing cursor position
        this.textarea.current.value = updatedValue;

        // update form value
        this.props.change('content', updatedValue);

        // put caret at right position again
        this.textarea.current.focus();
        this.textarea.current.selectionStart = start + lengthStr2.length;
        this.textarea.current.selectionEnd = start + lengthStr.length;
    };

    render() {
        //const { input, label, meta: { error, touched } } = this.props;
        const { input } = this.props;
        return (
            <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                    <button className={classes.styleButton} onClick={this.handleBold}>B</button>
                    <button className={classes.styleButton} onClick={this.handleItalicize}>I</button>
                    <button className={classes.styleButton} onClick={this.handleUnderline}>U</button>
                    <button className={classes.styleButton} onClick={this.handleStrikethrough}>S</button>
                    <button className={classes.styleButton2} onClick={this.handleLeft}>Left</button>
                    <button className={classes.styleButton3} onClick={this.handleRight}>Right</button>
                    <button className={classes.styleButton6} onClick={this.handleCenter}>Center</button>
                    <button className={classes.styleButton3} onClick={this.handleJustify}>Justify</button>
                    <button className={classes.styleButton2} onClick={this.handleIndent}>Indent</button>
                    <button className={classes.styleButton} onClick={this.handleColor}>Color</button>
                    <button className={classes.styleButton} onClick={this.handleSize}>Size</button>
                    <button className={classes.styleButton} onClick={this.handleUrl}>Link</button>
                    <button className={classes.styleButton7} onClick={this.handleImage}>Image</button>
                    <button className={classes.styleButton3} onClick={this.handleYoutube}>Youtube</button>
                    <button className={classes.styleButton6} onClick={this.handleCode}>Code</button>
                    <button className={classes.styleButton5} onClick={this.handleOrderedList}>List</button>
                    <button className={classes.styleButton4} onClick={this.handleOrderedList}>Ordered List</button>
                    <button className={classes.styleButton4} onClick={this.handleUnorderedList}>Unordered List</button>
                </div>
                <div style={{'display': 'flex', flexGrow: '1', overflow: 'hidden'}}>
                    <div className={!this.props.preview ? classes.TextArea : classes.TextAreaPreview}>
                        <textarea ref={this.textarea} onScroll={this.handleScroll} {...input} 
                            style={{ fontFamily:'sans-serif', height: '100%', width: '100%', margin: '0', padding: '.5rem', resize: 'none', 'boxSizing': 'border-box', fontSize: '16px', backgroundColor: '#aaaaaa'}} />
                    </div>
                    <div className={!this.props.preview ? classes.PostContent : classes.PostContentPreview}>
                        <div ref={this.postPreview} style={{fontSize: '16px', height: '100%', width: '100%', backgroundColor: '#aaaaaa', overflow: 'auto'}}>
                            <PostContent content={this.props.contentValue}/>
                        </div>
                    </div>
                </div>
                

                <div style={{ flexShrink: '0', color: 'red', fontSize: '16px' }}>
                    {this.props.meta.touched && this.props.meta.error}
                </div>

                
            </div>
        );
    }
}

export default PostEditor;