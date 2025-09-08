import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom';

import './index.css'
import App from './App.tsx'
import Login from './component/Login.tsx';
import Register from './component/Register.tsx';
import Files from './component/Files.tsx';
import UploadFile from './component/Uploadfile.tsx';
import Download from './component/Download.tsx';
import ProtectedLink from './component/ProtectedLink.tsx';
import FileCard from './component/File.tsx';
import { FileProvider } from './component/FileContext.tsx';
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
      { path: 'upload', element: <UploadFile /> },
    ]
  }, {
    path: 'files/:fileId',
     element: <FileCard />,
     children:[]

  },
  {
    path: "download/:linkId",
    element: <Download />
  }

])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <FileProvider>
    <RouterProvider router={Routes} />
     </FileProvider>
  </StrictMode>,
)
