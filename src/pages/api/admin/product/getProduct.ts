import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/database/supabase';
 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data: products, error } = await supabase.from('products').select('*');

    if (error) {
      throw error;
    }

    return res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
}
