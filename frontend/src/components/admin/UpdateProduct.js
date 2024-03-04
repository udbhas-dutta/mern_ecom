import React, { useEffect, useState } from 'react'
import './updateProduct.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, updateProduct, getProductDetails } from '../../actions/productAction'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Sidebar from './Sidebar'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateProduct = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { error, product } = useSelector((state) => state.productDetails)

    const { loading, error: updateError, isUpdated } = useSelector((state) => state.products)

    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "Smartphone",
    ]

    const { productId } = useParams()
    console.log(productId)

    useEffect(() => {

        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId))
        } else {
            setName(product.name);
            setDescription(product.description)
            setPrice(product.price)
            setCategory(product.category)
            setStock(product.Stock)
            setOldImages(product.images)
        }
        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            toast.success("Product Updated Successfully");
            navigate('/admin/products')
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }
    }, [dispatch, error, navigate, isUpdated, productId, product, updateError])

    const updateProductSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("category", category);
        myForm.set("description", description);
        myForm.set("Stock", stock);

        images.forEach((image) => {
            myForm.append("images", image);
        })
        dispatch(updateProduct(productId, myForm))
    }

    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files)

        setImages([]);
        setImagesPreview([]);
        setOldImages([])

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result])
                    setImages((old) => [...old, reader.result])
                }
            }
            reader.readAsDataURL(file);
        })
    }

    return (
        <>
            <MetaData title="Update Product Details" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType='multipart/form-data'
                        onSubmit={updateProductSubmitHandler}
                    >
                        <h1>Update Product </h1>

                        <div>
                            <SpellcheckIcon />
                            <input
                                type="text"
                                placeholder='Product Name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <AttachMoneyIcon />
                            <input
                                type="number"
                                placeholder='Price'
                                required
                                onChange={(e) => setPrice(e.target.value)}
                                value={price} />

                        </div>

                        <div>
                            <DescriptionIcon />
                            <textarea
                                placeholder='Product Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                cols="30"
                                rows="1" />
                        </div>

                        <div>
                            <AccountTreeIcon />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <StorageIcon />
                            <input type="number"
                                placeholder="Stock"
                                required
                                onChange={(e) => setStock(e.target.value)}
                                value={stock} />
                        </div>

                        <div id='createProductFormFile'>
                            <input
                                type="file"
                                name='avatar'
                                accept='image/*'
                                onChange={updateProductImagesChange}
                                multiple
                            />
                        </div>

                        <div id='createProductFormImage'>
                            {oldImages && oldImages.map((image, index) => (
                                <img key={index} src={image.url} alt="Old Product Preview" />
                            ))}

                        </div>

                        <div id='createProductFormImage'>
                            {imagesPreview.map((image, index) => (
                                <img key={index} src={image} alt="Product Preview" />
                            ))}

                        </div>

                        <Button
                            id='createProductBtn'
                            type='submit'
                            disabled={loading ? true : false}
                        >
                            Update
                        </Button>

                    </form>
                </div>
            </div>
        </>

    )
}

export default UpdateProduct
