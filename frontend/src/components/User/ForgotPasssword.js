import React, { useEffect, useState } from 'react'
import "./ForgotPassword.css"
import Loader from '../layout/Loader/Loader'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';


const ForgotPasssword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, message, loading } = useSelector((state) => state.forgotPassword)

  const [email, setEmail] = useState("")


  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    dispatch(forgotPassword(myForm))
  }

  useEffect(() => {

    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
    if (message) {
      toast.success(message)
    }
  }, [dispatch, error, message])

  return (
    <>
      {loading ? <Loader /> : <>
        <MetaData title="Forgot Password" />
        <div className="forgotPasswordContainer">
          <div className="forgotPasswordBox">
            <h2 className="forgotPasswordHeading">Forgot Password</h2>

            <form
              className='forgotPasswordForm'
              onSubmit={forgotPasswordSubmit}
            >
              <div className="forgotPasswordMail">
                <MailOutlineIcon />
                <input
                  type="email"
                  name="email"
                  placeholder='Email'
                  value={email}
                  required
                  onChange={(e) => { setEmail(e.target.value) }}
                />
              </div>
              <input
                type="submit"
                value="Send"
                className='forgotPasswordBtn'
              />
            </form>
          </div>
        </div>
      </>
      }
    </>
  )
}

export default ForgotPasssword
