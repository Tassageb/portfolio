import React from 'react';
import VisibleComp from './visibleComponent.js';

import './about.scss';


export class About extends React.PureComponent{
    render(){
        return (<VisibleComp name="about" className='about'>
            <h2>Hi, i'm Adrien. <em>Nice to meet you.</em></h2>
            <div className='moi'/>
            <p><em>Student in IT</em> and <em>developper</em> in progress since 2020. Naturally <em>curious</em>, i learn a lot by myself and try to learn new technologies every times. <em>Each project</em> is a opportunity to push myself further and done something new.</p>
        </VisibleComp>)
    }
}