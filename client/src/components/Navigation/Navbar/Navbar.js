import React from 'react';

import classes from './Navbar.module.css';
import DrawerToggle from './DrawerToggle/DrawerToggle';

const navbar = ( props ) => {

    const style = [classes.DesktopOnly, classes.NavItems].join(' ');

    let authButton = <a href={'/auth/steam'}>LOGIN</a>;

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

export default navbar;