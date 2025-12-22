import { UserServiceImpl } from "$lib/server/services/UserServiceImpl";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ url, locals }) => {
    const id = url.searchParams.get('id');
    if (!id) throw error(400, "User ID is required");

    const userService = new UserServiceImpl(locals.supabase);
    
    // Mengambil list dan mencari user yang sesuai UUID
    const allUsers = await userService.listUsers();
    const user = allUsers.find(u => u.getUserId() === id);

    if (!user) throw error(404, "User not found");

    return {
        user: toPOJO(user)
    };
};

export const actions: Actions = {
    updateUser: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        // Membungkus data baru untuk dikirim ke service
        const userData = {
            full_name: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            role: formData.get('role')
        };

        const userService = new UserServiceImpl(locals.supabase);
        
        try {
            await userService.updateUser(id, userData);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Update failed" };
        }
    }
};