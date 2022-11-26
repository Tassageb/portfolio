import React from 'react';

class Message extends React.PureComponent{
    delete(){
        fetch("/api/msg/admin/delete/" + this.props.data.id, {method : "DELETE"}).then((res) => {
            if (res.status === 200){
                this.props.refresh();
            }
        })
    }

    setViewed(){
        fetch("/api/msg/admin/setviewed/" + this.props.data.id, {method : "POST"}).then((res) => {
            if (res.status === 200){
                this.props.refresh();
            }
        })
    }

    render(){
        return (
            <tr className={this.props.data.viewed && "viewed"}>
                <td className="date">{this.props.data.time}</td>
                <td className="name">{this.props.data.name}</td>
                <td className="contact">{this.props.data.contact}</td>
                <td className="message">{this.props.data.message}</td>
                <td className="control">
                    <button onClick={this.delete.bind(this)}>Suppr</button>
                    {!this.props.data.viewed && <button onClick={this.setViewed.bind(this)}>Lu</button>}
                </td>
            </tr>
        )
    }
}

export class MessagePanel extends React.PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            error : null,
            pending : false
        }

        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    refresh(){
        this.setState({pending : true})
        fetch("/api/msg/admin/all").then(res => {
            return res.json()
        }).then(
            json => {
                this.setState({
                    messages : json,
                    pending : false
                })

            }
        ).catch((err) => {
            this.setState({
                error : err,
                pending : false
            })
        })
    }

    render(){
        let messages = [];
        if (!this.state.error){
            this.state.messages.forEach((elt, index) => {
                messages.push(<Message key={index} data={elt} refresh={this.refresh}/>)
            });
        }

        return (<div className={'msgPanel panel' + (this.state.pending ? " pending" : "")}>
            <div className={"head"}>
                <h2>Messages</h2>
                <button onClick={this.refresh}>Actualiser</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="date">Date</th>
                        <th className="name">Nom</th>
                        <th className="contact">Adresse</th>
                        <th className="message">Message</th>
                        <th className="control"></th>
                    </tr>
                </thead>
                <tbody>
                    {messages}
                </tbody>
            </table>
            {this.state.error ? <h3>Erreur : Actualiser la page</h3> : (this.state.messages.length === 0 && <h3>Rien à déclarer</h3>)}
        </div>)
    }
}