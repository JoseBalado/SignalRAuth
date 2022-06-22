import React from 'react';

const ChatWindow = (props) => {
    // console.log(props)

    return(
        <div>
            CPU Percentage Usage: {props.chat}
        </div>
    )
};

export default ChatWindow;