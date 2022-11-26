import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter, Routes, Route} from "react-router-dom";

import {App} from './mainApp/app.js';
import {AdminApp} from "./adminApp/adminApp.js";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/admin/" element={<AdminApp/>}/>
            <Route path="*"  element={<p>404</p>}/>
        </Routes>
    </BrowserRouter>

</React.StrictMode>)