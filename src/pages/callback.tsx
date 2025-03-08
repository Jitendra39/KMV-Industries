import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/database/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) throw error;
 
            router.push('/');
          } catch (err : any) {
            console.error('Error setting session:', err.message);
          }
        } else {
          console.error('Missing tokens in hash fragment.');
        }
      }
    };

    handleAuth();
  }, [router]);

  return <div>Signing in... Please wait.</div>;
}
