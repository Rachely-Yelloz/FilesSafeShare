import { Outlet } from "react-router-dom"
import Login from "./component/Login"
import Register from "./component/Register"

// 
function App() {

  return (
    <>
{/* <Login></Login>  */}
<Register></Register>
<Outlet />

   </>
  )
}

export default App
