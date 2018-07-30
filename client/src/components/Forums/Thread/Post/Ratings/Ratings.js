import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import * as threadActions from '../../../../../store/ducks/thread';
//import classes from './Ratings.module.css';

class Ratings extends Component {

    state = {
        expanded: false
    }

    toggleExpand = () => {
        this.setState((prevState) => {
            return {expanded: !prevState.expanded};
        })
    }

    handleRate = (ratingTypeId) => {
        this.props.onCreateRating(ratingTypeId, this.props.postId); // fix userid eventually
    }

    handleUndoRating = (ratingId) => {
        this.props.onDeleteRating(ratingId); // fix userid eventually
    }
    
    render() {

        let ratingUser;

        const ratingButtonList = this.props.ratingTypes.map(({id, name}) => {
            return (
                <button key={id} onClick={() => {this.handleRate(id)}}>
                    {name}
                </button>
            );
        });

        const ratingList = this.props.ratings.map(({ratingName, users}) => {

            let ratingInfo = users.length;

            ratingUser = ratingUser || users.find((user) => {
                return user.userId === this.props.auth;
            });

            if (this.state.expanded) {

                const userList = users.map((user) => {
                    return (
                        <div key={user.ratingId}>
                            <Link
                                to={{
                                    pathname: "/forums" + user.path
                                }}>
                                {user.userName}
                            </Link>
                            
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
                <div>
                    {this.props.ratings.length > 0 && <button onClick={this.toggleExpand}>TOGGLE EXPAND</button>}
                </div>
                <div>
                    {this.props.auth && ratingUser && <button onClick={() => this.handleUndoRating(ratingUser.ratingId)}>UNDO RATING</button>}
                </div>
                <div style={{marginLeft: 'auto'}}>
                    {this.props.auth && !ratingUser && this.props.userId !== this.props.auth && ratingButtonList}
                </div>
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