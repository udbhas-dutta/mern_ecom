import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'
import MetaData from '../layout/MetaData'


const Search = () => {
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
        } else {
            navigate("/products")
        }
    }

    return (
        <>
            <MetaData title="Search for a Product -- mern_ecom" />

            <form action="" className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder='Search for a product... '
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </>
    )
}

export default Search
