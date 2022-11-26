import React from 'react';

import {ConnectForm} from './connectForm.js';
import {MessagePanel} from "./messagePanel.js";
import {WorksPanel} from "./worksPanel";

import './style.scss';


export class AdminApp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            connected : false,
            pending : false
        }

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }

    componentDidMount() {
        fetch("/api/admin").then(res => {
            if (res.status === 200){
                console.log("Connnected");
                this.setState({
                    connected : true
                })
            } else {
                console.log("Not Connected");
                this.setState({
                    connected : false
                })
            }
        })
    }

    connect(userName, pswd, callback){
        fetch("/api/login/", {
            method : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                userName : userName,
                pswd : pswd
            })
        }).then(res  => {
            if (res.status === 200){
                this.setState({
                    connected : true
                })
            }
            return res.text()
        }).then(body => {callback(body)});
    }

    disconnect(){
        fetch("/api/login/", {
            method : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                disconnect : true
            })
        }).then(res  => {
            if (res.status === 200){
                this.setState({
                    connected : false
                })
            }
            return res.text()
        }).then(body => {console.log(body)});
    }

    render(){
        return  (<div className='admin'>
            <header>
                <h1>Admin Interface</h1>
                {this.state.connected && <button onClick={this.disconnect}>Disconnect</button>}
            </header>
            {   !this.state.connected ?
                <ConnectForm connectCallBack={this.connect}/>
                :
                <div className='page'>
                    <MessagePanel/>
                    <WorksPanel/>
                </div>
            }
        </div>)
    }
}