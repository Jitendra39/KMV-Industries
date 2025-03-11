import { supabase } from "@/database/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Log the request body
    console.log("Request body:", req.body);

    // Extract product data and ID from request body
    const { id, name, image, images, description, price, quantity, size } = req.body;

    // Process images to create a flat array of URLs
    let processedImages: string[] = [];
    
    // Handle image data if it exists
    if (image) {
      // Process nested arrays and direct URLs
      if (Array.isArray(image)) {
        image.forEach(item => {
          if (Array.isArray(item)) {
            // Extract URLs from nested arrays
            if (item[1] && typeof item[1] === 'string') {
              processedImages.push(item[1]);
            }
          } else if (typeof item === 'string') {
            // Direct URL strings
            processedImages.push(item);
          }
        });
      }
    }
    
    // Similarly process the images array if it exists
    if (images && Array.isArray(images)) {
      images.forEach(item => {
        if (Array.isArray(item)) {
          if (item[1] && typeof item[1] === 'string') {
            processedImages.push(item[1]);
          }
        } else if (typeof item === 'string') {
          processedImages.push(item);
        }
      });
    }

    console.log("Product ID:", {
      id,
      name,
      image: processedImages, // Now a flat array of URLs
      description,
      price,
      quantity,
      size,
    });
    
    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check which fields are being updated
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (processedImages.length > 0) updateData.image = processedImages;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (size !== undefined) updateData.size = size;

    console.log("Update data:", updateData);

    // Update the product in the database
    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({
        message: "Failed to update product",
        error: error.message || "Unknown error",
      });
    }

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or no changes made" });
    }
    // Return success response
    return res.status(201).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
}
