import React, { useEffect, useState } from 'react'
import './newProduct.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { UPDATE_USER_RESET } from '../../constants/userConstants'
import { getUserDetails, updateUser, clearErrors } from '../../actions/userAction'
import Loader from '../layout/Loader/Loader'


const UpdateUser = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userId } = useParams()

    const { loading, error, user } = useSelector((state) => state.userDetails)

    const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.profile)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    console.log(user.email)

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId))
        } else {
            setName(user.name);
            setEmail(user.email)
            setRole(user.role)

        }
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            toast.success("Updated User Successfully");
            navigate('/admin/users')
            dispatch({ type: UPDATE_USER_RESET })
        }
    }, [dispatch, error, navigate, updateError, isUpdated, user, userId])

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);

        dispatch(updateUser(userId, myForm))
    }


    return (
        <>
            <MetaData title="Update User -- Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {loading ? <Loader /> : <form
                        className="createProductForm"
                        onSubmit={updateUserSubmitHandler}
                    >
                        <h1>Update User</h1>

                        <div>
                            <PersonIcon />
                            <input
                                type="text"
                                placeholder='User Name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <MailOutlineIcon />
                            <input
                                type="email"
                                placeholder='Email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <VerifiedUserIcon />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="">Choose Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>

                            </select>
                        </div>

                        <Button
                            id='createProductBtn'
                            type='submit'
                            disabled={updateLoading ? true : false || role === "" ? true : false}
                        >
                            Update
                        </Button>

                    </form>}
                </div>
            </div>
        </>

    )
}

export default UpdateUser

