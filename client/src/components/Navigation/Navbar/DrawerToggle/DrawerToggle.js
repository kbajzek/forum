import React from 'react';

import classes from './DrawerToggle.module.css';

const drawerToggle = (props) => (
    <div className={classes.DrawerToggleMain} onClick={props.clicked}>
        <div className={classes.Line}></div>
        <div className={classes.Line}></div>
        <div className={classes.Line}></div>
    </div>
);

export default drawerToggle;