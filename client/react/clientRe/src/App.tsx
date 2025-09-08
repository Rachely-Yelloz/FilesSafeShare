import { Outlet } from "react-router-dom"
// import Register from "./component/Register"
import Login from "./component/Login"
import { FileProvider } from "./component/FileContext"

// 
function App() {

  return (
    <>
      <FileProvider>
        <Login></Login>
        {/* <Register></Register> */}
        <Outlet />
      </FileProvider>
    </>
  )
}

export default App
