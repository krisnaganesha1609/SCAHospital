import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user, profile, role } = await safeGetSession()
  return {
    session,
    user,
    profile,
    role,
    cookies: cookies.getAll(),
  }
}