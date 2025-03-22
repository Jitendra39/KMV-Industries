import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/database/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, data } = req.body;
    console.log("Request body:", { id, data });

    // Add detailed logging for addresses
    console.log("Addresses detailed:", JSON.stringify(data.addresses, null, 2));

    // Check if the user exists
    const { data: existingUser, error: queryError } = await supabase
      .from("Users")
      .select("id")
      .eq("id", id)
      .single();

    if (queryError && queryError.code !== "PGRST116") {
      console.error("Error checking user existence:", queryError);
      throw queryError;
    }

    // Update name and phone in auth user profile
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      id,
      {
        user_metadata: {
          name: data.name,
          phone: data.phone
        }
      }
    );

    if (authUpdateError) {
      console.error("Error updating auth profile:", authUpdateError);
      throw authUpdateError;
    }

    // Prepare user data
    const shippingAddress =
      data.addresses.find(
        (addr: { type: string }) => addr.type === "Shipping"
      ) || null;
    const billingAddress =
      data.addresses.find(
        (addr: { type: string }) => addr.type === "Billing"
      ) || null;

    const userData = {
      authUserId: id, // This is the foreign key that references user auth data
      
      shipping_address: shippingAddress
        ? JSON.stringify(shippingAddress, null, 2)
        : null,
      billing_address: billingAddress
        ? JSON.stringify(billingAddress, null, 2)
        : null,
      role: "user",
    };

    // If user doesn't exist, add role field
    if (!existingUser) {
      userData.role = "user";
    }

    // Update or create user profile in the users table
    const { error: profileError } = await supabase
      .from("Users")
      .upsert(userData, {
        onConflict: "authUserId",
      });

    if (profileError) {
      console.error("Supabase error details:", profileError);
      throw profileError;
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    // Provide more detailed error information
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails = JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    );
    console.error("Detailed error:", errorDetails);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? errorDetails : undefined,
    });
  }
}
