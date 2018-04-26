import React, {Component} from 'react';
import peg from 'pegjs';
import Highlight from 'react-highlight';

const parse = (text) => {
    const tagStack = [];
    const tagNameStack = [];
    const positionStack = [];

    let tempTagStack = [];
    let tempTagNameStack = [];
    let tempPositionStack = [];

    let finalStructure = {};

    // reply, spoiler
    const tags = ['b','i','u','s','left','right','center','justify', 'indent', 'size', 'color', 'url', 'image', 'youtube', 'code', 'list', 'li'];
    const dontParse = ['url', 'image', 'youtube', 'code'];

    const tag = new RegExp("\\[([/])?(" + tags.join("|") + ")([=][^\\]]*?)?\\]", "gi");
    const tag2 = new RegExp("\\[(" + dontParse.join("|") + ")([=][^\\]]*?)?\\]([\\S\\s]*?)\\[/\\1\\]", "gi");

    text = text.replace(/</g, "&lt;"); // escape HTML tag brackets
    text = text.replace(/>/g, "&gt;"); // escape HTML tag brackets

    text = text.replace(tag, function(matched, isClosing, tagName, tagParams) {
        const params = tagParams || ''; // So we don't append 'undefined' to the replacement
        const closing = isClosing || ''; // So we don't append 'undefined' to the replacement
        return "<" + closing + tagName + params + ">";
    });

    text = text.replace(/\[/g, "&bad1;"); // escape ['s that aren't apart of tags
    text = text.replace(/\]/g, "&bad2;"); // escape ['s that aren't apart of tags
    text = text.replace(/</g, "["); // put back tags
    text = text.replace(/>/g, "]"); // put back tags

    // take care of noparsing blocks
    while ( text !== (text = text.replace(tag2, function(matchStr, tagName, tagParams, tagContents) {
        tagContents = tagContents.replace(/\[/g, "&bad1;");
        tagContents = tagContents.replace(/\]/g, "&bad2;");
        tagParams = tagParams || "";
        tagContents = tagContents || "";
        return "[" + tagName + tagParams + "]" + tagContents + "[/" + tagName + "]";
    })) );

    // if arranging lists with just \n in between the tags, remove it
    //have to do it twice because: (regex.lastIndex = *) before: *[/list]/n[list]/n[li] after: [/list][list]*/n[li], so won't get all of them first time round
    text = text.replace(/\[([\/])?(li|list)([=][^\]]*?)?\]\n\[([\/])?(li|list)([=][^\]]*?)?\]/g, function(match, tagClose1, tagName1, tagParams1, tagClose2, tagName2, tagParams2){
        const close1 = tagClose1 || '';
        const close2 = tagClose2 || '';
        const params1 = tagParams1 || '';
        const params2 = tagParams2 || '';
        return "[" + close1 + tagName1 + params1 + "][" + close2 + tagName2 + params2 + "]";
    });
    text = text.replace(/\[([\/])?(li|list)([=][^\]]*?)?\]\n\[([\/])?(li|list)([=][^\]]*?)?\]/g, function(match, tagClose1, tagName1, tagParams1, tagClose2, tagName2, tagParams2){
        const close1 = tagClose1 || '';
        const close2 = tagClose2 || '';
        const params1 = tagParams1 || '';
        const params2 = tagParams2 || '';
        return "[" + close1 + tagName1 + params1 + "][" + close2 + tagName2 + params2 + "]";
    });
    text = text.replace(/\[\/list\]\n/g, function(match){
        return '[/list]';
    });

    const findTag = (tag) => {
        
        const lastTag = tempTagStack.pop();
        const lastTagName = tempTagNameStack.pop();
        const lastPosition = tempPositionStack.pop();

        if (tag === lastTagName) {
            tempTagStack.push(lastTag);
            tempTagNameStack.push(lastTagName);
            tempPositionStack.push(lastPosition);
            return tempTagStack.length;
        } else if (tempTagStack.length === 0) {
            return null;
        } else {
            return findTag(tag);
        }
    };

    let match = tag.exec(text);

    while(match !== null) {
        //console.log(text)
        const [matched, isClosing, tagName, tagParams] = match;
        //console.log(matched, isClosing, tagName, tagParams)
        //console.log(tagStack)

        const params = tagParams || ''; // So we don't append 'undefined' to the replacement

        

        if (isClosing) {
            tempTagStack = [...tagStack];
            tempTagNameStack = [...tagNameStack];
            tempPositionStack = [...positionStack];
            
            let pos = findTag(tagName);

            //console.log(pos)

            if (!pos) { // cant find closing tag in stack, eat it
                const newString = "&bad1;/" + tagName + params + "&bad2;"; // + 13 for placeholders, - 3 for removing "[/]" 
                text = text.substr(0, tag.lastIndex - newString.length + 13 - 3) + newString + text.substr(tag.lastIndex);
            } else {
                const newString = "</" + tagName + params + ">";
                text = text.substr(0, tag.lastIndex - newString.length) + newString + text.substr(tag.lastIndex);
                let i = tagStack.length - pos;
                while(i !== 0) { // if not at end of stack, remove the wrong ones
                    const lastTag = tagStack.pop();
                    const lastTagName = tagNameStack.pop();
                    const lastPosition = positionStack.pop();
                    const newString = "&bad1;" + lastTag.substr(1, lastTag.length - 2) + "&bad2;";
                    text = text.substr(0, lastPosition - lastTag.length) + newString + text.substr(lastPosition);
                    i--;
                }
                const lastTag = tagStack.pop();
                const lastTagName = tagNameStack.pop();
                const lastPosition = positionStack.pop();
            }

        } else { // is an opening tag
            if(tagName === 'li' && (tagNameStack[tagNameStack.length-1] !== 'list' || tagNameStack.indexOf('li') > -1)){ // li has to be in another list, li cant be in an li, and list has to be direct parent of li
                const newString = "&bad1;" + tagName + params + "&bad2;";
                text = text.substr(0, tag.lastIndex-matched.length) + newString + text.substr(tag.lastIndex );
            }else if(tagName === 'list' && tagNameStack.indexOf('li') > -1){ // list can't be in an li
                const newString = "&bad1;" + tagName + params + "&bad2;";
                text = text.substr(0, tag.lastIndex-matched.length) + newString + text.substr(tag.lastIndex );
            } else {
                tagStack.push("<" + tagName + params + ">");
                tagNameStack.push(tagName);
                const newString = "<" + tagName + params + ">";
                text = text.substr(0, tag.lastIndex-newString.length) + newString + text.substr(tag.lastIndex );
                positionStack.push(tag.lastIndex);
            }
        }

        tag.lastIndex = 0;
        match = tag.exec(text);
    }  

    let i = tagStack.length;
    while(i !== 0) { // if not at end of stack, remove the wrong ones
        const lastTag = tagStack.pop();
        const lastTagName = tagNameStack.pop();
        const lastPosition = positionStack.pop();
        const newString = "&bad1;" + lastTag.substr(1, lastTag.length - 2) + "&bad2;";
        text = text.substr(0, lastPosition - lastTag.length) + newString + text.substr(lastPosition);
        i--;
    }

    text = text.replace(/</g, "["); // escape ['s that aren't apart of tags
    text = text.replace(/>/g, "]"); // escape ['s that aren't apart of tags


    const parser = peg.generate(
    `start =
    (Element / Text)*

    Element =
    "[" startTag:TagName tagAttribute:Attribute? "]" content:start "[/" endTag:TagName "]" {
        if (startTag != endTag) {
        throw new Error(
            "Expected [/" + startTag + "] but [/" + endTag + "] found."
        );
        }

        return {
        tag:    startTag,
        attribute: tagAttribute,
        content: content
        };
    }

    Attribute    
    = "=" chars:[^\\]]*  { return chars.join(""); }

    TagName = chars:[a-z]+ { return chars.join(""); }

    Text    = chars:[^[]+  { 
        let text = chars.join("");
        text = text.replace(/&bad1;/g, "[");
        text = text.replace(/&bad2;/g, "]");
        text = text.replace(/&lt;/g, "<");
        text = text.replace(/&gt;/g, ">");
        return text; 
    }`);

    //console.log(text);

    const tree = parser.parse(text);
    return tree;


    //console.log(JSON.stringify(tree, null, 2));    
    //done();
}













class PostContent extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        return nextProps.content !== this.props.content;
    }

    addNestedContent = (content, key, listType, listPos, ordered) => {
        let i = 0;
        if(Array.isArray(content)) {
            // console.log(content)
            return (
                <span key={key}>{content.map(child => {return this.addNestedContent(child, i++);})}</span>
            );
        }
        if(content.tag) {

            //const allowedSizes = [];

            if(content.tag === 'b') {
                return (
                    <span key={key} style={{'fontWeight': 'bold'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 'i') {
                return (
                    <span key={key} style={{'fontStyle': 'italic'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 'u') {
                return (
                    <span key={key} style={{'textDecoration': 'underline'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 's') {
                return (
                    <span key={key} style={{'textDecoration': 'line-through'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 'left') {
                return (
                    <div key={key} style={{'display': 'block', 'textAlign': 'left'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }else if(content.tag === 'right') {
                return (
                    <div key={key} style={{'display': 'block', 'textAlign': 'right'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }else if(content.tag === 'center') {
                return (
                    <div key={key} style={{'display': 'block', 'textAlign': 'center'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }else if(content.tag === 'justify') {
                return (
                    <div key={key} style={{'display': 'block', 'textAlign': 'justify'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }else if(content.tag === 'indent') {
                return (
                    <div key={key} style={{'display': 'block', 'paddingLeft': '4rem'}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }else if(content.tag === 'list') {
                let type = 1;
                let pos = 0;
                let order = false;
                if((content.attribute && content.attribute === 'o') || ordered) {
                    order = true;
                }
                if((content.attribute && content.attribute === 'u')) {
                    order = false;
                }
                if(listType) {
                    type = ++listType;
                    if(type===4){
                        type=1;
                    }
                }
                return (
                    <div key={key} style={{'display': 'block', 'padding': '1rem 0', 'paddingLeft': '4rem'}}>{content.content.map(child => {if(child.tag==='li'){pos++;} return this.addNestedContent(child, i++, type, pos, order);})}</div>
                );
            }else if(content.tag === 'li') {
                let val = '';
                let pos;
                switch(listType) {
                    case 1:
                        if(!ordered){val = '\u2022'; break;}
                        val = listPos;
                        break;
                    case 2:
                        if(!ordered){val = '\u25B9'; break;}
                        pos = listPos;
                        let place = 0;
                        let base = 0;
                        pos--;
                        while(pos >= 0){ //figure out how many places in the alpha-number
                            base += Math.pow(26, place);
                            place++;
                            pos -= Math.pow(26, place);
                        }

                        pos = listPos;
                        while(place > 0){ //figure out how many places in the alpha-number
                            place--;
                            base -= Math.pow(26, place);
                            let pos2 = pos - base;
                            let dividend = Math.floor(pos2 / Math.pow(26, place));

                            val = val + String.fromCharCode(dividend+96); //960 offset unicode to start at letter 'a'

                            pos -= Math.pow(26, place)*dividend;
                        }
                        break;
                    case 3:
                        if(!ordered){val = '\u25AB'; break;}
                        pos = listPos;
                        while(pos>=1000){
                            pos=pos-1000;
                            val=val+'m';
                        }
                        if(pos>=100){ // 100 - 999
                            let dividend = Math.floor(pos/100);
                            switch(dividend){
                                case 1:
                                    val=val+'c';
                                    break;
                                case 2:
                                    val=val+'cc';
                                    break;
                                case 3:
                                    val=val+'ccc';
                                    break;
                                case 4:
                                    val=val+'cd';
                                    break;
                                case 5:
                                    val=val+'d';
                                    break;
                                case 6:
                                    val=val+'dc';
                                    break;
                                case 7:
                                    val=val+'dcc';
                                    break;
                                case 8:
                                    val=val+'dccc';
                                    break;
                                default: // 9
                                    val=val+'cm';
                            }
                            pos = pos%100;
                        }
                        if(pos>=10){ // 10 - 99
                            let dividend = Math.floor(pos/10);
                            switch(dividend){
                                case 1:
                                    val=val+'x';
                                    break;
                                case 2:
                                    val=val+'xx';
                                    break;
                                case 3:
                                    val=val+'xxx';
                                    break;
                                case 4:
                                    val=val+'xl';
                                    break;
                                case 5:
                                    val=val+'l';
                                    break;
                                case 6:
                                    val=val+'lx';
                                    break;
                                case 7:
                                    val=val+'lxx';
                                    break;
                                case 8:
                                    val=val+'lxxx';
                                    break;
                                default: // 9
                                    val=val+'xc';
                            }
                            pos = pos%10;
                        }
                        if(pos>=1){ // 1 - 9
                            switch(pos){
                                case 1:
                                    val=val+'i';
                                    break;
                                case 2:
                                    val=val+'ii';
                                    break;
                                case 3:
                                    val=val+'iii';
                                    break;
                                case 4:
                                    val=val+'iv';
                                    break;
                                case 5:
                                    val=val+'v';
                                    break;
                                case 6:
                                    val=val+'vi';
                                    break;
                                case 7:
                                    val=val+'vii';
                                    break;
                                case 8:
                                    val=val+'viii';
                                    break;
                                default: // 9
                                    val=val+'ix';
                            }
                        }
                        break;
                    default:
                        val = '\u2022';
                }
                return (
                    <div key={key} style={{'display': 'block', 'position':'relative'}}>
                        <span style={{'position': 'absolute', left: '-1rem', 'textAlign': 'right', transform: 'translate(-100%,-0%)'}}>{val+(ordered ? '.' : '')}</span>
                        <div>{'\u2060'}{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                    </div>
                );
            }else if(content.tag === 'size') {

                let size = 16;
                if(content.attribute && content.attribute.match(/^[0-9]+$/)) {
                    size = Math.min(72, Math.max(8, parseInt(content.attribute)));
                }

                return (
                    <span key={key} style={{'fontSize': `${size}px`}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 'color') {

                let color = '#000000';
                if(content.attribute && content.attribute.match(/^#[0-9a-fA-F]{6}$/)) {
                    color = content.attribute;
                }

                return (
                    <span key={key} style={{'color': `${color}`}}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.tag === 'url') {

                let url = content.attribute;
                if(!url) {
                    url = content.content[0] || '';
                }
                if(!url.match(/^http[s]?:\/\//i)){
                    url = '//' + (url || '');
                }

                return (
                    <a key={key} href={url} target={"_blank"}>{content.content[0] || ''}</a>
                );
            }else if(content.tag === 'image') {

                let source = content.content[0] || '';
                // if(!content.attribute || !content.attribute.match(/^http[s]?:\/\//i)) {
                //     url = '//' + (content.attribute || '');
                // }

                return (
                    <img key={key} src={source} alt={""} style={{maxWidth: "100%", 'display': 'flex'}}/>
                );
            }else if(content.tag === 'youtube') {

                let source = content.content[0] || '';
                let regex = new RegExp("youtu(be\\.com/watch\\?v=|\\.be/)([a-zA-Z0-9\\-_]+)", "gi");
                let regex2 = new RegExp("[a-zA-Z0-9\\-_]+", "gi");
                let match;
                let tag = '';
                if(match = regex.exec(source)){
                    tag = match[2];
                }else if(match = regex2.exec(source)){
                    tag = match[0];
                }
                // if(!content.attribute || !content.attribute.match(/^http[s]?:\/\//i)) {
                //     url = '//' + (content.attribute || '');
                // }

                return (
                    <iframe key={key} width={'560'} height={'315'} frameBorder={'0'} src={`//www.youtube.com/embed/${tag}/wmode=opaque`} allowFullScreen style={{display: 'flex'}}></iframe>
                );
            }else if(content.tag === 'code') {

                return (
                        <div style={{'margin': '2rem 3rem', 'display':'block', 'overflowX': 'auto'}} key={key} >
                            <div style={{'display':'flex'}} >
                                <Highlight className={content.attribute || ''}>
                                    {content.content[0]}
                                </Highlight>
                            </div>
                        </div>
                        
                    // <div key={key} style={{
                    //                         'whiteSpace': 'pre-wrap',
                    //                         'display': 'block', 
                    //                         'fontFamily': 'monospace', 
                    //                         'backgroundColor': '#DDDDDD',
                    //                         'padding': '10px',
                    //                         'wordWrap':'break-word'}} >{content.content}</div>
                );
            }else {
                return (
                    <div key={key}>{content.content.map(child => {return this.addNestedContent(child, i++);})}</div>
                );
            }
        } else if(content) {
            return (
                <span key={key} style={{'wordWrap':'break-word'}}>{content}</span>
            );
        }
    }

    render() {

        let customStyle = {fontSize: '16px'};
        if(this.props.style) {
            customStyle = this.props.style;
        }

        const content = this.props.content || '';
        // console.log(content)
        //console.log(parse(this.props.content || ''))

        return (
            <div style={customStyle}>
                <div style={{'padding': '10px', 'whiteSpace': 'pre-wrap'}}>
                    {this.addNestedContent(parse(this.props.content || ''))}
                </div>
            </div>
        );

    }
};

export default PostContent;