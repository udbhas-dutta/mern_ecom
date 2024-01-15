import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from './ProductCard.js'
import MetaData from '../layout/MetaData.js';
import { clearErrors, getProduct } from '../../actions/productAction.js';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader.js';
import { toast } from 'react-toastify'


const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(state => state.products)

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearErrors())
        } else {
            dispatch(getProduct())
        };
    }, [dispatch, error])


    return (
        <>
            {loading ? <Loader /> : <>
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
            </>}
        </>
    )
}

export default Home
