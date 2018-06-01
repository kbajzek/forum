import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import * as actions from '../../../../../store/actions';
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
        this.props.onCreateRating(1, ratingTypeId, this.props.postId, this.props.path); // fix userid eventually
    }

    handleUndoRating = () => {
        this.props.onDeleteRating(1, this.props.postId, this.props.path); // fix userid eventually
    }
    
    render() {

        let hasNotRated = true;

        const ratingButtonList = this.props.ratingTypes.map(({id, name}) => {
            return (
                <button key={id} onClick={() => {this.handleRate(id)}}>
                    {name}
                </button>
            );
        });

        const ratingList = this.props.ratings.map(({ratingName, users}) => {

            let ratingInfo = users.length;

            hasNotRated = hasNotRated && !users.find((user) => {
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
                    {this.props.auth && !hasNotRated && <button onClick={this.handleUndoRating}>UNDO RATING</button>}
                </div>
                <div style={{marginLeft: 'auto'}}>
                    {this.props.auth && hasNotRated && this.props.userId !== this.props.auth && ratingButtonList}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCreateRating: (userId, ratingTypeId, postId, path) => dispatch(actions.createRating(userId, ratingTypeId, postId, path)),
        onDeleteRating: (userId, postId, path) => dispatch(actions.deleteRating(userId, postId, path))
    }
}

export default connect(null, mapDispatchToProps)(Ratings);