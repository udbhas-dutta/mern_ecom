import React, { useEffect, useState } from 'react'
import "./UpdatePassword.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, updatePassword } from '../../actions/userAction';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';

const UpdatePassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isUpdated, loading } = useSelector((state) => state.profile)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myForm))
  }

  useEffect(() => {
    if (error) {
      console.log('Error:', error); // Log the error for debugging
      toast.error(error)
      dispatch(clearErrors())
      navigate('/password/update')
    }
    if (isUpdated) {
      toast.success("Password Updated Successfully")
      navigate('/account')

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      })
    }
  }, [dispatch, error, navigate, isUpdated])

  return (
    <>
      {loading ? <Loader /> : <>
        <MetaData title="Change Password" />
        <div className="updatePasswordContainer">
          <div className="updatePasswordBox">
            <h2 className="updatePasswordHeading">Update Password</h2>

            <form
              className='updatePasswordForm'
              encType='multipart/form-data'
              onSubmit={updatePasswordSubmit}
            >
              <div className="loginPassword">
                <VpnKeyIcon />
                <input
                  type="password"
                  placeholder='Old Password'
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder='New Password'
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="loginPassword">
                <LockIcon />
                <input
                  type="password"
                  placeholder='Confirm New Password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Change"
                className='updatePasswordBtn'
              />
            </form>
          </div>
        </div>
      </>
      }
    </>
  )
}

export default UpdatePassword
