import { AppBar, Avatar, Toolbar, Typography ,} from "@mui/material"
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from "./Sidebar";
import logo from "../assets/logo.svg"
import Logoutbutton from "./Logoutbutton";

function Navbar (){

return(

<>

  <AppBar position="sticky" className="!bg-white" >
    <Toolbar>
       
       <div className="flex justify-between items-center w-[100%] " >
           <div className="flex items-center" >
                 <Sidebar/>
                  <img src={logo} alt="logo" className="w-8 h-8 "  />
                  <div className="text-xl font-bold text-black " >Repair Desk</div>
           </div>
           
            <Logoutbutton/>
       </div>
              

    </Toolbar>
    
  </AppBar>



</>
)
}
export default Navbar