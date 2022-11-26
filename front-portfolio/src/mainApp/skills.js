import React from 'react';
import VisibleComp from './visibleComponent.js';
import './skills.scss';
import './basicbox.scss';

class Skill extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            svg : ""
        }
    }

    componentDidMount(){ //Recupere les données du SVG de l'icone
        fetch(this.props.data.image_path).then(res => res.text()).then(body => {
            this.setState({
                svg : <div className='icon' dangerouslySetInnerHTML={{__html : body}}/>
            })
        });
    }

    render(){
        return (<span className='skill'>
            <div className='data'>     
                <p>{this.props.data.name}</p>
                {this.state.svg}
            </div>
            <div className="level" style={{"--l" : this.props.data.level*10 + "%"}}/>
        </span>)
    }
}

class SkillPan extends React.Component{
    render(){

        let elt = [];
        let long = 0;
        if (this.props.data){
            long = this.props.data.length
            this.props.data.forEach((element, index) => {
                elt.push(<Skill key={index} data={element}/>);
            });
        }
        return (<div className='skill-pan' style={{"--n" : long}}>
            <h3>{this.props.title}</h3>
            {elt}
        </div>)
    }
}

export class Skills extends React.PureComponent{
    constructor(props){
        super(props);

        this.state = {
            data : {}
        }
    }

    componentDidMount(){
        fetch("/api/skills/all").then(res => res.json()).then((json) => {
            this.setState({
                data : json
            })
        });
    }

    render(){
        return (<VisibleComp name="skills" className='skills basic-box'>
            <h2>My <em>S</em>kills</h2>
            <div>
                <SkillPan data={this.state.data.front} title='Front-End'></SkillPan>
                <SkillPan data={this.state.data.back} title='Back-End'></SkillPan>
                <SkillPan data={this.state.data.others} title='Others'></SkillPan>
            </div>
        </VisibleComp>)
    }
}