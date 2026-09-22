const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ALLOWED_ORIGIN = 'https://trainwithdanny.org';
const REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'training_interest'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const missing = REQUIRED_FIELDS.filter(field => !String(body[field] || '').trim());
  if (missing.length) {
    res.status(400).json({ success: false, error: `Missing required field(s): ${missing.join(', ')}` });
    return;
  }

  const { error } = await supabase.from('signups').insert({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone || null,
    player_age: body.player_age ? Number(body.player_age) : null,
    training_interest: body.training_interest,
    message: body.message || null,
    trainer: body.trainer || null,
  });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.status(200).json({ success: true });
};
