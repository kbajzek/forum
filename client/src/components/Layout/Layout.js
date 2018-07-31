import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Navbar from '../../components/Navigation/Navbar/Navbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import NavigationItem from '../Navigation/Navbar/NavigationItem/NavigationItem';
import Spinner from '../UI/Spinner/Spinner';

import * as actions from '../../store/actions';
import * as categoryActions from '../../store/ducks/category';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    onForumNavClicked = () => {
        if(this.props.location.pathname === "/forums"){
            this.props.onInitCategoryData();
        }
    }

    onForumMessageClicked = () => {
        this.props.onInitMessageData("/message");
        this.props.setMessageSidebarState(1);
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    handleLogout = () => {
        this.props.onLogout();
    }

    render () {
    
        const navItems = (
            <Auxiliary>
                <NavigationItem
                    clicked={() => {
                        this.sideDrawerClosedHandler(); 
                        this.onForumNavClicked();
                    }} 
                    link="/forums" 
                    exact>
                    Forums
                </NavigationItem>
                {this.props.user ? <NavigationItem
                    clicked={() => {
                        this.sideDrawerClosedHandler();
                        this.onForumMessageClicked();
                    }} 
                    link="/forums/message" 
                    exact>
                    Messages
                </NavigationItem> : null}
                <NavigationItem 
                    clicked={() => {this.sideDrawerClosedHandler(); }}
                    link="https://steamcommunity.com/groups/ExoTerraGaming" 
                    anchor>
                    Steam
                </NavigationItem>
            </Auxiliary>
        );

        let loading;
        let loadClass = classes.Loaded;
        if(this.props.categoryData.loading || this.props.subCategoryData.loading || this.props.threadData.loading){
            loading = (
                <div style={{position: 'fixed', top: '.5rem', right: '.5rem', width: '4rem', height: '4rem', zIndex: 1000}}>
                    <Spinner />
                </div>
            );
            //loadClass = classes.Loading;
        }

        return (
            <Auxiliary>
                <Navbar
                    auth={this.props.user}
                    logout={this.handleLogout}
                    drawerToggleClicked={this.sideDrawerToggleHandler}>
                    {navItems}
                </Navbar>
                <SideDrawer
                    isOpen={this.state.showSideDrawer}
                    close={this.sideDrawerClosedHandler} >
                    {navItems}
                </SideDrawer>
                <main className={loadClass}>
                    {this.props.children}
                </main>
                {loading}
            </Auxiliary>
        )
    }
}

const mapStateToProps = state => {
    return { 
        user: state.auth.user,
        categoryData: state.category,
        subCategoryData: state.subCategory,
        threadData: state.thread,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitCategoryData: () => dispatch(categoryActions.fetchCategoryDataBegin()),
        onInitMessageData: (path) => dispatch(actions.initMessageData(path)),
        setMessageSidebarState: (state) => dispatch(actions.setMessageSidebarState(state)),
        onLogout: () => dispatch(actions.logoutUserInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));