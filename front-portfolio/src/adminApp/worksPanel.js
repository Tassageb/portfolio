import React from 'react';

class WorkImageManager extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            file : undefined,
            error : undefined,
            pending : false
        }

        this.handleFile = this.handleFile.bind(this);
        this.send = this.send.bind(this);
    }

    handleFile(e){
        this.setState({
            file : e.target.files[0]
        })
    }

    send(){
        if (this.state.file){
            let data = new FormData();
            data.append("image", this.state.file);
            this.setState({
                pending : true
            })
            fetch("/api/works/admin/image/upload/" + this.props.work.id, {method : "POST", body : data}).then( res => {
                if (res.status === 200) {
                    this.props.finish()
                } else {
                    this.setState({
                        pending : false,
                        error : res.status
                    })
                }
            }).catch( error => {
                this.setState({
                    pending : true,
                    error : error.message
                })
            })
        } else {
            this.setState({
                error : "Il n'y a pas de fichier"
            })
        }
    }

    delete(id){
        console.log(id);
        this.setState({
            pending : true
        })
        fetch("/api/works/admin/image/delete/" + id, {
            method : "DELETE"
        }).then(res => {
            if (res.status === 200){
                this.setState({
                    pending : false
                })
                this.props.finish()
            } else {
                this.setState({
                    pending : false,
                    error : res.status
                })
            }
        }).catch( error => {
            this.setState({
                pending : true,
                error : error.message
            })
        })
    }

    render(){
        let img = [];
        this.props.work.images.forEach((elt, index) => {
            img.push(<div>
                <img alt={elt + index} src={"/api/works/image/" + elt}/>
                {!this.state.pending ? <button onClick={() => {this.delete(elt)}}>Supprimer</button> : ""}
            </div>)
        })
        return (
            <div className={"manager"}>
                <div className={"images"}>
                    {img}
                </div>
                {this.state.pending ? "Envoi en cours" :
                <div className={"new"}>
                    <button onClick={this.send}>Envoyer</button>
                    <input type={"file"} onChange={this.handleFile}/>
                </div>}
                {this.state.pending ? "" : <button onClick={this.props.cancel}>Annuler</button>}
                {this.state.error ? <p>{this.state.error}</p> : ""}
            </div>
        )
    }
}

class WorkLine extends React.Component{
    constructor(props) {
        super(props);
        if (this.props.data){
            this.state = {
                link : this.props.data.link,
                desc : this.props.data.description,
                video : this.props.data.video_path,
                show : this.props.data.visible,
                modified : this.props.data.new,
                fav : this.props.data.fav,
                manager : false,
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.show_manager = this.show_manager.bind(this);
        this.delete = this.delete.bind(this);
    }

    save(){
        let info = { id : this.props.data.id, description : this.state.desc, link : this.state.link, visible : this.state.show, video_path : this.state.video, fav : this.state.fav};
        console.log(info);
        fetch("/api/works/admin/update", {method : "PUT", headers : {"Content-Type" : "application/json"}, body : JSON.stringify(info)}).then((res) => {
            if (res.status === 200){
                this.props.refresh();
            }
        });
    }

    delete(){
        if (window.confirm("Supprimer?")){
            fetch("/api/works/admin/delete/"+this.props.data.id, {
                method : "DELETE"
            }).then(res => {
                if (res.status === 200){
                    this.props.refresh();
                } else {
                    console.log(res.status);
                }
            })
        }
    }

    handleChange(e){
        e.preventDefault();
        let newState = { modified : true};
        switch (e.target.id){
            case 'desc' :
                newState.desc = e.target.value;
                break;
            case 'link' :
                newState.link = e.target.value;
                break;
            case 'show' :
                newState.show = !this.state.show;
                break;
            case 'fav' :
                newState.fav = !this.state.fav;
                break;
            case 'video' :
                newState.video = e.target.value;
                break;
            default :
                break;
        }
        this.setState(newState);
    }

    show_manager(){
        this.setState({
            manager : !this.state.manager
        })
    }

    render(){
        let img = [];
        this.props.data.images.forEach((elt, index) => {
            img.push(<img alt={"Image " + index + this.props.data.name} key={index} src={"/api/works/image/" + elt}/>);
        })
        return (
            <tr>
                <td  className="name">{this.props.data.name}</td>
                <td  className="desc"><textarea id="desc" value = {this.state.desc ? this.state.desc : ""} onChange={this.handleChange} /></td>
                <td  className="link"><textarea id="link" value = {this.state.link ? this.state.link : ""} onChange={this.handleChange} /></td>
                <td  className="video"><textarea id="video" value = {this.state.video ? this.state.video : ""} onChange={this.handleChange} /></td>
                <td  className="show"><input id="show" type="checkbox" checked={this.state.show} key={this.state.show} onChange={this.handleChange}/></td>
                <td  className="fav"><input id="fav" type="checkbox" checked={this.state.fav} key={this.state.fav} onChange={this.handleChange}/></td>
                <td  className="control">
                    {this.state.manager ? <WorkImageManager finish={() => {this.show_manager(); this.props.refresh()}} cancel={this.show_manager} work={this.props.data}/> : <button onClick={this.show_manager}>Gérer les images</button>}
                    <button disabled={!this.state.modified}  className={this.state.modified ? "toSave" : ""} onClick={this.save}>Enregistrer</button>
                    <button onClick={this.delete}>Supprimer</button>
                </td>
            </tr>
        )
    }
}

export class WorksPanel extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            works: [],
            error : null,
            pending : false,
            seed : Math.random().toString(36).substr(2)
        }

        this.refresh = this.refresh.bind(this);
        this.new = this.new.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    new(){
        let name = "";
        while (name === ""){
            name = window.prompt("Entrez le nom");
        }
        if (name){
            fetch("/api/works/admin/new",
                {   method : "post",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify({name : name})}
            ).then(res => {
                console.log(res.status);
                this.refresh();
            }).catch((err) => {
                this.setState({
                    error : err,
                    pending : false
                })
            });
        }
    }

    refresh(){
        this.setState({pending : true})
        fetch("/api/works/admin/all").then(res => {
            return res.json()
        }).then(
            json => {
                this.setState({
                    seed : Math.random().toString(36).substr(2),
                    works : json,
                    pending : false
                })

            }
        ).catch((err) => {
            this.setState({
                error : err,
                pending : false
            })
        });
    }

    render(){
        let works = [];
        if (!this.state.error){
            this.state.works.forEach((elt, index) => {
                works.push(<WorkLine key={this.state.seed + index} data={elt} refresh={this.refresh}/>)
            });
        }

        return (<div className={'workPanel panel' + (this.state.pending ? " pending" : "")}>
            <div className={"head"}>
                <h2>Works</h2>
                <div>
                    <button onClick={this.new}>Nouveau</button>
                    <button onClick={this.refresh}>Actualiser</button>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th className="name">Nom</th>
                    <th className="desc">Desc</th>
                    <th className="link">Lien</th>
                    <th className="video">Lien Video</th>
                    <th className="show">Afficher</th>
                    <th className="fav">Favori</th>
                    <th className="control"></th>
                </tr>
                </thead>
                <tbody>
                {works}
                </tbody>
            </table>
            {this.state.error ? <h3>Erreur : Actualiser la page</h3> : (this.state.works.length === 0 && <h3>Rien à déclarer</h3>)}
        </div>)
    }
}