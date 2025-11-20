import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const role = locals.role;

  if (!locals.session) {
    redirect(303, '/auth');
  }

  redirect(303, `/app/dashboard/${role?.toLowerCase()}`);
};
