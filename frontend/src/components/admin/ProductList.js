import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import './productList.css'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearErrors,
    getAdminProducts,
    deleteProduct,
} from "../../actions/productAction"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import Sidebar from './Sidebar'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'


const ProductList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const { error, products } = useSelector((state) => state.products)

    const { error: deleteError, isDeleted } = useSelector((state) => state.products)

    const deleteProductHandler = (id) => {

        dispatch(deleteProduct(id))
    }


    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            toast.success("Deleted Product Successfully")
            dispatch({ type: DELETE_PRODUCT_RESET })
            navigate('/admin/dashboard')
        }
        dispatch(getAdminProducts())
    }, [dispatch, error, deleteError, isDeleted, navigate])


    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/admin/product/${params.id}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteProductHandler(params.id, "id")}>
                            <DeleteIcon />
                        </Button>
                    </>
                )
            }
        },
    ]

    const rows = []

    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.Stock,
                price: item.price,
                name: item.name,
            })
        })



    return (
        <>
            <MetaData title={`All Products - Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id='productListHeading'>All Products</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                    />
                </div>
            </div>
        </>
    )
}

export default ProductList
