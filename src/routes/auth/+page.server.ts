import { redirect, error, fail } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      if (signInError.message === 'Invalid login credentials') {
        return fail(400, { errors: { message: 'Invalid email or password' } });
      }
      throw error(500, { message: 'Internal Server Error' })
    } else {
      redirect(303, '/auth/callback')
    }
  },
}