import React, { useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/Loader/Loader.js'
import { toast } from 'react-toastify'
import MetaData from '../layout/MetaData.js'
import {addItemsToCart} from '../../actions/cartAction.js'


const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams()

    const { product, loading, error } = useSelector((state) => state.productDetails)

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: product.ratings,
        isHalf: true
    };

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;
        setQuantity(quantity + 1);
    }
    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    }

    const addToCartHandler=()=>{
        dispatch(addItemsToCart(id, quantity))
        toast.success("Item Added to Cart");
    }

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearErrors())
        } else {
            dispatch(getProductDetails(id))
        };
    }, [dispatch, id, error]);


    // Check if product is not available yet
    if (loading || !product) {
        return <p>Loading...</p>; // You can replace this with a loading indicator
    }

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={`${product.name} -- mern_ecom`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel>
                                {
                                    product &&
                                    product.images &&
                                    product.images.map((item, i) => (
                                        <img
                                            className="CarouselImage"
                                            key={item.url}
                                            src={item.url}
                                            alt={`Slide ${i}`}
                                        />
                                    ))
                                }
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <ReactStars {...options} />
                                <span>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly value={quantity} type="number" />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button onClick={addToCartHandler}>Add to Cart</button>
                                </div>

                                <p>
                                    Status:
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description: <p>{product.description}</p>
                            </div>

                            <button className='submitReview'>Submit Review</button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </>
            )}
        </>
    )
}

export default ProductDetails
