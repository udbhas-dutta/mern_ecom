import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './processOrder.css'
import MetaData from '../layout/MetaData'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import Sidebar from './Sidebar'
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction'
import { toast } from 'react-toastify'
import Loader from '../layout/Loader/Loader'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'



const ProcessOrder = () => {
    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated } = useSelector((state) => state.order);

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const { id } = useParams()

    const [status, setStatus] = useState("")

    const updateOrderStatusHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("status", status);

        dispatch(updateOrder(id, myForm))
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            toast.success("Status Updated Successfully")
            dispatch({ type: UPDATE_ORDER_RESET })
            navigate('/admin/orders')
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, error, id, updateError, isUpdated, navigate])

    return (
        <>
            <MetaData title="Process Order" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    {loading ? <Loader /> : <div className="confirmOrderPage"
                        style={{
                            display: order.orderStatus === "Delivered" ? "block" : "grid",
                        }}>
                        <div>
                            <div className="confirmShippingArea">
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p>Name:</p>
                                        <span>{order.user && order.user.name}</span>
                                    </div>
                                    <div>
                                        <p>Phone:</p>
                                        <span>
                                            {order.shippingInfo && order.shippingInfo.phoneNo}
                                        </span>
                                    </div>
                                    <div>
                                        <p>Address:</p>
                                        <span>
                                            {order && order.shippingInfo &&
                                                `${order.shippingInfo.address},${order.shippingInfo.city},${order.shippingInfo.state},${order.shippingInfo.pinCode},${order.shippingInfo.country},`}
                                        </span>
                                    </div>
                                </div>

                                <Typography>Payment</Typography>
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p
                                            className={
                                                order.paymentInfo &&
                                                    order.paymentInfo.status === 'succeeded'
                                                    ? "greenColor"
                                                    : "redColor"
                                            }>
                                            {order.paymentInfo &&
                                                order.paymentInfo.status === "succeeded"
                                                ? "PAID"
                                                : "PAYMENT DUE"}
                                        </p>
                                    </div>

                                    <div>
                                        <p>Amount:</p>
                                        <span>{order.totalPrice && order.totalPrice}</span>
                                    </div>
                                </div>

                                <Typography>Order Status</Typography>
                                <div className="orderDetailsContainerBox">
                                    <div>
                                        <p
                                            className={
                                                order.orderStatus && order.orderStatus === "Delivered"
                                                    ? "greenColor"
                                                    : "redColor"
                                            }>
                                            {order.orderStatus && order.orderStatus}
                                        </p>
                                    </div>
                                </div>

                                <div className="confirmCartItems">
                                    <Typography>Your Cart Items:</Typography>
                                    <div className="confirmCartItemsContainer">
                                        {order.orderItems &&
                                            order.orderItems.map((item) => (
                                                <div key={item.product}>
                                                    <img src={item.image} alt="Product" />
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link> {" "}
                                                    <span>
                                                        {item.quantity} x ₹{item.price} ={" "}
                                                        <b>₹{item.price * item.quantity}</b>
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/*  */}
                        <div
                            style={{
                                display:
                                    order.orderStatus === "Delivered" ? "none" : "block"
                            }}
                        >
                            <form
                                className="updateOrderForm"
                                onSubmit={updateOrderStatusHandler}
                            >
                                <h1>Process Order</h1>

                                <div>
                                    <AccountTreeIcon />
                                    <select onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Choose Status</option>
                                        {order.orderStatus === "Processing" && (
                                            <option value="Shipped">Shipped</option>
                                        )}
                                        {order.orderStatus === "Shipped" && (
                                            <option value="Delivered">Delivered</option>
                                        )}
                                    </select>
                                </div>

                                <Button
                                    id='createProductBtn'
                                    type='submit'
                                    disabled={loading ? true : false || status === "" ? true : false}
                                >
                                    Update
                                </Button>

                            </form>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default ProcessOrder
