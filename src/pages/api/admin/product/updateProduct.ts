


import { supabase } from '@/database/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log the request body
    console.log('Request body:', req.body);
    
    // Extract product data and ID from request body
    const { id, name, image, description, price, quantity, size } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check which fields are being updated
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (size !== undefined) updateData.size = size;

    // Update the product in the database
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: 'Failed to update product', error: error.message || 'Unknown error' });
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found or no changes made' });
    }
    // Return success response
    return res.status(201).json({ 
      message: 'Product added successfully',
      // product
    });
    
  } catch (error: any) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
}