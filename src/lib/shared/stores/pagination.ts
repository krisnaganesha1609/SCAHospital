import { writable } from "svelte/store";

export const patientPaginationStore = writable<{ currentPage: number; itemsPerPage: number}>({
    currentPage: 1,
    itemsPerPage: 7,
});

export const reservationPaginationStore = writable<{ currentPage: number; itemsPerPage: number }>({
    currentPage: 1,
    itemsPerPage: 7,
});

export const prescriptionPaginationStore = writable<{ currentPage: number; itemsPerPage: number }>({
    currentPage: 1,
    itemsPerPage: 7,
});

export const medicinePaginationStore = writable<{ currentPage: number; itemsPerPage: number }>({
    currentPage: 1,
    itemsPerPage: 7,
});

export const userPaginationStore = writable<{ currentPage: number; itemsPerPage: number }>({
    currentPage: 1,
    itemsPerPage: 7,
});