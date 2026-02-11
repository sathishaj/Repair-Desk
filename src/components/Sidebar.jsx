import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useNavigation } from 'react-router-dom';
import logo from "../assets/logo.svg"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Sidebar (){

const[open , setOpen] = useState(false)
const navigate = useNavigate()
     
  const onclickhandle = () =>{      
      setOpen(!open)
  }

  const handleNavigation = (path)=>{
      navigate(path)
      setOpen(false)
  }

 const menuitems = [
    
    {text: "Home ",     icon : <HomeIcon/> , path:"/" },
    {text:"Profile",    icon:<AccountCircleIcon/>, path:"/Profile"},
    {text: "Customer" , icon :<SupervisorAccountIcon/> , path:"/Customer" },
    {text: "Job Card" , icon :<AppSettingsAltIcon/> , path:"/Jobcard" },
     {text: "Admin" , icon :<AdminPanelSettingsIcon/> , path:"/Admin" },
     
    
 ]
  
 
    return(


    <>
         <IconButton onClick={onclickhandle} size='large' color='black' ><MenuIcon/></IconButton>

         <Drawer open={open} onClose={onclickhandle}  >

            <div className='w-[250px] h-[64px] flex justify-start items-center p-3 ' >
               
              
              <div className='text-xl font-bold flex gap-1' >
                <span><img src={logo} alt="logo" className='w-8 h-8' /></span>
                 Repair Desk
                </div>              
            </div>
            <Divider/>
           <Box  sx={{ width: 250 }}  role="presentation"  onClick={onclickhandle}  >
               <List>
            {menuitems.map((item) => (
              <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

           </Box>

         </Drawer>
    </>
    )
}
export default Sidebar