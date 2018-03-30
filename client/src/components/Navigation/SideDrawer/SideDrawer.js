import React from 'react';

import classes from './SideDrawer.module.css';
import Backdrop from './Backdrop/Backdrop';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.isOpen) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Auxiliary>
            <Backdrop show={props.isOpen} clicked={props.close}/>
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
                <nav>
                    {props.children}
                </nav>
            </div>
        </Auxiliary>
    );
}

export default sideDrawer;