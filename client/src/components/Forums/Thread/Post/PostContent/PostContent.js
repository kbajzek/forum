import React, {Component} from 'react';
import htmlParser from 'htmlparser2';
import parser from './parsetest';





class PostContent extends Component {

    state = {
        content: null,
        raw: null
    }

    addNestedContent = (content, key) => {
        let i = 0;
        if(content.length) {
            return (
                <span key={key}>{content.map(child => {return this.addNestedContent(child, i++);})}</span>
            );
        }
        if(content.type === 'tag') {
            if(content.name === 'span' && content.attribs && content.attribs.class === 'b') {
                return (
                    <span key={key} style={{'fontWeight': 'bold'}}>{content.children.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }else if(content.name === 'span' && content.attribs && content.attribs.class === 'i') {
                return (
                    <span key={key} style={{'fontStyle': 'italic'}}>{content.children.map(child => {return this.addNestedContent(child, i++);})}</span>
                );
            }
        } else if(content.type === "text") {
            let data = content.data;
            data = data.replace(/&lt;/g, "<");
            data = data.replace(/&gt;/g, ">");
            return (
                <span key={key}>{data}</span>
            );
        }
    }

    componentDidMount() {
        const result = parser.process({
            text: this.props.content || '',
            removeMisalignedTags: false,
            addInLineBreaks: false
        });

        const handler = new htmlParser.DomHandler((error, dom) => {
            if (error) {
                this.setState({content: "error occurred"});
            } else {
                this.setState({content: this.addNestedContent(dom, 0), raw: result.html});     
            }
        });
        const htmlParserInstance = new htmlParser.Parser(handler);
        htmlParserInstance.write(result.html);
        htmlParserInstance.end();
    }

    componentDidUpdate() {
        const result = parser.process({
            text: this.props.content || '',
            removeMisalignedTags: false,
            addInLineBreaks: false
        });

        const handler = new htmlParser.DomHandler((error, dom) => {
            if (error) {
                this.setState({content: "error occurred"});
            } else {
                this.setState({content: this.addNestedContent(dom, 0)});
                this.setState({content: this.addNestedContent(dom, 0), raw: result.html, final: false});     
            }
        });
        const htmlParserInstance = new htmlParser.Parser(handler);
        htmlParserInstance.write(result.html);
        htmlParserInstance.end();
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.raw !== nextState.raw || this.props.content !== nextProps.content) {
          return true;
        }
    
        // No state update necessary
        return false;
    }

    render() {

        return (
            <div style={{fontSize: '16px'}}>
                <div>
                    {this.state.content}
                </div>
                <div>
                    {this.state.raw}
                </div>
                <div>
                    {this.props.content}
                </div>
            </div>
        );

    }
};

export default PostContent;