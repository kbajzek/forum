import React, {Component} from 'react';

// import Spinner from '../../../UI/Spinner/Spinner';

import classes from './MessageSideBar.module.css';

class MessageSideBar extends Component{

    removeMember = (memberId) => {
        this.props.removeMessageMember(memberId);
    }

    render(){

        const messageList = this.props.messageData.messageList.map(({id, name}) => {
            return (
                <div key={id} className={classes.message}>
                    <div style={{display: 'flex', padding: '2rem', fontSize: '1.5rem'}} onClick={() => this.props.onSelectMessage(id, name)}>
                        {name}
                    </div>
                </div>
            );
        });

        // let memberList = <Spinner />;
        let memberList = <div></div>;
        
        if(this.props.messageData.messageSelected){
            memberList = this.props.messageData.messageSelected.members.map(({userId, userName, permission, id}) => {
                let userControls = null;
                if(this.props.messageData.messageSelected.messagePerm === 2 && permission !== 2){
                    userControls = (
                        <div>
                            <button className={classes.DeleteButton} onClick={() => this.removeMember(id)}>X</button>
                        </div>
                    )
                }
                return (
                    <div key={userId} className={classes.message}>
                        <div style={{display: 'flex', padding: '2rem', fontSize: '1.5rem', alignItems: 'center'}} >
                            {userName}
                            {userControls}
                        </div>
                    </div>
                );
            });
        }

        let sideBarMain = (
            <div style={{height: 'calc(100% - 4rem)'}}>
                <div style={{height: '5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(230,230,230,255)'}}>
                    <div style={{fontSize: '3rem'}}>
                        Messages
                    </div>
                </div>
                <div style={{height: 'calc(100% - 5rem)', overflowY: 'auto'}}>
                    {messageList}
                </div>
            </div>
        );

        if(this.props.sideBarState === 2){
            sideBarMain = (
                <div style={{height: 'calc(100% - 4rem)'}}>
                    <div style={{height: '5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(230,230,230,255)'}}>
                        <div style={{fontSize: '3rem'}}>
                            Members
                        </div>
                    </div>
                    <div style={{height: 'calc(100% - 5rem)', overflowY: 'auto'}}>
                        {memberList}
                    </div>
                </div>
                // <div style={{height: '95%'}}>
                //     <div style={{height: '50%'}}>
                //         <div style={{height: '20%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(230,230,230,255)'}}>
                //             <div style={{fontSize: '3rem'}}>
                //                 Messages
                //             </div>
                //         </div>
                //         <div style={{height: '80%', overflowY: 'auto'}}>
                //             {messageList}
                //         </div>
                //     </div>
                //     <div style={{height: '50%'}}>
                //         <div style={{height: '20%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(230,230,230,255)'}}>
                //             <div style={{fontSize: '3rem'}}>
                //                 Members
                //             </div>
                //         </div>
                //         <div style={{height: '80%', overflowY: 'auto'}}>
                //             {memberList}
                //         </div>
                //     </div>
                // </div>
            );
        }

        return(
            <div className={!this.props.messageId ? classes.SideBar : (this.props.showSidebar ? classes.SideBar : classes.SideBarClosed)}>
                {sideBarMain}
                <div className={classes.bottomButtons}>
                    <button className={classes.Button} onClick={this.props.messageButtonClick}>Messages</button>
                    <button className={classes.Button} onClick={this.props.membersButtonClick}>Members</button>
                </div>
            </div>
        )
    }
}

export default MessageSideBar;