import React, { useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { logout } from '../../../actions/userAction';
import { useDispatch } from 'react-redux';

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

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

  function orders() {
    navigate('/orders')
  }

  function account() {
    navigate('/account')
  }

  function logOutUser() {
    dispatch(logout());
    toast.success("Logged out Successfully")
  }


  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction='down'
        className='speedDial'
        icon={<img
          className='speedDialIcon'
          src={user.avatar.url ? user.avatar.url : "/Profile.png"}
          alt='Profile'
        />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
          />
        ))}
      </SpeedDial>
    </>
  )
}

export default UserOptions
