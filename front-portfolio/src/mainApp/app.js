import React from 'react';
import {Header} from './header';
import {Main} from './main';
import {About} from './about';
import {Skills} from './skills';
import {Works} from './works';
import {Contact} from './contact';
import {Footer} from './footer.js';

import isInViewport from './viewport';
import Elements from './elements';

import './body.scss';
import './cssvar.css'

export class App extends React.Component{
    constructor(props){
        super(props);

        let dark = window.localStorage.getItem("dark_mode");
        if (!dark){
            dark = "false";
        }

        this.state = {
            dark : dark,
            focus : 0
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount(){
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll(e){
        let elts = Object.values(Elements.fetch());
        elts.sort((a, b) => {
            const nodeA = a.current;
            const nodeB = b.current;
            if (Array.from(nodeA.parentNode.children).indexOf(nodeA) < Array.from(nodeB.parentNode.children).indexOf(nodeB)){
                return -1;
            } else {
                return 1;
            }
        });
        let elementsOnScreenPercent = elts.map((value) => isInViewport(value.current));
        let i = elementsOnScreenPercent.indexOf(Math.max.apply(null, elementsOnScreenPercent)) + 1;
        if (elementsOnScreenPercent[i-1] < 20){
            i = 0
        }
        if (i !== this.state.focus){
            this.setState({
                focus : i
            });
        }
    }

    change_mode(){
        if (this.state.dark === "true"){
            this.setState({dark : "false"});
            window.localStorage.setItem("dark_mode", "false")
        } else {
            this.setState({dark : "true"});
            window.localStorage.setItem("dark_mode", "true")
        }
    }

    render(){
        return (<div className={'app'+ (this.state.dark === "true" ? " dark" : "")}>
            <Header dark_mode={this.change_mode.bind(this)} selected={this.state.focus}/>
            <Main/>
            <About/>
            <Skills/>
            <Works/>
            <Contact/>
            <Footer/>
        </div>)
    }
}
