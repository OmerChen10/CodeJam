import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import "./main.css"
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div id='main-app'>
    <App />
    <Toaster richColors/>
  </div>
)
