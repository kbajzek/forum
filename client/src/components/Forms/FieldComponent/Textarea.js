import React from 'react';

const FieldComponent = ({ input, label, meta: { error, touched } }) => {
    return (
        <div>
            <label>{label}</label>
            <textarea {...input} style={{ marginBottom: '5px' }} />
            <div style={{ marginBottom: '20px', color: 'red' }}>
                {touched && error}
            </div>
        </div>
    );
}

export default FieldComponent;