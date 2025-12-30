import { describe, it, expect, vi } from 'vitest';
import { AuthServiceImpl } from '$lib/server/services/AuthServiceImpl';
import { AuthRepositoryImpl } from '$lib/server/repositories/AuthRepositoryImpl';

describe('AuthServiceImpl', () => {

  it('should return empty enriched session if session or user missing', async () => {
    const service = new AuthServiceImpl({} as any);
    const result = await service.enrichSession(null, null);

    expect(result).toEqual({
      session: null,
      user: null,
      profile: null,
      role: null
    });
  });

  it('should enrich session with profile and role', async () => {
    vi.spyOn(AuthRepositoryImpl.prototype, 'getUserProfile')
      .mockResolvedValue({
        getRole: () => 'admin'
      } as any);

    const service = new AuthServiceImpl({} as any);

    const result = await service.enrichSession(
      { access_token: 'token' },
      { id: 'user-1' }
    );

    expect(result.role).toBe('admin');
    expect(result.profile).not.toBeNull();
  });

  it('should logout via repository', async () => {
    const spy = vi
      .spyOn(AuthRepositoryImpl.prototype, 'logout')
      .mockResolvedValue();

    const service = new AuthServiceImpl({} as any);
    await service.logout();

    expect(spy).toHaveBeenCalledOnce();
  });
});
