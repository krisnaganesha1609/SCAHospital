import { writable } from "svelte/store";

export const patientPaginationStore = writable<{ pageNumber: number; itemsPerPage: number }>({
    pageNumber: 1,
    itemsPerPage: 10,
});