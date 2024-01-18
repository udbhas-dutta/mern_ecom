import React, { useEffect, useState } from 'react'
import "./Products.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import { Slider, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../layout/MetaData'


const categories = [
    "Laptop",
    "Footweear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
];

const Products = () => {
    const dispatch = useDispatch();


    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)

    const { products, loading, error, productsCount, resultsPerPage, filteredProductsCount } = useSelector(state => state.products)

    const { keyword } = useParams()

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors)
        } else {
            dispatch(getProduct(keyword, currentPage, price, category, ratings));
        }
    }, [dispatch, keyword, currentPage, price, category, ratings, error])

    let count = filteredProductsCount;

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title="Products -- mern_ecom" />
                    <h2 className="productsHeading">Products</h2>

                    <div className="products">
                        {products &&
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slider'
                            min={0}
                            max={25000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRatings) => {
                                    setRatings(newRatings);
                                }}
                                aria-labelledby='continuous-slider'
                                valueLabelDisplay='auto'
                                min={0}
                                max={5}


                            />
                        </fieldset>
                    </div>


                    {resultsPerPage < count && <div className="paginationBox">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultsPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="prev"
                            firstPageText="first"
                            lastPageText="last"
                            itemClass="page-item"
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                        />

                    </div>}
                </>
            )}
        </>
    )
}

export default Products
