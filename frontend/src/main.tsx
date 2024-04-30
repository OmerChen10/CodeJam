import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import "./main.css"
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <div id='main-app'>
            <App />
            <Toaster richColors/>
        </div>
    </BrowserRouter>
)
