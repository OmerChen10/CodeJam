import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import "./main.css"
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './utils';
import { NetProvider } from './utils';
import { ThemeProvider, createTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        secondary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700],
            contrastText: "#fff"
        },
        success: {
            light: '#4caf50',
            main: '#4caf50',
            dark: '#4caf50',
            contrastText: '#fff',
        },
    },
    typography: {
        button: {
            fontWeight: 'bold',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
            <NetProvider>
                <AuthProvider>
                    <div id='main-app'>
                        <App />
                        <Toaster richColors/>
                    </div>
                </AuthProvider>
            </NetProvider>
        </BrowserRouter>
    </ThemeProvider>
)
