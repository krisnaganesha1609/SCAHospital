import { UserServiceImpl } from '$lib/server/services/UserServiceImpl';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { toPOJO } from '$lib/shared/utils/Utils';
import type { roles } from '$lib/shared/types/type_def';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
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

		const userService = new UserServiceImpl(locals.supabase);
        let isSuccess = false;

        try {
            await userService.createUser(fullName, password, role, phone, email);
            isSuccess = true;
        } catch (e) {
            console.error('createUser failed', e);
            return { success: false, message: 'Create user failed' };
        }

        if (isSuccess) {
            throw redirect(303, '/app/user/admin');
        }
	}
};
