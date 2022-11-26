import React from "react";
import isInViewport from './viewport';
import './visible.scss';
import Elements from "./elements";

export default class VisibleComp extends React.PureComponent{
    constructor(props){
        super(props)
        
        this.ref = React.createRef();

        if (this.props.name){
            Elements.add(this.props.name, this.ref);
        }

        this.state = {
            visible : true
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount(){
        window.addEventListener("scroll", this.handleScroll);
        if (this.ref.current){
            let visible = isInViewport(this.ref.current) > 10;
            this.setState({
                visible : visible
            })
        }
    }

    componentWillUnmount(){
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll(e){
        if (this.ref.current){
            let visible = isInViewport(this.ref.current) > 10;
            this.setState({
                visible : visible
            })
        }
    }

    render(){
        let classes = this.props.className + " view" + (this.state.visible ? " visible" : "")
        return (<div ref={this.ref} className={classes} style={this.props.style}>{this.props.children}</div>)
    }
}