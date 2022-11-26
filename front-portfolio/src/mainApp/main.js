import React from 'react';
import Elements from './elements';
import avatar from './images/avatar.svg';
import './main.scss';
import './button.scss';

export class Main extends React.PureComponent{
    render(){
        return (<div className='main-info'>
            <div className='tittle'>
                <div className='name'>
                    <h1>Adrien</h1>
                    <h1>BEGASSAT</h1>
                </div>
                <img alt='avatar' src={avatar} />
            </div>
            <p><em>Hello</em>, i'm a french student in IT and Fullstack Developer in progress</p>
            <div className='buttons'>
                <div className="button" onClick={() => {
                    let contact = Elements.fetch()['contact'];
                    if (contact){
                        let node = contact.current;
                        if (node){
                            node.scrollIntoView(true);
                        }
                    }
                }}>Contact me</div>
                <a className='button second' href='/CV.pdf' target="_blank">Download CV</a>
            </div>
        </div>)
    }
}