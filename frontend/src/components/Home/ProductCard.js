import React from 'react'
import { Link } from 'react-router-dom'
import {Rating} from '@mui/material'


const ProductCard = ({ product }) => {
    const options = {
        size:"large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    console.log(product)
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            {product && <img src={product.images[0].url} alt={product.name} />}
            <p>{product.name}</p>
            <div>
                <Rating {...options} /> <span className='productCardSpan'>({product.numOfReviews})</span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    )
}

export default ProductCard
