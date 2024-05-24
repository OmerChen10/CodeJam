import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import "./main.css"
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthProvider, ProjectProvider } from './utils';
import { NetProvider } from './utils';
import { ThemeProvider, createTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

//@ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
//@ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
//@ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
//@ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
//@ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

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
                    <ProjectProvider>
                        <div id='main-app'>
                            <App />
                            <Toaster richColors/>
                        </div>
                    </ProjectProvider>
                </AuthProvider>
            </NetProvider>
        </BrowserRouter>
    </ThemeProvider>
)
