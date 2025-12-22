import { UserServiceImpl } from "$lib/server/services/UserServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ locals }) => {
    // Memanggil listUsers dari service
    const userService = new UserServiceImpl();
    
    // Note: Karena di kode Anda listUsers masih throw Error, 
    // pastikan di service aslinya sudah melakukan query ke database.
    let users = [];
    try {
        users = await userService.listUsers();
    } catch (e) {
        console.error("Failed to load users:", e);
    }
    
    return { 
        users: toPOJO(users) 
    };
};