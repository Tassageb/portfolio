import React from 'react';
import VisibleComp from './visibleComponent.js';

import './contact.scss';

class ContactForm extends React.Component{
    constructor(props) {
        super(props);


        this.state = {
            nameField : "",
            contactField : "",
            messageField : "",
            error : "",
            errorTimer : null,
            alreadySend : localStorage.getItem("alreadySend") === "true",
            pending : false
        }

        this.handleChange = this.handleChange.bind(this);
        this.reset = this.reset.bind(this);
        this.send = this.send.bind(this);
    }

    handleChange(e){
        let newState = {}
        switch (e.target.id){
            case 'name' :
                newState.nameField = e.target.value;
                break;
            case 'contact' :
                newState.contactField = e.target.value;
                break;
            case 'message' :
                newState.messageField = e.target.value;
                break;
            default:
                break;
        }
        this.setState(newState);
    }

    reset(){
        this.setState({
            nameField : "",
            contactField : "",
            messageField : "",
            alreadySend : false
        })
        localStorage.setItem("alreadySend", "false");
    }

    send(){
        if (this.state.contactField.includes("@")){
            if (this.state.messageField !== ""){
                if (this.state.nameField) {
                    let data = {
                        name : this.state.nameField,
                        contact : this.state.contactField,
                        message : this.state.messageField
                    }

                    let requestOptions  = {
                        method : 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body : JSON.stringify(data)
                    }

                    //console.log(requestOptions );
                    this.setState({
                        pending : true
                    })
                    fetch("/api/msg/send", requestOptions).then(res  => {
                        if (res.status === 200){
                            this.reset();
                            this.setState({
                                alreadySend : true
                            });
                            localStorage.setItem("alreadySend", "true");
                        } else {
                            this.sendError("An error occurred while sending");
                            console.warn("Error in the fetch : " + res.status);
                        }
                        this.setState({
                            pending : false
                        })
                    });
                } else {
                    this.sendError("Please, enter your name");
                }
            } else {
                this.sendError("Your message is empty");
            }
        } else {
            this.sendError("Please, enter a valid mail address");
        }
    }

    sendError(errMessage){
        if (this.state.errorTimer){
            clearTimeout(this.state.errorTimer);
        }

        let timer = setTimeout(() => {
            this.setState({
                error : "",
                errorTimer : null
            })
        }, 4000);

        this.setState({
            error : errMessage,
            errorTimer : timer
        })
    }

    render(){
        if (!this.state.alreadySend){
            return (
                <div className={'form' + (this.state.pending ? " pending" : "")}>

                    <span>
                        <input type='text' value={this.state.nameField} onChange={this.handleChange} name='name' id='name' autoComplete="off"/>
                        <label htmlFor='name'>Your name</label>
                    </span>
                    <span>
                        <input type='text' value={this.state.contactField} onChange={this.handleChange} name='contact' id='contact' autoComplete="off"/>
                        <label htmlFor='contact'>Your mail address</label>
                    </span>
                    <span className='textarea'>
                        <textarea value={this.state.messageField} onChange={this.handleChange} name='message' id='message' placeholder=' ' autoComplete="off" />
                        <label htmlFor='message'>Your message</label>
                    </span>
                    {
                        this.state.error !== "" &&
                        <span className='form-error'>
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" x="0px" y="0px"> <g> <g > <path d="M256,34.297L0,477.703h512L256,34.297z M256,422.05c-9.22,0-16.696-7.475-16.696-16.696s7.475-16.696,16.696-16.696 c9.22,0,16.696,7.475,16.696,16.696S265.22,422.05,256,422.05z M239.304,344.137V177.181h33.391v166.956H239.304z"/> </g> </g> </svg>
                            <div>
                                <p className='title'>There is something wrong</p>
                                <p>{this.state.error}</p>
                            </div>
                        </span>
                    }
                    <button className='button' onClick={this.send}>Send</button>
                </div>
            )
        } else {
            return (
                <div className='form already-send'>
                    <span className='already-send'>
                        <p>Your message have been sent</p>
                    </span>
                    <button className='button' onClick={this.reset}>New Message</button>
                </div>
            )
        }
    }
}


export class Contact extends React.PureComponent{
    render(){
        return (
            <VisibleComp name={"contact"} className='contact basic-box'>
                <h2>contact <em>m</em>e</h2>
                <div>
                    <div className='contact-ways'>
                        <div className='contact-card'>
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="1280.000000pt" height="914.000000pt" viewBox="0 0 1280.000000 914.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,914.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M1195 9129 c-510 -65 -953 -428 -1121 -921 -71 -209 -65 100 -70 -3578 -2 -2270 0 -3345 7 -3410 26 -237 116 -468 257 -660 66 -91 204 -229 290 -290 144 -103 334 -190 511 -232 85 -20 117 -21 2261 -29 1196 -5 3552 -8 5235 -6 l3060 3 85 21 c137 34 207 60 335 123 409 202 684 594 744 1059 8 59 11 1079 11 3445 -1 2774 -3 3371 -14 3416 -42 173 -109 327 -202 467 -71 107 -203 246 -313 329 -88 67 -300 177 -399 208 -30 10 -95 27 -145 39 l-92 22 -5185 1 c-2961 1 -5215 -2 -5255 -7z m7845 -3165 c-1678 -1678 -2471 -2465 -2505 -2485 -69 -40 -150 -41 -217 -1 -29 17 -948 928 -2507 2485 l-2461 2457 5072 0 5073 0 -2455 -2456z m3070 -1326 l-5 -3423 -22 -77 c-58 -204 -153 -318 -326 -391 l-72 -30 -1727 1734 -1727 1734 1937 1938 c1065 1065 1939 1937 1942 1937 3 0 3 -1540 0 -3422z m-9430 1487 l1905 -1905 -1747 -1747 -1747 -1747 -62 29 c-123 59 -208 173 -246 330 -16 65 -18 301 -20 3508 -2 1890 0 3437 4 3437 5 0 865 -857 1913 -1905z m3005 -3000 c451 -455 620 -619 649 -631 50 -20 133 -20 182 1 28 11 207 184 634 610 l595 595 1503 -1503 c826 -826 1502 -1504 1502 -1507 0 -3 -1964 -5 -4365 -5 -2401 0 -4365 2 -4365 5 0 6 3043 3050 3050 3050 3 0 280 -276 615 -615z"/></g></svg>
                            <h3>Email</h3>
                            <p>adrien.begassat@gmail.com</p>
                            <a href='mailto:adrien.begassat@gmail.com'>Send a message</a>
                        </div>
                        <div className='contact-card'>
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            <h3>LinkedIn</h3>
                            <p>Adrien BEGASSAT</p>
                            <a href="https://www.linkedin.com/in/adrien-begassat-2616a9221/" target='_blank' rel="noreferrer">Go to my profile</a>
                        </div>
                    </div>
                    <h3>OR</h3>
                    <ContactForm/>
                </div>
            </VisibleComp>
        )
    }
}