import React, {useState, useEffect} from 'react';
import VisibleComp from './visibleComponent.js';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faXmark, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

import './works.scss';
import './basicbox.scss';

const Diapo = (props) => {
    const [selected, setSelected] = useState(0);

    const toRight = () => {
        if (!(selected + 1 >= props.images.length)){
            setSelected(selected + 1);
        }
    }

    const toLeft = () => {
        if (!(selected <= 0)){
            setSelected(selected - 1);
        }
    }

    return (
        <div className={"img"}>
            <div className={"img-content"} >
                <div className={"img-list"} style={{'--selected' : selected}}>
                    {props.images.map((img, index) => <img key={index} className={"back"} alt={"work"} src={"/api/works/image/" + img}/>)}
                </div>
                <span className={"overlay"}/>
                <div className={"arrows"}>
                    <FontAwesomeIcon onClick={toLeft} className={"arrow left" + (props.hide || selected <= 0 ? " hide" : "")} icon={faAngleLeft}/>
                    <FontAwesomeIcon onClick={toRight} className={"arrow right" + (props.hide || selected + 1 >= props.images.length ? " hide" : "")} icon={faAngleRight}/>
                </div>

            </div>
        </div>
    )
}


const ExternalLink = (props) => {

    return (
        <a href={props.link} target="_blank" rel="noreferrer">
            <svg className="link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
        </a>
    )
}

const Work = (props) => {

    let [enable, setEnable] = useState(false);  //Met l'élement dans le DOM
    let [show, setShow] = useState(false);      //Affiche l'élement DOM

    const cancel = (e) => {
        setShow(false);
        window.removeEventListener("scroll", cancel);
        setTimeout(() => {
            setEnable(false);
        }, 1000);
    }

    const handleClick = () => {
        if ((props.data.images && props.data.images.length > 0)){
            setShow(true);
            setEnable(true)
        }
    }

    useEffect(() => {
        if (show){
            window.removeEventListener("scroll", cancel);
            window.addEventListener("scroll", cancel);
        }
    });

    return (
        <div className="item">
            <div className="work">
                <div className="header">
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="folder feather feather-folder">
                        <title>Folder</title>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {props.data.link && <ExternalLink link={props.data.link}/>}
                </div>
                <h3 className={(props.data.images && props.data.images.length > 0) && 'click'} onClick={handleClick}>{props.data.name}</h3>
                <p>{props.data.description}</p>
                {props.data.stack && <ul className="tech">{(JSON.parse(props.data.stack)).map((x) => <li>{x}</li>)}</ul>}

            </div>
            {(enable && (props.data.images && props.data.images.length > 0)) && <div className={"detail" + (!show ? ' hide' : '')}>
                <div className="content">
                    <Diapo images={props.data.images}/>
                    <FontAwesomeIcon className={"close-icon"} onClick={cancel} icon={faXmark} />
                </div>
            </div>}
        </div>
    )
}

class WorkFav extends React.Component{
    render(){
        return (
        <div className='work'>
            <div className='item' >
                <Diapo images={this.props.data.images}/>
                <h4>{this.props.data ? this.props.data.name : ""}</h4>  
                <div className='info'>
                    {
                        /*this.props.data && this.props.data.video_path ?
                        <video poster={this.props.data.image_path} preload="none" controls className='video'>
                            <source src={this.props.data.video_path} type="video/mp4" />
                        </video> :
                        ""*/
                    }
                    <p className='desc'>{this.props.data && this.props.data.description ? this.props.data.description : ""}</p>
                    {this.props.data && this.props.data.link ? <ExternalLink link={this.props.data.link}/> : ""}
                    {this.props.data.stack && <ul className="tech">{(JSON.parse(this.props.data.stack)).map((x, index) => <li key={index}>{x}</li>)}</ul>}
                </div>

            </div>
        </div>)
    }
}

export class Works extends React.PureComponent{
    constructor(props){
        super(props);

        this.state = {
            data : []
        }
    }

    componentDidMount(){
        fetch("/api/works/all").then(res => res.json()).then((json) => {
            this.setState({
                data : json
            })
        });
    }

    render(){
        let eltsfav = [];
        let elts = [];
        this.state.data.forEach((elt, index) => {
            if (elt.fav){
                eltsfav.push(<WorkFav key={index} data={elt}/>);
            } else {
                elts.push(<Work key={index} data={elt}/>);
            }
        })

        return (<VisibleComp name={"work"}  className='works basic-box'>
            <h2>My <em>R</em>ecents <em>W</em>orks</h2>
            <VisibleComp className="works-list-fav" style={{'--nb' : eltsfav.length}}>
                {eltsfav}
            </VisibleComp>
            <h3>OTHER WORKS</h3>
            <VisibleComp className="works-list">
                {elts}
            </VisibleComp>
        </VisibleComp>)
    }
}