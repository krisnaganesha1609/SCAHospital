import { describe, it, expect, vi } from 'vitest';
import { actions } from '../../../routes/auth/+page.server';
import { fail } from '@sveltejs/kit';

describe('auth login action', () => {

  it('should fail with 400 on invalid credentials', async () => {
    const request = {
      formData: async () =>
        new Map([
          ['email', 'test@mail.com'],
          ['password', 'wrong']
        ])
    };

    const supabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          error: { status: 400 }
        })
      }
    };

    const result = await actions.login({
      request: request as any,
      locals: { supabase }
    } as any);

    expect(result).toEqual(
      fail(400, { message: 'Invalid email or password' })
    );
  });

  it('should throw 500 on server error', async () => {
    const request = {
      formData: async () =>
        new Map([
          ['email', 'test@mail.com'],
          ['password', '123']
        ])
    };

    const supabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          error: { status: 500 }
        })
      }
    };

    await expect(
      actions.login({
        request: request as any,
        locals: { supabase }
      } as any)
    ).rejects.toThrow();
  });

  it('should redirect on successful login', async () => {
    const request = {
      formData: async () =>
        new Map([
          ['email', 'test@mail.com'],
          ['password', 'correct']
        ])
    };

    const supabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          error: null
        })
      }
    };

    await expect(
      actions.login({
        request: request as any,
        locals: { supabase }
      } as any)
    ).rejects.toMatchObject({
      status: 303
    });
  });
});
