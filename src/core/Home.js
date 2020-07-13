import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getAllProducts } from "./helper/coreapicalls";


export default function Home() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProducts = () => {
    return (
      getAllProducts().then(data => {
        if (data.error) {
          setError(data.error);
        }
        else {
          setProducts(data);
        }
      })
    )
  }

  useEffect(() => {
    loadAllProducts();
  }, [])

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store">
      <h1 className="text-white text-center">All Products</h1>
      <div className="row">
        {products.map((product, index) => {
          return (
            <div className="col-4 mb-3" key={index}>
              <Card product={product} />
            </div>
          )
        })}
      </div>
    </Base>
  );
}
