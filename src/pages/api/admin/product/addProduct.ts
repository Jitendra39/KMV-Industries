import { supabase } from '@/database/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const authAdmin = await adminAuth(userId)
  if(!authAdmin){
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    // Log the request body
    
    
    // Extract product data from request body
  const { name, image, description, price, quantity, size } = req.body;
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }


    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        image,
        description,
        price,
        quantity,
        size
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: 'Failed to add product', error: error.message || 'Unknown error' });
    }

    if (!product) {
      return res.status(400).json({ message: 'Failed to add product, no data returned' });
    }
 
    // Return success response
    return res.status(201).json({ 
      message: 'Product added successfully',
      product
    });
    
  } catch (error: any) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
}