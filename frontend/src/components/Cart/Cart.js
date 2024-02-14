import React from 'react'
import "./Cart.css"
import CartItemCard from './CartItemCard.js'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart } from '../../actions/cartAction.js'

const Cart = () => {
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart)

    const increaseQuantity = (id, quantity, stock)=>{
        const newQuantity = quantity+1;
        if(stock<=quantity) return;

        dispatch(addItemsToCart(id, newQuantity))
    }

    return (
        <>
            <div className="cartPage">
                <div className="cartHeader">
                    <p>Product</p>
                    <p>Quantity</p>
                    <p>Subtotal</p>
                </div>

                {cartItems && cartItems.map((item) => (
                    <div className="cartContainer">
                        <CartItemCard item={item} />
                        <div className="cartInput">
                            <button>-</button>
                            <input type="number" value={item.quantity} readOnly />
                            <button onClick={()=> increaseQuantity(item.product, item.quantity, item.Stoc)}>+</button>
                        </div>
                        <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
                    </div>
                ))}

                <div className="cartGrossTotal">
                    <div></div>
                    <div className="cartGrossProfitBox">
                        <p>Gross Total</p>
                        <p>{`₹600`}</p>
                    </div>
                    <div></div>
                    <div className="checkOutBtn">
                        <button>Check Out</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
