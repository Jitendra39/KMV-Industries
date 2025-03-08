import { createClient } from '../../utils/supabase';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};


export default async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}





// import { createClient } from '../../utils/supabase';
// import { NextResponse } from 'next/server';

// export const config = {
//   runtime: 'edge',
// };

// export default async function GET(request: Request) {
   
//   console.log('request', request);
//   return new Response(JSON.stringify({
//     status: 200,
//     statusText: 'OK',
//   }), {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }