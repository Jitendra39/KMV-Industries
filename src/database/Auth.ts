import {supabase} from './supabase';
 

export const signUp = async (email: string, password: string) => {
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        console.log("data",{data , error});
        if(error){
            throw error;
        }
        return { data };
    }catch(error: any){
        return { error };
    }
    
}

export const  signIn = async (email: string, password: string) => {
    try {
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
          
        
        if(error){
            throw error;
        }
        return { data };
    }catch(error: any){
        return { error };
    }
    
}


export const GoogleProvider = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/callback`,
        queryParams: {
          response_type: 'code', 
          prompt: 'consent',
          access_type: 'offline',
        },
      },
    });
  
    if (error) {
      console.error('Error signing in with Google:', error.message);
    } else {
      console.log('OAuth data:', data);
    }
  };

export let user: any = undefined;
  
export const getUser = async() => {
 
  const { data, error } = await supabase.auth.getUser();
     if(error){
        user = null;
        return null;
     }
   user = data;
    return user;
};

 