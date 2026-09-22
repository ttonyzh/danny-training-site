import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  return { insertMock, fromMock };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}));

import handler from '../api/signup';

function createRes() {
  const res: any = {};
  res.status = vi.fn((code: number) => { res.statusCode = code; return res; });
  res.json = vi.fn((payload: any) => { res.body = payload; return res; });
  res.end = vi.fn(() => res);
  res.setHeader = vi.fn();
  return res as VercelResponse & { statusCode?: number; body?: any };
}

function createReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return { method: 'POST', body: {}, ...overrides } as VercelRequest;
}

const validBody = {
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@example.com',
  training_interest: 'Private Training',
};

describe('api/signup handler', () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
  });

  it('responds 204 to an OPTIONS preflight without touching the database', async () => {
    const req = createReq({ method: 'OPTIONS' });
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects non-POST methods with 405', async () => {
    const req = createReq({ method: 'GET' });
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('returns 400 and lists every missing required field', async () => {
    const req = createReq({ body: { first_name: 'Jane' } });
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body.error).toContain('last_name');
    expect(res.body.error).toContain('email');
    expect(res.body.error).toContain('training_interest');
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('inserts a valid signup and returns 200', async () => {
    insertMock.mockResolvedValueOnce({ error: null });
    const req = createReq({
      body: { ...validBody, phone: '555-1234', player_age: '14', trainer: 'Danny' },
    });
    const res = createRes();

    await handler(req, res);

    expect(fromMock).toHaveBeenCalledWith('signups');
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        training_interest: 'Private Training',
        phone: '555-1234',
        player_age: 14, // coerced from string to number
        trainer: 'Danny',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body).toEqual({ success: true });
  });

  it('defaults omitted optional fields to null', async () => {
    insertMock.mockResolvedValueOnce({ error: null });
    const req = createReq({ body: validBody });
    const res = createRes();

    await handler(req, res);

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ phone: null, player_age: null, message: null, trainer: null })
    );
  });

  it('returns 500 with the database error message when the insert fails', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'connection refused' } });
    const req = createReq({ body: validBody });
    const res = createRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.error).toBe('connection refused');
  });
});
