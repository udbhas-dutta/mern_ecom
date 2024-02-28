import React, { useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { logout } from '../../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';


const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />, name: `Cart(${cartItems.length})`, func: cart },
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

  function cart() {
    navigate('/cart')
  }

  function logOutUser() {
    dispatch(logout());
    localStorage.removeItem('isAuthenticated')
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
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </>
  )
}

export default UserOptions
