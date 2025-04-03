export async function testEmailFunction() {
  try {
    const response = await fetch('https://tppyrujrnnifwoyxewky.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        to: 'test@example.com', // Replace with your test email
        from: 'SkillXchange <notifications@skillxchange.com>',
        subject: 'Test Email from SkillXchange',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Test Email</h1>
            <p>This is a test email from SkillXchange.</p>
            <p>If you're receiving this, the email function is working correctly!</p>
          </div>
        `
      })
    });

    const data = await response.json();
    console.log('Email function response:', data);
    return data;
  } catch (error) {
    console.error('Error testing email function:', error);
    throw error;
  }
}