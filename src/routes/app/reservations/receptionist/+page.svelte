<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { Reservation } from '$lib/shared/entities';
	import type { Reservation as ReservationClass } from '$lib/shared/entities';
	import * as Accordion from '$lib/components/ui/accordion';
	import { format } from 'date-fns';
	import { writable, derived, get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import type { reservationStatus } from '$lib/shared/types/type_def';
	import MedicalRecordCard from '$lib/shared/components/MedicalRecordCard.svelte';
	import { reservationPaginationStore } from '$lib/shared/stores/pagination';

	/* =========================================================
	   INITIAL DATA
	========================================================= */
	let { data }: PageProps = $props();
	const reservations: ReservationClass[] = data.reservations.map((r) => Reservation.fromPOJO(r));

	/* =========================================================
	   FILTER / STATUS TABS
	========================================================= */
	const STATUS_TABS = [
		'Booked',
		'Checked In',
		'Done',
		'Cancelled',
		'No Show'
	] as reservationStatus[];
	type StatusTab = reservationStatus | 'All';

	const statusFilter = writable<StatusTab>('Booked');

	/* =========================================================
	   PAGINATION (no legacy $: — Svelte 5 compliant)
	========================================================= */
	// const PAGE_SIZE = 10;
	// const currentPage = writable(1);
	let { itemsPerPage, currentPage } = $reservationPaginationStore;
	const perPage = itemsPerPage;
	let siblingCount = 1;

	const totalResults = reservations.length;
	const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

	// Filtered list (based on status tab)
	const filteredReservations = derived(statusFilter, ($status) => {
		if (!$status || $status === 'All') return reservations;
		return reservations.filter(
			(r) => String(r.getStatus()).toLowerCase() === String($status).toLowerCase()
		);
	});

	const searchQuery = writable('');

	// Paginated + filtered output
	const displayedReservations = derived(
		[filteredReservations, reservationPaginationStore, searchQuery],
		([$filtered, $current, $searchQuery]) => {
			if ($searchQuery.trim() !== '') {
				const query = $searchQuery.toLowerCase();
				return $filtered.filter((r) => {
					const patientName = r.getPatient().getFullName().toLowerCase();
					const medicalRecordNumber = r.getPatient().getMedicalRecordNumber().toLowerCase();
					return patientName.includes(query) || medicalRecordNumber.includes(query);
				});
			}
			const start = ($current.currentPage - 1) * perPage;
			const end = Math.min(start + perPage, totalResults);
			return $filtered.slice(start, end);
		}
	);

	// Reset page to 1 when filter changes
	statusFilter.subscribe(() => {
		reservationPaginationStore.update((store) => ({ ...store, currentPage: 1 }));
	});

	// Generate page numbers (same logic as before)
	// function getPageNumbers(current: number, total: number): (number | '...')[] {
	// 	const pages: (number | '...')[] = [];
	// 	if (total <= 7) {
	// 		for (let i = 1; i <= total; i++) pages.push(i);
	// 		return pages;
	// 	}
	// 	pages.push(1);
	// 	if (current > 4) pages.push('...');
	// 	const start = Math.max(2, current - 1);
	// 	const end = Math.min(total - 1, current + 1);
	// 	for (let i = start; i <= end; i++) pages.push(i);
	// 	if (current + 2 < total - 1) pages.push('...');
	// 	pages.push(total);
	// 	return pages;
	// }

	// Go to page
	function goToPage(n: number) {
		if (n < 1) n = 1;
		if (n > totalPages) n = totalPages;
		reservationPaginationStore.update((store) => ({ ...store, currentPage: n }));

		// scroll up
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	/* =========================================================
	   NAVBAR HIDE SHOW
	========================================================= */
	const navHidden = writable(false);
	let lastScrollY = 0;
	const scrollThreshold = 50;

	onMount(() => {
		function handleScroll() {
			const currentY = window.scrollY;
			if (currentY > lastScrollY && currentY > scrollThreshold) {
				navHidden.set(true);
			} else {
				navHidden.set(false);
			}
			lastScrollY = currentY;
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	/* =========================================================
	   FORMAT HELPERS
	========================================================= */
	function formatDate(value: Date | string) {
		const d = value instanceof Date ? value : new Date(value);
		if (isNaN(d.getTime())) return '-';
		return d.toLocaleDateString();
	}

	function formatDateTime(value: Date | string) {
		const d = value instanceof Date ? value : new Date(value);
		if (isNaN(d.getTime())) return '-';
		const date = d.toLocaleDateString(undefined, {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
		const time = d.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		return `${date} — ${time}`;
	}

	/* =========================================================
	   STATUS TAB CLICK
	========================================================= */
	function setTab(tab: StatusTab) {
		statusFilter.set(tab);
	}
</script>

<svelte:head>
	<title>Reservations - SCA Hospital</title>
</svelte:head>

<!-- NAVBAR (copied style from patient.svelte) -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 flex w-full max-w-full items-center justify-end bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<!-- keep NavigationMenu.List as container (positioning context) -->
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<!-- ABSOLUTELY CENTERED LOGO (always centered regardless of other items) -->
		<NavigationMenu.Item class="absolute top-4.4 left-1/2 -translate-x-1/2">
			<InputGroup.Root
				class="hidden w-72 rounded-full border border-[#E5E7EB] bg-white py-6 pr-3 pl-2 shadow-sm sm:flex"
			>
				<InputGroup.Input
					bind:value={$searchQuery}
					placeholder="Find name, medical record..."
					class="border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
				/>
				<InputGroup.Addon align="inline-end" class="rounded-full bg-white pr-1">
					<SearchIcon class="h-5 w-5" color="#1D69D1" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</NavigationMenu.Item>
		<!-- RIGHT-ALIGNED SEARCH (kept inside NavigationMenu.Item) -->
		<NavigationMenu.Item>
			<Button
				class="rounded-full bg-[#1D69D1] px-6 py-6 text-sm text-white shadow-sm hover:opacity-90"
				onclick={() => goto('/app/reservations/receptionist/addreservation')}
			>
				New Reservation
			</Button>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<!-- Main reservation area -->
<div class="flex w-full flex-col">
	<section id="main-content" class="min-h-screen w-full bg-[#F5F5F5]">
		<div class="min-h-[calc(100vh-64px)] p-4">
			<!-- Top status tabs (Booked / Checked In / Done / Cancelled / No Show) -->
			<div class="mb-4 flex items-center justify-center gap-3">
				{#each STATUS_TABS as tab}
					<button
						onclick={() => setTab(tab)}
						class="rounded-full px-6 py-3 font-semibold transition"
						class:bg-neutral-600={tab === 'Booked' && tab === $statusFilter}
						class:bg-primary-dark={tab === 'Checked In' && tab === $statusFilter}
						class:bg-success-700={tab === 'Done' && tab === $statusFilter}
						class:bg-danger-600={tab === 'Cancelled' && tab === $statusFilter}
						class:bg-warning-600={tab === 'No Show' && tab === $statusFilter}
						class:bg-neutral-300={tab !== $statusFilter}
						class:text-white={tab === $statusFilter}
					>
						{tab}
					</button>
				{/each}
			</div>

			<!-- RESERVATION LIST -->
			{#each $displayedReservations as reservation (reservation.getId())}
				<Accordion.Root type="single" class="w-full">
					<Accordion.Item value={reservation.getId()} class="w-full">
						<Accordion.Trigger class="min-w-full">
							<Item.Root class="border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md">
								<Item.Content>
									<Item.Title
										>{reservation.getPatient().getFullName()}
										{#if reservation.getPatient().getGender() == 'Male'}
											<Mars class="ml-1 inline-block" color="#0000FF" />
										{:else}
											<Venus class="ml-1 inline-block" color="#FF1493" />
										{/if}</Item.Title
									>

									<Item.Description
										>Medical Record No.<br />
										{reservation.getPatient().getMedicalRecordNumber()}</Item.Description
									>
								</Item.Content>
								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>
								<Item.Content>
									<Item.Description>Receptionist</Item.Description>
									<Item.Title>{reservation.getReceptionist().getFullName()}</Item.Title>
								</Item.Content>
								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>
								<Item.Content>
									<Item.Description>Doctor</Item.Description>
									<Item.Title>
										{reservation.getDoctor().getFullName()}</Item.Title
									>
								</Item.Content>
								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>
								<Item.Content>
									<Item.Description>Reservation Time</Item.Description>
									<Item.Title
										>{format(
											new Date(reservation.getReservationTime()),
											'dd MMMM yyyy'
										)}</Item.Title
									>
								</Item.Content>
								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>
								<Item.Content>
									<Item.Description>Notes</Item.Description>
									<Item.Title>{reservation.getNotes()}</Item.Title>
								</Item.Content>
							</Item.Root>
						</Accordion.Trigger>
						<Accordion.Content class="flex flex-col items-end justify-end space-y-6">
							<div class="mb-6">
								{#if reservation.getPatient().getMedicalRecord() === null || reservation
										.getPatient()
										.getMedicalRecord()[0] === undefined}
									<div class="p-6 text-center text-sm text-slate-500">
										No medical record found for this patient.
									</div>
								{:else}
									{#each reservation.getPatient().getMedicalRecord() as record (record.getId())}
										<MedicalRecordCard {record} prescriptions={record.getPrescriptions() ?? null} />
										<div class="mt-5"></div>
									{/each}
								{/if}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/each}
		</div>
	</section>

	<!-- PAGINATION (Pill style) -->
	<Pagination.Root
		count={totalResults}
		perPage={itemsPerPage}
		page={currentPage}
		{siblingCount}
		class="mt-8 justify-center bg-[#F5F5F5] px-4 pb-8 "
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content
				class="flex w-auto items-center justify-between rounded-full border border-gray-300 bg-white px-2 py-3 shadow-sm"
			>
				<Pagination.Item>
					<Pagination.PrevButton
						onclick={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<span
							class="rounded-full border-2 border-[#1D69D1] px-4 py-2 font-semibold text-[#1D69D1] hover:bg-blue-50 disabled:opacity-40"
							>Prev</span
						></Pagination.PrevButton
					>
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link
								{page}
								isActive={currentPage === page.value}
								class="rounded-full border-2 py-2 font-semibold hover:shadow-sm {currentPage ===
								page.value
									? 'bg-[#1D69D1] text-white'
									: 'border-[#1D69D1] text-[#1D69D1]'} "
								onclick={() => goToPage(page.value)}
							>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton onclick={() => goToPage(currentPage + 1)}>
						<span
							class="rounded-full border-2 border-[#1D69D1] px-4 py-2 font-semibold text-[#1D69D1] hover:bg-blue-50 disabled:opacity-40"
							>Next</span
						>
					</Pagination.NextButton>
				</Pagination.Item>
				<!-- RIGHT: Result count -->
				<div class="mr-4 text-sm whitespace-nowrap text-gray-600">
					Showing {$displayedReservations.length} of {totalResults} results
				</div>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>

<style>
	:global(.-translate-y-full) {
		transform: translateY(-100%);
	}
	:global(.translate-y-0) {
		transform: translateY(0);
	}
</style>
