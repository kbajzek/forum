import React from 'react';

import classes from './SideDrawer.module.css';
import Backdrop from './Backdrop/Backdrop';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.isOpen) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <>
            <Backdrop show={props.isOpen} clicked={props.close}/>
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
                <nav>
                    {props.children}
                </nav>
            </div>
        </>
    );
}

export default sideDrawer;