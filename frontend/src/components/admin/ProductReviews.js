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

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(reviewId, productId))
  }

  const productReviewSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(getAllReviews(productId))
  }

  useEffect(() => {

    if (productId.length === 24) {
      dispatch(getAllReviews(productId))
    }

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
  }, [dispatch, error, deleteError, isDeleted, navigate, productId])

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
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
            <Button onClick={() => deleteReviewHandler(params.id, "id")}>
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
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        name: item.name,
      })
    })

  return (
    <>
      <MetaData title={`All Reviews - Admin`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewSubmitHandler}
          >
            <h1 className='productReviewsFormHeading'>All Reviews</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder='Product ID'
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)} />
            </div>

            <Button
              id='createProductBtn'
              type='submit'
              disabled={updateLoading ? true : false || productId === "" ? true : false}
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (<DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className='productListTable'
            autoHeight
          />) : (<h1 className="productReviewsFormHeading">No Reviews Found</h1>)
          }
        </div>
      </div>
    </>
  )
}

export default ProductReviews
