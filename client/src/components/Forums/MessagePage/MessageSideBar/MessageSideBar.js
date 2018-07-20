import React, {Component} from 'react';

import classes from './MessageSideBar.module.css';

class MessageSideBar extends Component{
    render(){

        const messageList = this.props.messageData.headers.map(({id, name}) => {
            return (
                <div key={id} className={classes.message}>
                    <div style={{display: 'flex', padding: '2rem'}} onClick={() => this.props.onSelectMessage(id, name)}>
                        {name}
                    </div>
                </div>
            );
        });

        return(
            <div style={{flexBasis: '25%', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid rgba(230,230,230,255)'}}>
                <div style={{height: '10%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(230,230,230,255)'}}>
                    <div style={{fontSize: '3rem'}}>
                        Messages
                    </div>
                </div>
                <div style={{height: '90%', overflowY: 'auto'}}>
                    {messageList}
                </div>
            </div>
        )
    }
}

export default MessageSideBar;