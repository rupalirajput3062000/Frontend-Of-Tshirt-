import React, { useState, useEffect } from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { getCategories, deleteCategory } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'

function ManageCategories() {

    const [categories, setcategories] = useState([])

    const { user, token } = isAuthenticated();

    const getAllCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                console.log(data)
                setcategories(data.categories)
            }
        })
    }

    const deleteACategory = (category_id) => {
        deleteCategory(category_id, user._id, token).then(
            data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    getAllCategories();
                }
            }
        ).catch(err => console.log(err))
    }
    useEffect(() => {
        getAllCategories()
    }, [])

    return (
        <Base title="Welcome admin" description="Manage categories here">
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <h2 className="mb-4">All categories:</h2>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total {categories.length} categories</h2>

                    {categories.map((category, index) => {
                        return (
                            <div className="row text-center mb-2 " key={index} >
                                <div className="col-4">
                                    <h3 className="text-white text-left" >{category.name}</h3>
                                </div>
                                <div className="col-4">
                                    <Link
                                        className="btn btn-success"
                                        to={`/admin/category/update/${category._id}`}
                                    >
                                        <span className="">Update</span>
                                    </Link>
                                </div>
                                <div className="col-4">
                                    <button onClick={() => { deleteACategory(category._id) }} className="btn btn-danger">
                                        Delete
      </button>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </Base>
    )
}

export default ManageCategories
