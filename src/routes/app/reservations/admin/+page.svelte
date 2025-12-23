<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Info, Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { Reservation } from '$lib/shared/entities';
	import type { Reservation as ReservationClass } from '$lib/shared/entities';
	import * as Accordion from '$lib/components/ui/accordion';
	import { format } from 'date-fns';
	import { writable, derived } from 'svelte/store';
	import type { reservationStatus } from '$lib/shared/types/type_def';
	import { goto, refreshAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import MedicalRecordCard from '$lib/shared/components/MedicalRecordCard.svelte';
	import { reservationPaginationStore } from '$lib/shared/stores/pagination';
	import { toast } from 'svelte-sonner';

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

	let showCancelModal = $state(false);
	function openCancelModal() {
		showCancelModal = true;
	}
	function closeCancelModal() {
		showCancelModal = false;
	}

	async function checkIn(reservationId: string) {
		const response = await fetch('/api/receptionist/check-in', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reservationId })
		});
		if (!response.ok) {
			toast.error('Failed to check in reservation.');
			return;
		}
		toast.success('Reservation checked in successfully.');
		// Refresh the page or update the reservation list accordingly
		window.location.reload();
	}

	async function cancelReservation(reservationId: string) {
		const response = await fetch('/api/receptionist/cancel', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reservationId })
		});
		if (!response.ok) {
			toast.error('Failed to cancel reservation.');
			return;
		}
		toast.success('Reservation cancelled successfully.');
		// Refresh the page or update the reservation list accordingly
		window.location.reload();
	}

	async function markAsDone(reservationId: string) {
		const response = await fetch('/api/receptionist/done', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reservationId })
		});
		if (!response.ok) {
			toast.error('Failed to mark reservation as done.');
			return;
		}
		toast.success('Reservation marked as done successfully.');
		// Refresh the page or update the reservation list accordingly
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Reservations - SCA Hospital</title>
</svelte:head>

<!-- NAVBAR SECTION ARGH, NEED HELP PLOX -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 flex w-full max-w-full items-center justify-end bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<!-- keep NavigationMenu.List as container (positioning context) -->
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<!-- ABSOLUTELY CENTERED LOGO (always centered regardless of other items) -->
		<NavigationMenu.Item class="top-4.4 absolute left-1/2 -translate-x-1/2">
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
		<NavigationMenu.Item class="flex items-center">
			<Button
				class="rounded-full bg-[#1D69D1] px-6 py-6 text-sm text-white shadow-sm hover:opacity-90"
				onclick={() => goto('/app/reservations/admin/addreservation')}
			>
				Add New Reservation
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
											'dd MMMM yyyy — HH:mm'
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
							{#if reservation.getStatus() === 'Booked'}
								<div class="mt-4 gap-2">
									<Button
										variant="destructive"
										class="rounded-full border-3 border-red-600 bg-white px-5 py-5 text-red-600 hover:bg-gray-100"
										onclick={openCancelModal}>Cancelled</Button
									>
									<Button
										variant="default"
										class="ml-3 rounded-full bg-[#164F9D] px-7 py-5"
										onclick={() => checkIn(reservation.getId())}>Check In</Button
									>
								</div>
							{:else if reservation.getStatus() === 'Checked In'}
								<div class="mt-4 gap-2">
									<Button
										variant="default"
										class="rounded-full bg-[#0C9D61] px-7 py-5"
										onclick={() => markAsDone(reservation.getId())}>Done</Button
									>
								</div>
							{/if}
						</Accordion.Content>
						{#if showCancelModal}
							<!-- overlay -->
							<div
								class="fixed inset-0 z-50 bg-black/50"
								onclick={closeCancelModal}
								onkeydown={(e) => e.key === 'Escape' && closeCancelModal()}
								role="button"
								tabindex="0"
							></div>

							<!-- modal container -->
							<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
								<div
									class="relative w-full max-w-lg bg-white p-6 shadow-lg"
									style="border-radius: 32px;"
								>
									<!-- header row: icon left, close-X right -->
									<div class="mb-4 flex items-center justify-between">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]"
										>
											<Info color="#1d69d1" size={24} />
										</div>
										<button
											class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] text-2xl font-bold text-black"
											onclick={closeCancelModal}
											aria-label="Close"
										>
											X
										</button>
									</div>

									<!-- Log out text -->
									<div class="flex flex-col space-y-2">
										<h3 class="text-left text-2xl font-bold">Cancel this reservation?</h3>
										<p class="text-left" style="color: #8E8E8E;">
											This action will mark the reservation as Cancelled. It cannot be undone.
										</p>
										<!-- Dummy Text -->
										<p class="text-left"><br /></p>
									</div>

									<!-- log out button -->
									<div class="mt-4 flex w-full justify-end gap-5">
										<button
											class="rounded-full bg-[#1d69d1] px-6 py-2 font-medium text-white hover:bg-[#155ab8]"
											onclick={closeCancelModal}
										>
											Keep Reservation
										</button>
										<button
											class="rounded-full bg-[#EC2D30] px-6 py-2 font-medium text-white hover:bg-[#B22222]"
											onclick={() => {
												cancelReservation(reservation.getId());
											}}
										>
											Yes, Cancel It
										</button>
									</div>
								</div>
							</div>
						{/if}
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

<!-- log out pop-up -->

<style>
	:global(.-translate-y-full) {
		transform: translateY(-100%);
	}
	:global(.translate-y-0) {
		transform: translateY(0);
	}
</style>
