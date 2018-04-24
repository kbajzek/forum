import React, {Component} from 'react';
import peg from 'pegjs';

const parse = (text) => {
    const tagStack = [];
    const tagNameStack = [];
    const positionStack = [];

    let tempTagStack = [];
    let tempTagNameStack = [];
    let tempPositionStack = [];

    let finalStructure = {};

    const tags = ['b','i','u','left','right','center','justify'];

    const tag = new RegExp("\\[([/])?(" + tags.join("|") + ")([=][^\\]]*?)?\\]", "gi");
    const tag2 = new RegExp("\\[(" + tags.join("|") + ")([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]", "gi");

    text = text.replace(/</g, "&lt;"); // escape HTML tag brackets
    text = text.replace(/>/g, "&gt;"); // escape HTML tag brackets
    text = text.replace(/[ ]+\n/g, '\n'); // replace spaces with no break spaces
    text = text.replace(/[ ]+$/g, ''); // replace spaces with no break spaces
    text = text.replace(/  /g, '\xa0 '); // replace spaces with no break spaces
    text = text.replace(/  /g, ' \xa0'); // replace spaces with no break spaces

    text = text.replace(tag, function(matched, isClosing, tagName, tagParams) {
        const params = tagParams || ''; // So we don't append 'undefined' to the replacement
        const closing = isClosing || ''; // So we don't append 'undefined' to the replacement
        return "<" + closing + tagName + params + ">";
    });

    text = text.replace(/\[/g, "&bad1;"); // escape ['s that aren't apart of tags
    text = text.replace(/\]/g, "&bad2;"); // escape ['s that aren't apart of tags
    text = text.replace(/</g, "["); // escape ['s that aren't apart of tags
    text = text.replace(/>/g, "]"); // escape ['s that aren't apart of tags

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

        } else {
            tagStack.push("<" + tagName + params + ">");
            tagNameStack.push(tagName);
            const newString = "<" + tagName + params + ">";
            text = text.substr(0, tag.lastIndex-newString.length) + newString + text.substr(tag.lastIndex );
            positionStack.push(tag.lastIndex);
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
    (Element / "\\n" / Text)*

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

    Text    = chars:[^[\\n]+  { 
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

    addNestedContent = (content, key) => {
        let i = 0;
        if(Array.isArray(content)) {
            // console.log(content)
            return (
                <span key={key}>{content.map(child => {return this.addNestedContent(child, i++);})}</span>
            );
        }
        if(content.tag) {
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
            }
        } else if(content==='\n') {
            return (
                <br key={key} />
            );
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
                <div>
                    {this.addNestedContent(parse(this.props.content || ''))}
                </div>
            </div>
        );

    }
};

export default PostContent;