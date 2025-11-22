import { toPOJO } from '$lib/shared/utils/Utils'
import type { LayoutServerLoad } from './$types'

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
