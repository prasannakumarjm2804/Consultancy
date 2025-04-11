import React, { useState } from "react";
import axios from "axios";
import "../styles/AddMarketplacePage.css";
import AdminLayout from "../components/AdminLayout";

const AddMarketplacePage = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleAddProduct = async () => {
    try {
      const response = await axios.post("http://localhost:5000/marketplace", {
        productName,
        description,
        price,
        image,
      });
      console.log("Product added:", response.data);
      // Reset form fields
      setProductName("");
      setDescription("");
      setPrice("");
      setImage("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="add-marketplace-container">
        <h1>Add Marketplace Product</h1>
        <form>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button type="button" onClick={handleAddProduct}>
            Add Product
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddMarketplacePage;
