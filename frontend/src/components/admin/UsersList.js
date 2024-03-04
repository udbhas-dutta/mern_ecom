import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import './productList.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import Sidebar from './Sidebar'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData'
import { DELETE_USER_RESET } from '../../constants/userConstants'
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userAction'


const UserList = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const { users, error } = useSelector((state) => state.allUsers)

  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile)


  const deleteUserHandler = (id) => {

    dispatch(deleteUser(id))
  }


  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }

    if (deleteError) {
      toast.error(deleteError)
      dispatch(clearErrors())
    }

    if (isDeleted) {
      toast.success(message)
      dispatch({ type: DELETE_USER_RESET })
      navigate('/admin/users')
    }
    dispatch(getAllUsers())
  }, [dispatch, error, deleteError, isDeleted, navigate, message])


  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.5 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 270,
      flex: 0.3,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 0.2,
    },
    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 270,
      flex: 0.3,
      cellClassName: (params) => {
        return params.row.role === "admin" ? "greenColor" : "redColor"
      }
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/user/${params.id}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteUserHandler(params.id, "id")}>
              <DeleteIcon />
            </Button>
          </>
        )
      }
    },
  ]

  const rows = []

  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      })
    })



  return (
    <>
      <MetaData title={`All Users - Admin`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id='productListHeading'>All Users</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className='productListTable'
          />
        </div>
      </div>
    </>
  )
}

export default UserList
