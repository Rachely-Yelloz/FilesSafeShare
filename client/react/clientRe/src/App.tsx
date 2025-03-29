import { Outlet } from "react-router-dom"
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
