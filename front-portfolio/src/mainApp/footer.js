import React from 'react';
import avatar from "./images/avatar-end.svg";

import './footer.scss';

export class Footer extends React.PureComponent {
    render() {
        return (
            <div className='footer'>
                <img alt='avatar' src={avatar}/>
                <p>Handcrafted</p>
            </div>
        )
    }
}