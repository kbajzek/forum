import React from 'react';

const ErrorPage = (props) => {
    return(
        <div>
            <div>Error</div>
            <div>{props.error.error}</div>
        </div>
    );
};

export default ErrorPage;