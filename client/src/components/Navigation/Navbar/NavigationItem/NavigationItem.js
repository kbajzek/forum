import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = ( props ) => {

    let link = (
        <NavLink 
            to={props.link}
            exact={props.exact}
            activeClassName={classes.active}
            onClick={props.clicked}>
            {props.children}
        </NavLink>
    );
    if (props.anchor) {
        link = (
            <a  
                target="_blank"
                rel="noopener noreferrer"
                href={props.link}>{props.children}</a>
        );
    }

    return (
        <li className={classes.NavigationItem}>
            {link}
        </li>
    );
};

export default navigationItem;