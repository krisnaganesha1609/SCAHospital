import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'
import { AuthServiceImpl } from '$lib/server/services/AuthServiceImpl'

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    try {
      const enriched = await new AuthServiceImpl().getEnrichedSessionFromClient(event.locals.supabase);
      console.log('Enriched session:', enriched);
      event.locals.session = enriched.session;
      event.locals.user = enriched.user;
      event.locals.profile = enriched.profile;
      event.locals.role = enriched.role;
      return enriched;
    }
    catch (error) {// on error, ensure locals are null
      event.locals.session = null;
      event.locals.user = null;
      event.locals.profile = null;
      event.locals.role = null;
      return { session: null, user: null, profile: null, role: null };
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user, profile, role } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user
  event.locals.profile = profile
  event.locals.role = role

  if (!event.locals.session && event.url.pathname.startsWith('/app')) {
    redirect(303, '/auth')
  }

  if (event.locals.session && event.url.pathname === '/auth') {
    redirect(303, `/app/dashboard/${role?.toLowerCase()}`)
  }

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)