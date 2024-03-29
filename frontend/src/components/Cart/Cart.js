import React from 'react'
import "./Cart.css"
import CartItemCard from './CartItemCard.js'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'


const Cart = () => {
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart)

    const increaseQuantity = (id, quantity, stock) => {
        const newQuantity = quantity + 1;
        if (stock <= quantity) return;

        dispatch(addItemsToCart(id, newQuantity))
    }
    const decreaseQuantity = (id, quantity) => {
        const newQuantity = quantity - 1;
        if (quantity <= 1) return;

        dispatch(addItemsToCart(id, newQuantity))
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const navigate = useNavigate()

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }
    

    return (
        <>
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />
                    <Typography>No Product in your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
            ) : (
                <>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {cartItems && cartItems.map((item) => (
                            <div className="cartContainer" key={item.product}>
                                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                <div className="cartInput">
                                    <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                                    <input type="number" value={item.quantity} readOnly />
                                    <button onClick={() => increaseQuantity(item.product, item.quantity, item.Stock)}>+</button>
                                </div>
                                <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
                            </div>
                        ))}

                        <div className="cartGrossTotal">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc, item) => acc + item.quantity * item.price, 0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </>
    )
}

export default Cart
