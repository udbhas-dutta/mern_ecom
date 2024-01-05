import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from './Product.js'
import MetaData from '../MetaData.js';
import { getProduct } from '../../../actions/productAction.js';
import { useSelector, useDispatch } from 'react-redux';


const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(state => state.products)

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch])


    return (
        <>
            <MetaData title="MERN_ECOM" />
            <div className="banner">
                <p>Welcome to Mern_Ecom</p>
                <h1>Find interesting products below</h1>
                <a href="#container">
                    <button>Scroll<CgMouse />
                    </button>
                </a>
            </div>

            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id='container'>
                {products && products.map((product) => 
                    <Product product={product} />
                )}
            </div>
        </>
    )
}

export default Home
