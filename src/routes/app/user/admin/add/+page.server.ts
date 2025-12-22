import { UserServiceImpl } from '$lib/server/services/UserServiceImpl';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { toPOJO } from '$lib/shared/utils/Utils';
import type { roles } from '$lib/shared/types/type_def';

// Untuk halaman create biasanya tidak butuh load user tertentu.
// Namun jika mau mengirim data lain (mis. daftar role dari server) bisa di-return di load.

export const load: PageServerLoad = async () => {
	// nothing required for now; keep for future additions
	return {};
};

export const actions: Actions = {
	createUser: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = (formData.get('email') || '').toString().trim();
		const fullName = (formData.get('fullName') || '').toString().trim();
		const phone = (formData.get('phone') || '').toString().trim();
		const role = (formData.get('role')) as roles;
		const password = (formData.get('password') || '').toString();
		const confirmPassword = (formData.get('confirmPassword') || '').toString();

		// basic server-side validation
		if (!email || !fullName || !role || !password) {
			return { success: false, message: 'Missing required fields' };
		}
		if (password !== confirmPassword) {
			return { success: false, message: 'Password mismatch' };
		}

		const userService = new UserServiceImpl(locals.supabase);

		try {
			await userService.createUser(fullName, password, role, phone, email);
			return { success: true };
		} catch (e) {
			console.error('createUser failed', e);
			return { success: false, message: 'Create user failed' };
		}
	}
};
