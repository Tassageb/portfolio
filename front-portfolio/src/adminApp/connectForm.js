import React from 'react';

export class ConnectForm extends React.PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            userName : "",
            pswd : "",
            message : "",
            msgTimer : null
        }

        this.handleChange = this.handleChange.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
    }

    handleChange(e){
        let newState = {};
        switch (e.target.id){
            case 'userName' :
                newState.userName = e.target.value;
                break;
            case 'pswd' :
                newState.pswd = e.target.value;
                break;
            default :
                break;
        }
        this.setState(newState);
    }

    sendMsg(msg){
        if (this.state.msgTimer){
            clearTimeout(this.state.msgTimer);
        }

        let timer = setTimeout(() => {
            this.setState({
                message : "",
                msgTimer : null
            })
        }, 4000);

        this.setState({
            message : msg,
            msgTimer : timer
        })
    }

    render() {
        return (
            <div className='connect-form'>
                <span>
                    <input type='text' value={this.state.userName} id='userName' onChange={this.handleChange}/>
                    <label htmlFor="userName">Login</label>
                </span>
                <span>
                    <input type='password' value={this.state.pswd} id='pswd' onChange={this.handleChange}/>
                    <label htmlFor="pswd">Mot de passe</label>
                </span>
                {this.state.message !== "" && <span>
                    <p>{this.state.message}</p>
                </span>}
                <button onClick={() => {this.props.connectCallBack(this.state.userName, this.state.pswd, this.sendMsg)}}>Submit</button>
            </div>
        )
    }
}