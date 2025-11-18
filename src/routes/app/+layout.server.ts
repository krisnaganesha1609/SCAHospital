import type { LayoutServerLoad } from './$types'
function toPOJO<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user, profile, role } = await safeGetSession()
  return {
    session: toPOJO(session),
    user: toPOJO(user),
    profile: toPOJO(profile),
    role: toPOJO(role),
    cookies: cookies.getAll()
  }
}
