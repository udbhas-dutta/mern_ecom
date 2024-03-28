import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import './productReviews.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearErrors,
  getAllReviews,
  deleteReview,
} from "../../actions/productAction"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import Sidebar from './Sidebar'
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../layout/MetaData'
import { DELETE_REVIEW_RESET } from '../../constants/productConstants'
import Star from '@mui/icons-material/Star'


const ProductReviews = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const { error: deleteError, isDeleted } = useSelector((state) => state.review)

  const { error, reviews, loading: updateLoading } = useSelector((state) => state.productReviews)

  const [productId, setProductId] = useState("")

  const deleteProductHandler = (id) => {

    // dispatch(deleteProduct(id))
  }

  const productReviewSubmitHandler = () => {

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
      toast.success("Review Deleted Successfully")
      dispatch({ type: DELETE_REVIEW_RESET })
      navigate('/admin/reviews')
    }
    dispatch(getAllReviews(productId))
  }, [dispatch, error, deleteError, isDeleted, navigate])

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 270,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.rating >= 3 ? "greenColor" : "redColor"
      }
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
            <Button onClick={() => deleteProductHandler(params.id, "id")}>
              <DeleteIcon />
            </Button>
          </>
        )
      }
    },
  ]

  const rows = []

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        rating: item.rating,
        comment: item.comment,
        name: item.user,
      })
    })

  return (
    <>
      <MetaData title={`All Reviews - Admin`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <form
            className="createProductForm"
            onSubmit={productReviewSubmitHandler}
          >
            <h1>All Reviews</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder='Name'
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)} />
            </div>

            <Button
              id='createProductBtn'
              type='submit'
              disabled={updateLoading ? true : false || productId === "" ? true : false}
            >
              Update
            </Button>
          </form>

          {reviews && reviews.length > 0 ? <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className='productListTable'
          /> : <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          }
        </div>
      </div>
    </>
  )
}

export default ProductReviews
