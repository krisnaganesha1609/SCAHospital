import { UserServiceImpl } from "$lib/server/services/UserServiceImpl";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ url, locals }) => {
    const id = url.searchParams.get('id');
    if (!id) throw error(400, "User ID is required");

    const userService = new UserServiceImpl(locals.supabase);
    const allUsers = await userService.listUsers();
    const user = allUsers.find(u => u.getUserId() === id);

    if (!user) throw error(404, "User not found");

    return { user: toPOJO(user) };
};

export const actions: Actions = {
    updateUser: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        const userData = {
            // Sesuaikan key dengan yang diharapkan UserServiceImpl (snake_case)
            full_name: formData.get('fullName')?.toString(),
            phone: formData.get('phone')?.toString(),
            email: formData.get('email')?.toString(),
            role: formData.get('role')?.toString()
        };

        const userService = new UserServiceImpl(locals.supabase);
        
        try {
            await userService.updateUser(id, userData);
            return { success: true }; // Berhasil
        } catch (e) {
            console.error("Server Action Error:", e);
            return { success: false, message: "Update failed" };
        }
    },

    deleteUser: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const userService = new UserServiceImpl(locals.supabase);

        let isSuccess = false;
        try {
            await userService.deleteUser(id);
            isSuccess = true;
        } catch (e) {
            console.error("Delete Error:", e);
            return { success: false, message: "Delete failed" };
        }

        // Redirect dilakukan DI LUAR try-catch agar tidak tertangkap sebagai error
        if (isSuccess) {
            throw redirect(303, '/app/user/admin');
        }
    }
};