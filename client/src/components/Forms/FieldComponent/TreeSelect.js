import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

class TreeSelect extends Component {

    
}

const mapStateToProps = state => {
    return {
        userlistData: state.forums.userlistData,
        userlistLoading: state.forums.userlistLoading,
        error: state.forums.error,
        auth: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchUserlistInit: (search) => dispatch(actions.fetchUserlistInit(search))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeSelect);