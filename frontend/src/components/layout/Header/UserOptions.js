import React, { useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';


const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false)

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logOutUser },
  ]

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard
    })
  }

  const navigate = useNavigate();

  function dashboard() {
    navigate('/dashboard')
  }

  return (
    <>
      <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction='down'
        icon={<img
          className='speedDialIcon'
          src={user.avatar.url ? user.avatar.url : "/Profile.png"}
          alt='Profile'
        />
        }
      >
        <SpeedDialAction icon={<DashboardIcon />} tooltipTitle="Dashboard" />
      </SpeedDial>
    </>
  )
}

export default UserOptions
