import { AuthServiceImpl } from '$lib/server/services/AuthServiceImpl.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  locals.session = null;
  locals.user = null;
  locals.role = null;
  await new AuthServiceImpl().logout(locals.supabase);
  redirect(303, '/auth');
};