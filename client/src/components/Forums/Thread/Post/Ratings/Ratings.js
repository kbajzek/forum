import React from 'react';

import classes from './Ratings.module.css';

const Ratings = ({ratings}) => {
    
    const ratingList = ratings.map(({ratingName, users}) => {

        return (
            <div className={classes.Rating}>
                <div>{ratingName}</div>
                <div className={classes.RatingCount}>{users.length}</div>
            </div>
        );
    })
    
    return (
        <div className={classes.Ratings}>
            {ratingList}
        </div>
    );
    
}

export default Ratings;