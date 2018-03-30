import React from 'react';

import classes from './Navbar.module.css';
import DrawerToggle from './DrawerToggle/DrawerToggle';

const navbar = ( props ) => {

    const style = [classes.DesktopOnly, classes.NavItems].join(' ');

    return (
        <header className={classes.Navbar}>
            <DrawerToggle clicked={props.drawerToggleClicked} />
            {/* <div className={classes.Logo}>
                <Logo />
            </div> */}
            <nav className={style}>
                {props.children}
            </nav>
        </header>
    );
}

export default navbar;