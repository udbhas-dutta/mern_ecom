import React, { useEffect, useState } from 'react'
import "./resetPassword.css"
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, resetPassword } from '../../actions/userAction';
import { useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {token} = useParams();

    const { error, success, loading } = useSelector((state) => state.forgotPassword)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(resetPassword(token, myForm))
    }

    useEffect(() => {
        if (error) {
            console.log('Error:', error); // Log the error for debugging
            toast.error(error)
            dispatch(clearErrors())
            navigate('/password/update')
        }
        if (success) {
            toast.success("Password Updated Successfully")

            navigate('/login')
        }
    }, [dispatch, error, navigate, success])

    return (
        <>
            {loading ? <Loader /> : <>
                <MetaData title="Reset Password" />
                <div className="resetPasswordContainer">
                    <div className="resetPasswordBox">
                        <h2 className="resetPasswordHeading">Reset Password</h2>

                        <form
                            className='resetPasswordForm'
                            encType='multipart/form-data'
                            onSubmit={resetPasswordSubmit}
                        >
                            <div className="loginPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder='New Password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                value="Update"
                                className='resetPasswordBtn'
                            />
                        </form>
                    </div>
                </div>
            </>
            }
        </>
    )
}

export default ResetPassword
