import React, {useState, useEffect, Component} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Input from "react-validation/build/input";
import ReportService from "../api/ReportService";
const ENDPOINT = "http://localhost:8080/ws";

let stompClient = null;

class ReportUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                from: '',
                text: '',
                date: ''
            },
            user: JSON.parse(localStorage.getItem("user")),
        };
        this.setConnected = this.setConnected.bind(this);
    }

    setConnected(connected) {

        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
    }

    connect() {
        const {item} = this.state;
        let socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {

            document.getElementById('connect').disabled = true;
            document.getElementById('disconnect').disabled = false;
            document.getElementById('conversationDiv').style.visibility = true ? 'visible' : 'hidden';
            document.getElementById('response').innerHTML = '';            console.log('Connected: ' + frame);

            stompClient.subscribe('/topic/messages', function (messageOutput) {
                console.log(JSON.parse(messageOutput.body))
                ReportService.save(JSON.parse(messageOutput.body));
            });
        });
    }

    disconnect() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        document.getElementById('connect').disabled = false;
        document.getElementById('disconnect').disabled = true;
        document.getElementById('conversationDiv').style.visibility
            = false ? 'visible' : 'hidden';
        document.getElementById('response').innerHTML = '';
        console.log("Disconnected");
    }

    sendMessage() {
        let from = document.getElementById('from').value;
        let text = document.getElementById('text').value;
        stompClient.send("/app/chat", {},
            JSON.stringify({'from': from, 'text': text}));
    }

    // display the received data
    onMessageReceived(data) {
        const result = JSON.parse(data.body);
        alert(result.content)
    };

    render() {
        return (
            <div onLoad={() => this.disconnect()} className="content">
                <div>
                    <input type="text" id="from" placeholder="Choose a nickname"/>
                </div>
                <br/>
                <div>
                    <button className="btn btn-primary btn-block" id="connect" onClick={() => this.connect()}>Connect</button>
                    <button className="btn btn-secondary btn-block" id="disconnect" disabled="disabled" onClick={() => this.disconnect()}>
                        Disconnect
                    </button>
                </div>
                <br/>
                <div id="conversationDiv">
                    <input type="text" id="text" placeholder="Write a message..."/>
                    <button className="btn btn-primary btn-block" id="sendMessage" onClick={() => this.sendMessage()}>Send</button>
                    <p id="response"></p>
                </div>
            </div>
        );
    }
}

export default ReportUsers;