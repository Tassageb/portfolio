import React from 'react';
import Elements from './elements';
import './header.scss';

import sun from './images/sun.png';
import moon from './images/moon.png';

export class Header extends React.Component{
    handleClick(section){
        let elements = Elements.fetch();
        if (elements[section]){
            let node = elements[section].current;
            if (node){
                //console.log(node.scrollHeight);
                //window.scrollTo(0, node.scrollHeight);
                node.scrollIntoView({block: "start", inline: "center"});
            }
        } else {
            console.warn("This section does not exist");
        }
    }

    render(){
        let list = ["About", "Skills","Work", "Contact"];
        let elements = [];
        list.forEach((elt, index) => {
            let attr = {key : index, onClick : () => {this.handleClick(elt.toLowerCase())}}
            if (index+1 === this.props.selected){
                attr.className = "selected";
            }
            elements.push(<li {...attr}>{elt}</li>)
        });

        return (<header id='header' className='header'>
            <ul>
                {elements}
            </ul>
            <div className='dark-mode-button' onClick={this.props.dark_mode}>
                <img id='sun' alt='sun' src={sun}/>
                <img id='moon' alt='moon' src={moon}/>
            </div>
        </header>)
    }
}
