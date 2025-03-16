import { supabaseAdmin } from "@/database/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow DELETE requests
  // if (req.method !== 'DELETE') {
  //   return res.status(405).json({ error: 'Method not allowed' });
  // }

  try {
    // Verify admin authentication

    // Extract data from request
    const productimges = req.body;

    // Connect to database

    const productsCollection = supabaseAdmin.storage.from("images");

    console.log("Deleting images:", { productsCollection, productimges });

    // Extract image paths from URLs
    const imagesToDelete = productimges.images
      .map((imageUrl: any) => {
        const pathMatch = imageUrl.match(/\/public\/images\/(.+)$/);
        return pathMatch ? pathMatch[1] : null;
      })
      .filter(Boolean);

    if (imagesToDelete.length > 0) {
      const { data, error } = await productsCollection.remove(imagesToDelete);

      if (error) {
        throw new Error(`Failed to delete images: ${error.message}`);
      }

      console.log("Image(s) deleted successfully:", data);
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting images:", error);
    return res.status(500).json({ error: "Failed to delete images" });
  }
}
