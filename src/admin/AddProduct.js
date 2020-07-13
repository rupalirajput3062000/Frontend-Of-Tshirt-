import React, { useState, useEffect } from 'react'
import Base from '../core/Base'
import { Link } from "react-router-dom"
import { getCategories, createaProduct } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';


function AddProduct() {

    const { user, token } = isAuthenticated();
    const [values, setValues] = useState({

        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: ""
    })

    const { name, description, stock, price, photo,
        categories,
        category,
        loading,
        error,
        createdProduct,
        getaRedirect,
        formData } = values;


    const preload = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({ ...values, categories: data.categories, formData: new FormData() })
            }
        })
    }

    useEffect(() => {
        preload()
    }, [])
    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({ ...values, [name]: value })
    }
    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true })
        createaProduct(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    photo: "",
                    loading: false,
                    createdProduct: data.name,
                    getaRedirect: true
                })
            }
        })
    }


    const successMessage = () => (
        <div className="alert alert-success mt-3" style={{ display: createdProduct ? "" : "none" }}>
            <h4>{createdProduct} successfully done</h4>
        </div>
    )

    const errorMessage = () => (
        <div className="alert alert-success mt-3" style={{ display: error ? "" : "none" }}>
            <h4>{error}</h4>
        </div>
    )

    const createProductForm = () => (
        <form >
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="photo"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories.length &&
                        categories.map((cate, index) => (
                            <option key={cate._id} value={cate._id}>{cate.name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="stock"
                    value={stock}
                />
            </div>

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success">
                Create Product
          </button>
        </form>
    );
    return (
        <Base title="Welcome to Add Products" description="Here you can add new Products" className="container bg-info p-3">
            <Link to="/admin/dashboard" className="btn btn-dark btn-md mb-3">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2 mb-3">
                    {successMessage()}
                    {errorMessage()}
                    {createProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default AddProduct
