import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import Sidebar from './Sidebar'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData'
import { deleteOrder, getAllOrders, clearErrors } from '../../actions/orderAction'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'


const OrderList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const { error, orders } = useSelector((state) => state.allOrders)

    const { error: deleteError, isDeleted } = useSelector((state) => state.order)

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
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
            toast.success("Order Deleted Successfully")
            dispatch({ type: DELETE_ORDER_RESET })
            navigate('/admin/orders')
        }
        dispatch(getAllOrders())
    }, [dispatch, error, deleteError, isDeleted, navigate])


    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params)=>{
                return params.row.status === "Delivered" ? "greenColor" : "redColor"
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minwidth: 270,
            flex: 0.5,
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
                        <Link to={`/admin/order/${params.id}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteOrderHandler(params.id, "id")}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            }
        },
    ]

    const rows = []

    orders &&
        orders.forEach((item) => {
            rows.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                amount: item.totalPrice,
                status: item.orderStatus,
            })
        })

    return (
        <>
            <MetaData title={`All Orders - Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id='productListHeading'>All Orders</h1>

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

export default OrderList
