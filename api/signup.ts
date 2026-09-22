import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createRateLimiter } from '../lib/rateLimit';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

const ALLOWED_ORIGIN = 'https://trainwithdanny.org';

// 5 signups per 10 minutes per IP — generous for a real visitor, tight enough to blunt spam/scripted abuse
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return first?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

interface SignupBody {
  first_name: string;
  last_name: string;
  email: string;
  training_interest: string;
  phone?: string;
  player_age?: string | number;
  message?: string;
  trainer?: string;
}

const REQUIRED_FIELDS: (keyof SignupBody)[] = ['first_name', 'last_name', 'email', 'training_interest'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  if (isRateLimited(getClientIp(req))) {
    res.status(429).json({ success: false, error: 'Too many requests — please try again later.' });
    return;
  }

  const body = (req.body || {}) as Partial<SignupBody>;
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
}
