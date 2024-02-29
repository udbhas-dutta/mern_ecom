import React, { useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/Loader/Loader.js'
import { toast } from 'react-toastify'
import MetaData from '../layout/MetaData.js'
import { addItemsToCart } from '../../actions/cartAction.js'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Rating,
} from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js'


const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams()

    const { product, loading, error } = useSelector((state) => state.productDetails)

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    )

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;
        setQuantity(quantity + 1);
    }
    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity))
        toast.success("Item Added to Cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating)
        myForm.set("comment", comment)
        myForm.set("ProductId", id)

        console.log('Submitting review:', { rating, comment, ProductId: id });

        dispatch(newReview(myForm))

        setOpen(false)
    }

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearErrors())
        }
        if (reviewError) {
            toast.error(reviewError)
            dispatch(clearErrors())
        }
        if (success) {
            toast.success("Review has been submitted Successfully")
            dispatch({ type: NEW_REVIEW_RESET })
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, success, reviewError]);


    // Check if product is not available yet
    if (loading || !product) {
        return <p>Loading...</p>; //  replace this with a loading indicator
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
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly value={quantity} type="number" />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>
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

                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size='large'
                            />

                            <textarea
                                className='submitDialogTextArea'
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                            <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
                        </DialogActions>
                    </Dialog>

                    {product && product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                        <div className="reviews">
                            {product.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
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
