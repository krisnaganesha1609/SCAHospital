<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import { Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { Reservation } from '$lib/shared/entities';
	import type { Reservation as ReservationClass } from '$lib/shared/entities';

	import { writable, derived, get } from 'svelte/store';

	/* =========================================================
	   INITIAL DATA
	========================================================= */
	let { data }: PageProps = $props();
	const reservations: ReservationClass[] = data.reservations.map((r) =>
		Reservation.fromJson(r)
	);

	/* =========================================================
	   FILTER / STATUS TABS
	========================================================= */
	const STATUS_TABS = ['Booked', 'Check in', 'Done', 'Cancelled', 'No Show'] as const;
	type StatusTab = typeof STATUS_TABS[number] | 'All';

	const statusFilter = writable<StatusTab>('Booked');

	/* =========================================================
	   PAGINATION (no legacy $: — Svelte 5 compliant)
	========================================================= */
	const PAGE_SIZE = 10;
	const currentPage = writable(1);

	// Filtered list (based on status tab)
	const filteredReservations = derived(statusFilter, ($status) => {
		if (!$status || $status === 'All') return reservations;
		return reservations.filter((r) =>
			String(r.getStatus()).toLowerCase() === String($status).toLowerCase()
		);
	});

	// Total pages
	const totalPages = derived(filteredReservations, ($filtered) =>
		Math.max(1, Math.ceil($filtered.length / PAGE_SIZE))
	);

	// Paginated + filtered output
	const displayedReservations = derived(
		[filteredReservations, currentPage, totalPages],
		([$filtered, $current]) => {
			const start = ($current - 1) * PAGE_SIZE;
			return $filtered.slice(start, start + PAGE_SIZE);
		}
	);

	// Reset page to 1 when filter changes
	statusFilter.subscribe(() => {
		currentPage.set(1);
	});

	// Generate page numbers (same logic as before)
	function getPageNumbers(current: number, total: number): (number | '...')[] {
		const pages: (number | '...')[] = [];
		if (total <= 7) {
			for (let i = 1; i <= total; i++) pages.push(i);
			return pages;
		}
		pages.push(1);
		if (current > 4) pages.push('...');
		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (current + 2 < total - 1) pages.push('...');
		pages.push(total);
		return pages;
	}

	const pageNumbers = derived(
		[currentPage, totalPages],
		([$current, $total]) => getPageNumbers($current, $total)
	);

	// Go to page
	function goToPage(n: number) {
		const tot = get(totalPages);
		if (n < 1) n = 1;
		if (n > tot) n = tot;
		currentPage.set(n);

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

<!-- NAVBAR (copied style from patient.svelte) -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 w-full max-w-full bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<NavigationMenu.List class="flex w-full items-center px-4 py-2">
		<div class="flex-1"></div>
		<div class="pointer-events-auto flex-none">
			<NavigationMenu.Item>
				<NavigationMenu.Link class="cursor-pointer">
					<div class="h-full w-full">
						<img src={logo} alt="Logo" class="h-8 object-contain" />
					</div>
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</div>
		<div class="flex flex-1 justify-end">
			<NavigationMenu.Item>
				<InputGroup.Root
					class="hidden w-72 rounded-full border border-[#E5E7EB] bg-white py-[6px] pr-2 pl-4 shadow-sm sm:flex"
				>
					<InputGroup.Input
						placeholder="Find name, medical record..."
						class="border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
					/>
					<InputGroup.Addon align="inline-end" class="rounded-full bg-white pr-1">
						<SearchIcon class="h-5 w-5" />
					</InputGroup.Addon>
				</InputGroup.Root>
			</NavigationMenu.Item>
		</div>
	</NavigationMenu.List>
</NavigationMenu.Root>

<!-- Main reservation area -->
<div class="flex w-full flex-col">
	<section id="main-content" class="min-h-screen w-full bg-[#F5F5F5]">
		<div class="min-h-[calc(100vh-64px)] p-4">
			<!-- Top status tabs (Booked / Check in / Done / Cancelled / No Show) -->
			<div class="mb-4 flex items-center justify-center gap-3">
				{#each STATUS_TABS as tab}
					<button
						on:click={() => setTab(tab)}
						class="rounded-full px-4 py-2 font-semibold border-2 transition"
						class:bg-blue-600={tab === $statusFilter}
						class:text-white={tab === $statusFilter}
						class:border-blue-600={tab === $statusFilter}
						class:text-blue-600={tab !== $statusFilter}
					>
						{tab}
					</button>
				{/each}
			</div>

			<!-- RESERVATION LIST -->
			<Item.Group>
				{#each $displayedReservations as reservation (reservation.getId())}
					<Item.Root
						class="mb-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<Item.Content>
							<div class="grid grid-cols-12 items-center gap-1">
								<!-- NAME + MRN -->
								<div class="col-span-3 flex flex-col">
									<div class="flex items-center">
										<Item.Title class="text-[17px] font-semibold">
											{reservation.getPatient().getFullName()}
											{#if reservation.getPatient().getGender() === 'Male'}
												<Mars class="ml-1 inline-block" />
											{:else}
												<Venus class="ml-1 inline-block" />
											{/if}
										</Item.Title>
									</div>

									<div class="mt-1 text-xs leading-tight text-gray-500">
										Medical Record No.<br />
										<span class="text-[11px] text-gray-400">{reservation.getPatient().getMedicalRecordNumber()}</span>
									</div>
								</div>

								<!-- vertical divider -->
								<div class="col-span-0 flex justify-center">
									<div class="h-14 border-l w-px border-gray-300"></div>
								</div>

								<!-- Receptionist -->
								<div class="col-span-2">
									<div class="text-[11px] text-gray-500">Receptionist</div>
									<div class="mt-1 text-[13px] leading-snug font-medium">
										{reservation.getReceptionist().getFullName()}
									</div>
								</div>

								<!-- divider -->
								<div class="col-span-0 flex justify-center">
									<div class="h-14 border-l w-px border-gray-300"></div>
								</div>

								<!-- Doctor -->
								<div class="col-span-2">
									<div class="text-[11px] text-gray-500">Doctor</div>
									<div class="mt-1 text-[13px] leading-snug font-medium">
										{reservation.getDoctor().getFullName()}
									</div>
								</div>

								<!-- divider -->
								<div class="col-span-0 flex justify-center">
									<div class="h-14 border-l w-px border-gray-300"></div>
								</div>

								<!-- Reservation Time -->
								<div class="col-span-2">
									<div class="text-[11px] text-gray-500">Reservation Time</div>
									<div class="mt-1 text-[13px] leading-snug font-medium">
										{formatDateTime(reservation.getReservationTime())}
									</div>
								</div>

								<!-- divider -->
								<div class="col-span-0 flex justify-center">
									<div class="h-14 border-l w-px border-gray-300"></div>
								</div>

								<!-- Notes -->
								<div class="col-span-2">
									<div class="text-[11px] text-gray-500">Notes</div>
									<div class="mt-1 text-[13px] leading-snug font-medium text-gray-700">
										{reservation.getNotes() || '-'}
									</div>
								</div>
							</div>
						</Item.Content>
					</Item.Root>
				{/each}
			</Item.Group>
		</div>
	</section>

	<!-- PAGINATION (Pill style) -->
	<section id="pagination" class="bg-[#F5F5F5] px-4 pb-8">
		<div class="flex justify-center">
			<div
				class="flex w-auto items-center justify-between gap-6 rounded-full border border-gray-300 bg-white px-6 py-3 shadow-sm"
			>
				<!-- Left: Pagination Buttons -->
				<nav class="inline-flex items-center gap-2" aria-label="Pagination">
					<button
						class="rounded-full border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
						on:click={() => goToPage($currentPage - 1)}
						disabled={$currentPage === 1}
					>
						Prev
					</button>

					{#each $pageNumbers as p}
						{#if p === '...'}
							<span class="px-2">...</span>
						{:else}
							<button
								class="rounded-full border-2 px-4 py-2 font-semibold hover:shadow-sm"
								class:bg-blue-600={p === $currentPage}
								class:text-white={p === $currentPage}
								class:border-blue-600={p !== $currentPage}
								class:text-blue-600={p !== $currentPage}
								on:click={() => goToPage(p as number)}
								aria-current={p === $currentPage ? 'page' : undefined}
							>
								{p}
							</button>
						{/if}
					{/each}

					<button
						class="rounded-full border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
						on:click={() => goToPage($currentPage + 1)}
						disabled={$currentPage === $totalPages}
					>
						Next
					</button>
				</nav>

				<!-- Right: Result count -->
				<div class="text-sm whitespace-nowrap text-gray-600">
					Showing {$displayedReservations.length} of {$filteredReservations.length} results
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(.-translate-y-full) {
		transform: translateY(-100%);
	}
	:global(.translate-y-0) {
		transform: translateY(0);
	}
</style>
