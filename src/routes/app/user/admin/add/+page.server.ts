import { UserServiceImpl } from '$lib/server/services/UserServiceImpl';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { toPOJO } from '$lib/shared/utils/Utils';
import type { roles } from '$lib/shared/types/type_def';
import { fail, redirect } from '@sveltejs/kit';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';

export const load: PageServerLoad = async () => {
    return {};
};

export const actions: Actions = {
    createUser: async ({ request, locals, url }) => {
        const formData = await request.formData();
        const email = (formData.get('email') || '').toString().trim();
        const fullName = (formData.get('fullName') || '').toString().trim();
        const phone = (formData.get('phone') || '').toString().trim();
        const role = (formData.get('role')) as roles;
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();

        if (!email || !fullName || !role || !password) {
            return fail(400, { success: false, message: 'Missing required fields' });
        }

        // 2. Validasi Panjang Password (Supabase Standard)
        if (password.length < 6) {
            return fail(400, { success: false, message: 'Password must be at least 6 characters' });
        }

        // 3. Validasi Match
        if (password !== confirmPassword) {
            return fail(400, { success: false, message: 'Password mismatch' });
        }

        const userService = new UserServiceImpl(locals.supabase);
        let isSuccess = false;

        try {
            const userId = await userService.createUser(fullName, password, role, phone, email);
            isSuccess = true;
            const logs: AuditLogsRequest = new AuditLogsRequest(
                locals.user?.id || '',
                'create',
                'users',
                userId,
                ''
            );

            const auditResponse = await fetch(`${url.origin}/api/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logs)
            });

            if (!auditResponse.ok) {
                console.error('Failed to record audit log for creating users');
            }
        } catch (e: any) {
            console.error('createUser failed', e);
            return fail(500, { success: false, message: e.message || 'Create user failed' });
        }

        if (isSuccess) {
            throw redirect(303, '/app/user/admin');
        }
    }
};
