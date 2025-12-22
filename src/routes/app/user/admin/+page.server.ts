import { UserServiceImpl } from "$lib/server/services/UserServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';
import type { User } from "$lib/shared/entities";

export const load: PageServerLoad = async ({ locals }) => {
    // Memanggil listUsers dari service
    const userService = new UserServiceImpl(locals.supabase);
    let users: User[] = [];
    try {
        users = await userService.listUsers();
    } catch (e) {
        console.error("Failed to load users:", e);
    }
    
    return { 
        users: toPOJO(users) 
    };
};