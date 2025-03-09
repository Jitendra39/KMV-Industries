


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
    const { id } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
 

  // Delete product from the database
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

 

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: 'Failed to update product', error: error.message || 'Unknown error' });
    }
 
    // Return success response
    return res.status(201).json({ 
      message: 'Product added successfully',
    });
    
  } catch (error: any) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
}