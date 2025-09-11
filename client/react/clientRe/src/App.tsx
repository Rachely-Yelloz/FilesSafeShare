import { Outlet } from "react-router-dom"
import Login from "./component/Login"
import { FileProvider } from "./component/FileContext"

// 
function App() {

  return (
    <>
      <FileProvider>
        <Login></Login>
        <Outlet />
      </FileProvider>
    </>
  )
}

export default App
