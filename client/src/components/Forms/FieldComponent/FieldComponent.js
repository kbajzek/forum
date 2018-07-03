import React from 'react';

const FieldComponent = ({ input, label, meta: { error, touched } }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '5px' }} autoComplete="off" autoCorrect="off" spellCheck="off"/>
            <div style={{ color: 'red', fontSize: '16px' }}>
                {touched && error}
            </div>
        </div>
    );
}

export default FieldComponent;