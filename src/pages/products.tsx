import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import ProductsContent from "@/components/products-content";
import ProductsFilter from "@/components/products-filter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../layouts/Main";
import { user } from "@/database/Auth";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    
    console.log("user", user);
     fetch('/api/admin/product/getProduct')
       .then(response => response.json())
       .then(data => {
         // Convert legacy 'image' field to 'images' array for backward compatibility
         const updatedProducts = data.products.map((product: any) => ({
           ...product,
           images: product.images || (product.image ? [product.image] : []),
         }));
         console.log("updatedProducts",updatedProducts);
         setProducts(updatedProducts);
       })
       .catch(_ => {
         toast.error('Error fetching products');
       });
   }, []);
  return (
  <Layout>
    <Breadcrumb />
    <section className="products-page">
      <div className="container">
        <ProductsFilter />
        <ProductsContent />
      </div>
    </section>
    <Footer />
  </Layout>
  )
}

export default Products;
