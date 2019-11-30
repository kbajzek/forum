import React from 'react';

import classes from './Navbar.module.css';
import DrawerToggle from './DrawerToggle/DrawerToggle';
import GoogleButton from 'react-google-button';
import {withRouter} from 'react-router-dom';

const navbar = ( props ) => {

    const style = [classes.DesktopOnly, classes.NavItems].join(' ');

    // let authButton = <a href={'/auth/steam'}>LOGIN</a>;

    let authButton = <GoogleButton
        type="dark"
        onClick={() => { 
            props.history.push('/auth/google'); 
            window.location.reload();
        }}
    />;

    if (props.auth) {
        authButton = <button onClick={props.logout}>LOGOUT</button>
    }

    return (
        <header className={classes.Navbar}>
            <DrawerToggle clicked={props.drawerToggleClicked} />
            {/* <div className={classes.Logo}>
                <Logo />
            </div> */}
            <nav className={style}>
                {props.children}
            </nav>
            <div style={{marginLeft: 'auto'}}>
                {authButton}
            </div>
        </header>
    );
}

export default withRouter(navbar);