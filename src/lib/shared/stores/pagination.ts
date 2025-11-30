import { writable } from "svelte/store";

export const patientPaginationStore = writable<{ currentPage: number; itemsPerPage: number }>({
    currentPage: 1,
    itemsPerPage: 10,
});