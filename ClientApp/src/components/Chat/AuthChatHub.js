import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import authService from '../api-authorization/AuthorizeService'

import ChatWindow from './ChatWindow/ChatWindow';
import Chart from './Chart';

const AuthChatHub = () => {
    const [ chat, setChat ] = useState("");
    const [ queue, setQueue ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        authService.getAccessToken()
            .then(token => {

                const newConnection = new HubConnectionBuilder()
                    .withUrl("https://192.168.1.33:7268/AuthChatHub", { accessTokenFactory: () => token})
                    .withAutomaticReconnect()
                    .build();
                    return newConnection;
            })
            .then(newConnection => {
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

            })
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

export default AuthChatHub;
