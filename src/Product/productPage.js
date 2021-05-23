import React from 'react'
import axios from "axios"
import { useEffect, useReducer , useState } from "react"
import "./productPage.css"
import { useProduct } from '../Context/productContext'
import { useCart } from "../Context/cartContext"
import { useWishlist } from '../Context/wishlistContext'
import Navbar from '../Component/Navbar/navbar'
import filterReducer from '../Reducer/filterReducer'
import sortingHandler from "../Function/sortingHandler"
import filterHandler from "../Function/filterHandler"
import Loader from "react-loader-spinner"

const Product = () => {
  const { dispatch, product } = useProduct()
  const { cartdispatch } = useCart()
  const { wishlistdispatch , itemInwishlist} = useWishlist()
  const [{ sortBy, stockBy, deliveryBy }, sortDispatch] = useReducer(filterReducer, { sortBy: null, stockBy: true, deliveryBy: false })
  const [loader,showLoader] = useState(false)

  useEffect(() => {
    (async () => {
      try{
       showLoader(true) 
      const { product: productdata } = await axios
        .get("https://e-commerce.nrusingha.repl.co/product")
        .then((response) => {
          return response.data;
        });
        dispatch({ type: "fetch", payload: productdata })
        showLoader(false);
    }catch{
      console.error("error")
    }

    }
    )();
  }, []);

  // function isInWishList(id){
  //   return itemInwishlist.some(product=>product._id===id)
  //   console.log(itemInwishlist)
  // }

  function showproducts(item) {
    return (
      <div className="col-4">
        <img src={item.url} />
        <div className="header-z">
          <h4>{item.name}</h4>
          <p>₹ {item.price}</p>
          <a href="#" onClick={() => addTocart(item)} className="btn addcart"><i className="fas fa-shopping-cart "></i></a>
          {/* <span style={{background:isInWishList(item._id)?"red":"black"}}> */}
              <a href="#" onClick={() => addTowishlist(item)} className="btn wishlist"><i class="fas fa-heart"></i></a>
          {/* </span> */}
        </div>
      </div>
    );
  }


  const addTocart = (item) => {
    (async () => {
      const { success, savecartProduct: data } = await axios
        .post("https://e-commerce.nrusingha.repl.co/cart", {
          _id: item._id,
          info: item.info,
          name: item.name,
          price: item.price,
          quantity: 1,
          url: item.url,
          fastdelivery: item.fastdelivery,
          instock: item.instock
        })
        .then((response) => {
          return response.data;
        });
      if (success) {
        cartdispatch({ type: "ADD_TO_CART", payload: item });
      } else {
        console.log("error");
      }
    })();
  };

  const addTowishlist = (item) => {
       
      (async () => {
      const { success, savewishlistProduct: data } = await axios
        .post("https://e-commerce.nrusingha.repl.co/wishlist", {
          _id: item._id,
          info: item.info,
          name: item.name,
          price: item.price,
          quantity: 1,
          url: item.url,
          fastdelivery: item.fastdelivery,
          instock: item.instock
        })
        .then((response) => {
          return response.data;
        });
      if (success) {
        wishlistdispatch({ type: "ADD_TO_WISHLIST", payload: item });
      } else {
        console.log("error"); 
      }
    })();
  };


  const sortedData = sortingHandler(product, sortBy)
  const filterData = filterHandler(sortedData, stockBy, deliveryBy)


  return loader ?(
    <>
    <Navbar />

    <div className="loader">
      <Loader type="ThreeDots" color="grey" height={80} width={80} />
    </div>
    </>
  ):(
    <>
      <Navbar />
      <div className="allproduct-container">
        <div className="allproduct-heading row-2">
          <h2>All Product</h2>
          <div>
            <select onChange={(e) => sortDispatch({ type: e.target.value })}>
              <option value="DEFAULT_FILTER">Default Shorting</option>
              <option value="IN_STOCK">In stock</option>
              <option value="FAST_DELIVERY">fast delivery</option>
            </select>
            <select onChange={(e) => sortDispatch({ type: "SORT", payload: e.target.value })}>
              <option>Default Shorting</option>
              <option value="HIGH_TO_LOW" >High to Low</option>
              <option value="LOW_TO_HIGH">Low to High</option>
            </select>
          </div>
        </div>
        <div className="allproduct-heading">
          {filterData.map(showproducts)}
        </div>
      </div>
    </>
  )
}

export default Product;
