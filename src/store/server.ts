"use server";
import { supabase } from "@/database/supabase";

export const adminAuth = async (id: any) => {
  const { data: user, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching admin:', error);
    return false;
  }
  
  if (user && (user.role === "admin" || user.role === "superadmin")) {
    return true;
  } else {
    return false;
  }
}
