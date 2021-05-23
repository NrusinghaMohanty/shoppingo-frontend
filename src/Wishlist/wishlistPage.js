import React from 'react'
import axios from "axios"
import { useEffect,useState } from "react"
import { useWishlist } from "../Context/wishlistContext"
import "./wishlistpage.css"
import Navbar from "../Component/Navbar/navbar"
import Loader from "react-loader-spinner"

const Wishlist = () => {

    const { wishlistdispatch,itemInwishlist } = useWishlist()
    const [loader,showLoader] = useState(false)
    
    useEffect(() => {
      (async () => {
        try{
         showLoader(true) 
        const { wishlistProduct: wishlistdata } = await axios
          .get("https://e-commerce.nrusingha.repl.co/wishlist")
          .then((response) => {
            console.log(response.data)  
            return response.data;
          });
      wishlistdispatch({type:"fetch",payload:wishlistdata})
      showLoader(false)
      }catch{
        console.error("error")
      }})
    ();
    }, []);

      const removeFromwishlist = (id) => {
        (async () => {
          const {  success , wishlistProduct: data } = await axios
            .delete(`https://e-commerce.nrusingha.repl.co/wishlist/${id}`)
            .then((response) => {
              return response.data;
            });
          if (success) {
            wishlistdispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
          } else {
            console.log("error occured while removing item");
          }
        })();
      };


      function showWishlist (item) {
        return (
            <>
            
             <div className="wishlist-product">
                <div className="wishlist-img">
                 <img src={item.url} />
                 </div>
                 <div className="wishlist-text">
                 <p>{item.name}</p>
                 <small>Price : ${item.price}</small>
                 <button onClick={()=>removeFromwishlist(item._id)}>Remove</button>
                 </div>
             </div>
             

            </>
        )
      }

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
          <div className="wishlist-container">
           {itemInwishlist.map(showWishlist)}
           </div>
        </>
    )
}

export default Wishlist