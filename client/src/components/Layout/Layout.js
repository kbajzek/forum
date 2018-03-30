import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Navbar from '../../components/Navigation/Navbar/Navbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import NavigationItem from '../Navigation/Navbar/NavigationItem/NavigationItem';

import * as actions from '../../store/actions';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    onForumNavClicked = () => {
        this.props.onInitCategoryData();
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
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
                <NavigationItem 
                    clicked={() => {this.sideDrawerClosedHandler(); }}
                    link="https://steamcommunity.com/groups/ExoTerraGaming" 
                    anchor>
                    Steam
                </NavigationItem>
            </Auxiliary>
        );

        return (
            <Auxiliary>
                <Navbar
                    drawerToggleClicked={this.sideDrawerToggleHandler}>
                    {navItems}
                </Navbar>
                <SideDrawer
                    isOpen={this.state.showSideDrawer}
                    close={this.sideDrawerClosedHandler} >
                    {navItems}
                </SideDrawer>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitCategoryData: () => dispatch(actions.initCategoryData())
    }
}

export default connect(null, mapDispatchToProps)(Layout);