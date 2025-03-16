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
    console.log('Request body:', req.body);
    
    // Extract product data and ID from request body
    const { id } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // First, get the product to retrieve image paths
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching product:', fetchError);
      return res.status(400).json({ message: 'Failed to fetch product', error: fetchError.message });
    }

    // Delete images from storage if they exist
    if (product && product.image && product.image.length > 0) {
      const imagePaths = product.image.map((image: any) => {
        // Check if the image is actually a string before splitting
        if (typeof image === 'string') {
          // Extract the file path from the full URL if needed
          const path = image.split('/').slice(-2).join('/'); // Assumes format like "products/filename.jpg"
          return path;
        }
        console.error('Non-string image found:', image);
        return null;
      }).filter(Boolean); // Remove any null values
      
      try {
        // Delete the files from storage
        const { error: deleteStorageError } = await supabase.storage
          .from('products')
          .remove(imagePaths);
          
        if (deleteStorageError) {
          console.error('Error deleting images:', deleteStorageError);
          // Continue with product deletion even if image deletion fails
        }
      } catch (storageError) {
        console.error('Error in storage operation:', storageError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from the database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: 'Failed to delete product', error: error.message || 'Unknown error' });
    }
 
    // Return success response
    return res.status(200).json({ 
      message: 'Product deleted successfully',
    });
    
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}














// import { supabase } from '@/database/supabase';
// import { NextApiRequest, NextApiResponse } from 'next';
 

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Only allow POST method
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     // Log the request body
//     console.log('Request body:', req.body);
    
//     // Extract product data and ID from request body
//     const { id } = req.body;

//     // Validate required fields
//     if (!id) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }
 

//   // Delete product from the database
//   const { data, error } = await supabase
//     .from('products')
//     .delete()
//     .eq('id', id);

 

//     if (error) {
//       console.error('Supabase error:', error);
//       return res.status(400).json({ message: 'Failed to update product', error: error.message || 'Unknown error' });
//     }
 
//     // Return success response
//     return res.status(201).json({ 
//       message: 'Product added successfully',
//     });
    
//   } catch (error: any) {
//     console.error('Error adding product:', error);
//     return res.status(500).json({ message: 'Error adding product', error: error.message });
//   }
// }