import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@1.0.0"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers }
      );
    }

    const { to, from, subject, html } = await req.json()
    
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable')
    }

    if (!to || !from || !subject || !html) {
      throw new Error('Missing required fields: to, from, subject, html')
    }

    const resend = new Resend(RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }, 
        status: 500 
      }
    )
  }
})