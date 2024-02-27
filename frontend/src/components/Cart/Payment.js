import React, { useEffect, useRef } from 'react'
import CheckOutSteps from './CheckOutSteps'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import axios from 'axios'
import './Payment.css'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom';
import {createOrder, clearErrors} from '../../actions/orderAction'


const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const dispatch = useDispatch();
    const payBtn = useRef(null);
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()

    const { shippingInfo, cartItems } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user)
    const { error } = useSelector((state) => state.newOrder)

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    }

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            }
            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            if (!stripe || !elements) return

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        }
                    }
                }
            })
            if (result.error) {
                payBtn.current.disabled = false;

                toast.error(result.error.message)
            } else {
                if (result.paymentIntent.status === "succeeded") {

                    order.paymentInfo = {
                        id:result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    }
                    dispatch(createOrder(order));
                    
                    navigate("/success")
                } else {
                    toast.error("There was some issue while processing the payment")
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
      if(error){
        toast.error(error)
        dispatch(clearErrors());
      }
    }, [dispatch,error])
    
    return (
        <>
            <MetaData title="Payment" />
            <CheckOutSteps activeStep={2} />
            <div className="paymentContainer">
                <form onSubmit={(e) => submitHandler(e)} className="paymentForm">
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className='paymentInput' />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className='paymentInput' />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className='paymentInput' />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className='paymentFormBtn'
                    />
                </form>
            </div>

        </>
    )
}

export default Payment
