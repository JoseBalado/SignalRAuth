import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import Chart from './Chart';

const Chat = () => {
    const [ chat, setChat ] = useState("");
    const [ queue, setQueue ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
                const newConnection = new HubConnectionBuilder()
                    .withUrl("/chatHub")
                    .withAutomaticReconnect()
                    .build();

                newConnection.start()
                    .then(result => {
                        console.log('Connected!');
        
                        newConnection.on('ReceiveMessage', (user, message) => {
                            // const updatedChat = [...latestChat.current];
                            // updatedChat = message;

                            // console.log("message " + message);
                        
                            setChat(message);
                        });

                        newConnection.on('SendQueue', (user, message) => {
                            // console.log("Queue " + message);

                            setQueue(message);
                        });
                    })
                    .catch(e => console.log('Connection failed: ', e));
    }, []);

    return (
        <div>
            <hr />
            <ChatWindow chat={chat}/>
            <hr />
            <Chart graph={queue} />
        </div>
    );
};

export default Chat;
