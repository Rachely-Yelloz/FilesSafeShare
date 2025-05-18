import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'
import App from './App.tsx'
import Login from './component/Login.tsx';
import Register from './component/Register.tsx';
import Files from './component/Files.tsx';
import UploadFile from './component/Uploadfile.tsx';
const Routes = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
    children: [
      { path: 'register', element: <Register /> }
    ]
  },
  {
    path: "register",
    element: <Register />,
    children: [
      { path: 'login', element: <Login /> }
    ]
  },
  {
    path: "/",
    element: <App />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }

    ]
  }, 
  {
    path: "files",
    element: <Files />,
    children: [
  {path: 'upload', element: <UploadFile /> },
    ]
  }

])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Routes} />
  </StrictMode>,
)
