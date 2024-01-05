import React from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from './Product.js'


const product = {
    name: "Blue Shirt",
    images:[{url:"https:/i.ibb.co/DRST11n/1.webp"}],
    price: "₹3000",
    _id:"shirt1"
}

const Home = () => {
    return (
        <>
            <div className="banner">
                <p>Welcome to Mern_Ecom</p>
                <h1>Find interesting products below</h1>
                <a href="#container">
                    <button>Scroll<CgMouse/>
                    </button>
                </a>
            </div>

            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id='container'>
            <Product product={product}/>
            <Product product={product}/>
            <Product product={product}/>
            <Product product={product}/>

            <Product product={product}/>
            <Product product={product}/>
            <Product product={product}/>
            <Product product={product}/>
            </div>
        </>
    )
}

export default Home
