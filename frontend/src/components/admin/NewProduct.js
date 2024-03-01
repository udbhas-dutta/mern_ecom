import React, { useEffect, useState } from 'react'
import './newProduct.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, createProduct } from '../../actions/productAction'
import { toast } from 'react-toastify'
import { Button, keyframes } from '@mui/material'
import MetaData from '../layout/MetaData'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Sidebar from './Sidebar'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'


const NewProduct = () => {

  const dispatch = useDispatch()

  const { loading, error, success } = useSelector((state) => state.newProduct)

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState(0)
  const [images, setImages] = useState([])
  const [imagesPreview, setImagesPreview] = useState([])

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "Smartphones",
  ]

  

  
  return (
    <>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType='multipart/form-data'
          >
            <h1>Create Product</h1>

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
                onChange={(e) => setPrice(e.target.value)} />
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
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <SdStorageIcon />
              <input type="number"
                placeHolder="Stock"
                required
                onChange={(e) => setStock(e.target.value)} />
            </div>

            <div id='createProductFormfile'>
              <input
                type="file"
                name='avatar'
                accept='image/*'
              />
            </div>

            <div id='createProductFormImage'>
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Avatar Preview" />
              ))}

            </div>

          </form>
        </div>
      </div>
    </>

  )
}

export default NewProduct
