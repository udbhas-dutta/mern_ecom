import React, { useEffect } from 'react'
import Sidebar from './Sidebar.js'
import './dashboard.css'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Chart from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../actions/productAction.js'

const Dashboard = () => {

    const { products } = useSelector((state) => state.products)
    const dispatch = useDispatch()


    let outOfStock = 0;

    products &&
        products.forEach((item) => {
            if (item.Stock === 0) {
                outOfStock++;
            }
        })

    useEffect(() => {
        dispatch(getAdminProducts())
    }, [dispatch])

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "Total Amount",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197,72,49)"],
                data: [0, 4000],
            }
        ],
    }

    const doughnutState = {
        labels: ["Out of Stock", "In Stock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock],
            }
        ]
    }

    return (
        <div className='dashboard'>
            <Sidebar />

            <div className="dashboardContainer">

                <Typography component="h1">Dashboard</Typography>

                <div className="dashboardSummary">
                    <div>
                        <p>
                            Total Amount <br /> ₹2000
                        </p>
                    </div>
                    <div className="dashboardSummaryBox2">
                        <Link to="/admin/products">
                            <p>Products</p>
                            <p>{products && products.length}</p>
                        </Link>
                        <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>4</p>
                        </Link>
                        <Link to="/admin/users">
                            <p>Users</p>
                            <p>2</p>
                        </Link>
                    </div>
                </div>

                <div className="linechart">
                    <Line data={lineState} />
                </div>

                <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                </div>

            </div>
        </div>
    )
}

export default Dashboard
