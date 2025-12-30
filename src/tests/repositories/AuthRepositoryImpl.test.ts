import { describe, it, expect, vi } from 'vitest';
import { AuthRepositoryImpl } from '$lib/server/repositories/AuthRepositoryImpl';
import { User } from '$lib/shared/entities';

describe('AuthRepositoryImpl', () => {

  it('should return null if userId is empty', async () => {
    const repo = new AuthRepositoryImpl();
    const result = await repo.getUserProfile({} as any, '');
    expect(result).toBeNull();
  });

  it('should fetch user profile and map to User entity', async () => {
    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: { id: 'u1', role: 'admin' },
              error: null
            })
          })
        })
      })
    } as any;

    vi.spyOn(User, 'fromJson').mockReturnValue({
      getRole: () => 'admin'
    } as any);

    const repo = new AuthRepositoryImpl();
    const profile = await repo.getUserProfile(supabase, 'u1');

    expect(profile).not.toBeNull();
    expect(profile?.getRole()).toBe('admin');
  });

  it('should return null when supabase returns error', async () => {
    const supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({
              data: null,
              error: new Error('DB error')
            })
          })
        })
      })
    } as any;

    const repo = new AuthRepositoryImpl();
    const profile = await repo.getUserProfile(supabase, 'u1');

    expect(profile).toBeNull();
  });

  it('should logout user', async () => {
    const signOut = vi.fn();

    const supabase = {
      auth: { signOut }
    } as any;

    const repo = new AuthRepositoryImpl();
    await repo.logout(supabase);

    expect(signOut).toHaveBeenCalledOnce();
  });
});
