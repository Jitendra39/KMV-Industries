import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/database/supabase";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable body parsing to handle form data manually
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authAdmin = await adminAuth(userId)
  if(!authAdmin){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    console.log("Processing upload...");

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(
        req,
        (err: Error, fields: formidable.Fields, files: formidable.Files) => {
          if (err) reject(err);
          resolve([fields, files]);
        }
      );
    });

    // ...existing code...
    console.log("Fields:", fields);
    console.log("Files:", files);
    // Extract product ID from the form fields or generate one
    const productId = fields.productId
      ? String(fields.productId)
      : `product_${Date.now()}`;

    // Handle multiple files (or a single file)
    const fileItems = files.images; // Changed from files.files to files.images
    const uploadedUrls: string[] = [];

    // Check if fileItems is an array or a single item
    const fileItemsArray = Array.isArray(fileItems)
      ? fileItems
      : fileItems
        ? [fileItems]
        : [];

    for (const fileItem of fileItemsArray) {
      if (fileItem && fileItem.filepath) {
        const fileData = fs.readFileSync(fileItem.filepath);
        const fileName =
          fileItem.originalFilename ||
          `${Date.now()}_${path.basename(fileItem.filepath)}`;

        // Upload to Supabase bucket
        console.log(`Uploading ${fileName} for product ${productId}...`);
        const { data, error } = await supabaseAdmin.storage
          .from("images") // Replace with your bucket name
          .upload(`${productId}/${fileName}`, fileData, {
            contentType: fileItem.mimetype || "image/jpeg",
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          return res.status(500).json({ error: error.message });
        }

        if (data) {
          // Generate public URL
          const { data: urlData } = supabaseAdmin.storage
            .from("images")
            .getPublicUrl(`${productId}/${fileName}`);

          uploadedUrls.push(urlData.publicUrl);
        }
      }
    }

    console.log("Uploaded URLs:", uploadedUrls);
    console.log("Product ID:", productId);
    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      urls: uploadedUrls,
      productId,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return res.status(500).json({ error: "Failed to upload images" });
  }
}
