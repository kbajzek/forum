import React from 'react';

import classes from './Spinner2.module.css';

const spinner = () => (
    <div className={classes.skfadingcircle}>
        <div className={[classes.skcircle1, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle2, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle3, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle4, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle5, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle6, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle7, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle8, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle9, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle10, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle11, classes.skcircle].join(" ")}></div>
        <div className={[classes.skcircle12, classes.skcircle].join(" ")}></div>
    </div>
);

export default spinner;