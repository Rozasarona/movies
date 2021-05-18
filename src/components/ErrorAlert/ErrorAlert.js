import React from 'react';
import { Alert } from 'antd';

function ErrorAlert({ message, description, visible }) {
    return (<>
        {visible && (<Alert
            message={message}
            description={description}
            type="error"
            showIcon
            closable
        />)}
    </>);
}

export default ErrorAlert;