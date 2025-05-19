import { Outlet } from "react-router-dom"
// import Register from "./component/Register"
import Login from "./component/Login"

// 
function App() {

  return (
    <>
<Login></Login> 
{/* <Register></Register> */}
<Outlet />

   </>
  )
}

export default App
