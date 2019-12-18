import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import * as threadActions from '../../../../../store/ducks/thread';
import * as classes from './Ratings.module.css';

class Ratings extends Component {

    state = {
        expanded: false,
        ratingsOpen: false,
    }

    toggleExpand = () => {
        this.setState((prevState) => {
            return {expanded: !prevState.expanded};
        })
    }

    handleUndoRating = (ratingId) => {
        this.props.onDeleteRating(ratingId); // fix userid eventually
    }

    handleRate = (ratingTypeId) => {
        this.props.onCreateRating(ratingTypeId, this.props.postId); // fix userid eventually
        this.handleCloseRatings();
    }

    handleOpenRatings = () => {
        this.setState({ratingsOpen: true});
    }

    handleCloseRatings = () => {
        this.setState({ratingsOpen: false});
    }
    
    render() {

        let ratingUser;
        let ratingDialog;

        if(this.state.ratingsOpen){
            ratingDialog = <div onClick={this.handleCloseRatings} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: '500', backgroundColor: 'rgba(0,0,0,.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{display: 'flex'}}>
                        {this.props.ratingTypes.map(({id, name}) => {
                            return (
                                <button className={classes.Button3} key={id} onClick={() => {this.handleRate(id)}}>
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                    <button style={{color: '#fff', backgroundColor: '#DB2929', margin: '.5rem', border: 'none', padding: '.5rem', borderRadius: '3px', cursor: 'pointer', marginLeft: 'auto'}} onClick={this.handleCloseRatings}>CANCEL</button>
                </div>
            </div>;
        }

        const ratingButtonList = this.props.ratingTypes.map(({id, name}) => {
            return (
                <button className={classes.Button3} key={id} onClick={() => {this.handleRate(id)}}>
                    {name}
                </button>
            );
        });

        const ratingButtonList2 = 
                <button className={classes.Button3} onClick={this.handleOpenRatings}>
                    {'Rate'}
                </button>;

        const ratingList = this.props.ratings.map(({ratingName, users}) => {

            let ratingInfo = users.length;

            ratingUser = ratingUser || users.find((user) => {
                return user.userId === this.props.auth;
            });

            if (this.state.expanded) {

                const userList = users.map((user) => {
                    return (
                        <div key={user.ratingId}>
                            {/* <Link
                                to={{
                                    pathname: "/forums" + user.path
                                }}> */}
                                {user.userName}
                            {/* </Link> */}
                            
                        </div>
                    );
                })

                ratingInfo = (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {userList}
                    </div>
                );
            }

            return (
                <div style={{display: 'flex', padding: '0 .5rem', flexDirection: 'column', alignItems: 'center'}} key={ratingName}>
                    <div style={{fontSize: '1.5rem', paddingBottom: '2px'}}>{ratingName}</div>
                    <div style={{fontSize: '1.5rem'}}>
                        {ratingInfo}
                    </div>
                </div>
            );
        })
        
        return (
            <div style={{display: 'flex', padding: '.5rem 0', alignItems: 'flexStart'}}>
                {ratingList}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {this.props.ratings.length > 0 && <button className={classes.Button} onClick={this.toggleExpand}>{this.state.expanded ? '▲' : '▼'}</button>}
                </div>
                <div>
                    {this.props.auth && ratingUser && <button className={classes.Button2} onClick={() => this.handleUndoRating(ratingUser.ratingId)}>UNDO</button>}
                </div>
                <div className={classes.ratingList1} style={{marginLeft: 'auto'}}>
                    {this.props.auth && !ratingUser && this.props.userId !== this.props.auth && ratingButtonList}
                </div>
                <div className={classes.ratingList2} style={{marginLeft: 'auto'}}>
                    {this.props.auth && !ratingUser && this.props.userId !== this.props.auth && ratingButtonList2}
                </div>
                {ratingDialog}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCreateRating: (ratingTypeId, postId) => dispatch(threadActions.createRatingBegin(ratingTypeId, postId)),
        onDeleteRating: (ratingId) => dispatch(threadActions.deleteRatingBegin(ratingId))
    }
}

export default connect(null, mapDispatchToProps)(Ratings);