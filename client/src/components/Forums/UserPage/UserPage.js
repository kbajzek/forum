import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

import PostContent from '../Thread/Post/PostContent/PostContent'
import Spinner from '../../UI/Spinner/Spinner';
import ErrorPage from '../ErrorPage/ErrorPage';

class UserPage extends Component {
    
    componentDidMount() {
        this.props.onInitUserData("/user/" + this.props.id + "/" + this.props.slug);
    }
    
    render() {

        let userpage = this.props.error ? <ErrorPage error = {this.props.error}/> : <Spinner />;

        if (this.props.userData) {

            const postList = this.props.userData.posts.map(({id, content, createdAt, threadName, path}) => {
                return (
                    <div key={id}>
                        <div style={{display: 'flex', margin: '5rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, .2)'}}>
                            <PostContent content={content} />
                        </div>
                    </div>
                );
            });

            userpage = (
                <div>
                    <div style={{fontSize: '3rem', margin: '4rem'}}>
                        {this.props.userData.userName}
                    </div>
                    <div>
                        {postList}
                    </div>
                </div>
            );
        }

        return (
            <div>
                {userpage}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userData: state.forums.userData,
        error: state.forums.error,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitUserData: (path) => dispatch(actions.initUserData(path))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPage));