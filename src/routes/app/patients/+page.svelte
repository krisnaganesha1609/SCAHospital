<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import { Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { Patient } from '$lib/shared/entities';

	// ---------- INITIAL DATA ----------
	let { data }: PageProps = $props();
	const patients: Patient[] = data.patients.map((p) => Patient.fromPOJO(p));

	// ---------- PAGINATION ----------
	const PAGE_SIZE = 7;
	const totalResults = patients.length;
	const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

	import { writable, derived } from 'svelte/store';
	const currentPage = writable(1);

	// derived store: the patients to show on current page
	const displayedPatients = derived(currentPage, ($current) => {
		const start = ($current - 1) * PAGE_SIZE;
		const end = Math.min(start + PAGE_SIZE, totalResults);
		return patients.slice(start, end);
	});

	// helper to create compact page numbers with ellipsis
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

	const pageNumbers = derived(currentPage, ($current) => getPageNumbers($current, totalPages));

	// go to page (client-only scroll guard)
	function goToPage(n: number) {
		if (n < 1) n = 1;
		if (n > totalPages) n = totalPages;
		currentPage.set(n);
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// ---------- NAVBAR HIDE / SHOW (guarded for SSR) ----------
	const navHidden = writable(false);
	let lastScrollY = 0;
	const scrollThreshold = 50;

	onMount(() => {
		// run only in browser (onMount = client)
		function handleScroll() {
			const currentY = window.scrollY || window.pageYOffset;
			if (currentY > lastScrollY && currentY > scrollThreshold) {
				navHidden.set(true);
			} else {
				navHidden.set(false);
			}
			lastScrollY = Math.max(0, currentY);
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// ---------- HELPERS ----------
	function formatDate(value: Date | string) {
		const d = value instanceof Date ? value : new Date(value);
		if (isNaN(d.getTime())) return '-';
		return d.toLocaleDateString();
	}
</script>

<!-- NAVBAR SECTION ARGH, NEED HELP PLOX -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 w-full max-w-full bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<!-- keep NavigationMenu.List as container (positioning context) -->
	<NavigationMenu.List class="flex w-full items-center px-4 py-2">
		<!-- LEFT-ALIGNED MENU ITEMS, which is a placeholder text -->
		<div class="flex-1"></div>
		<!-- ABSOLUTELY CENTERED LOGO (always centered regardless of other items) -->
		<div class="pointer-events-auto flex-none">
			<NavigationMenu.Item>
				<NavigationMenu.Link class="cursor-pointer">
					<div class="h-full w-full">
						<img src={logo} alt="Logo" class="h-8 object-contain" />
					</div>
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</div>
		<!-- RIGHT-ALIGNED SEARCH (kept inside NavigationMenu.Item) -->
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
						<SearchIcon class="h-5 w-5" color="#1D69D1" />
					</InputGroup.Addon>
				</InputGroup.Root>
			</NavigationMenu.Item>
		</div>
	</NavigationMenu.List>
</NavigationMenu.Root>

<!-- all sections wrapped in a top-level flex column -->
<div class="flex w-full flex-col">
	<!-- MAIN CONTENT SECTION -->
	<section id="main-content" class="min-h-screen w-full bg-[#F5F5F5]">
		<div class="min-h-[calc(100vh-64px)] p-4">
			<!-- PATIENT LIST GROUP -->
			<Item.Group>
				{#each $displayedPatients as patient (patient.getId())}
					<Item.Root
						class="mb-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<Item.Content>
							<div class="grid grid-cols-12 items-center gap-1">
								<!-- NAME + MRN -->
								<div class="col-span-2 flex flex-col">
									<div class="flex items-center">
										<Item.Title class="text-[17px] font-semibold">
											{patient.getFullName()}
											{#if patient.getGender() === 'Male'}
												<Mars class="ml-1 inline-block" color="#1D4ED8" />
											{:else}
												<Venus class="ml-1 inline-block" color="#E91E63" />
											{/if}
										</Item.Title>
									</div>

									<div class="mt-1 text-xs leading-tight text-gray-500">
										Medical Record No.<br />
										<span class="text-[11px] text-gray-400">{patient.getMedicalRecordNumber()}</span
										>
									</div>
								</div>

								<!-- DIVIDER -->
								<div class="col-span-0 flex justify-center">
									<div class="h-10 border-l w-px border-gray-300"></div>
								</div>

								<!-- INFO -->
								<div class="col-span-1">
									<div class="text-[11px] text-gray-500">Info</div>
									<div class="mt-1 text-[13px] leading-snug font-medium">
										{patient.getPhone() || '-'}<br />
									</div>
									<div class="mt-1 text-[11px] leading-snug font-medium">
										<span class="text-gray-600">{patient.getAddress() || '-'}</span>
									</div>
								</div>

								<!-- DIVIDER -->
								<div class="col-span-0 flex justify-center">
									<div class="h-10 border-l w-px border-gray-300"></div>
								</div>

								<!-- BIRTH DATE -->
								<div class="col-span-1">
									<div class="text-[11px] text-gray-500">Birth Date</div>
									<div class="mt-1 text-[13px] font-medium">
										{formatDate(patient.getDateOfBirth())}
									</div>
								</div>

								<!-- DIVIDER -->
								<div class="col-span-0 flex justify-center">
									<div class="h-10 border-l w-px border-gray-300"></div>
								</div>

								<!-- BLOOD TYPE -->
								<div class="col-span-1">
									<div class="text-[11px] text-gray-500">Blood Type</div>
									<div class="mt-1 text-[13px] font-medium">
										{patient.getBloodType() || '-'}
									</div>
								</div>

								<!-- DIVIDER -->
								<div class="col-span-0 flex justify-center">
									<div class="h-10 border-l w-px border-gray-300"></div>
								</div>

								<!-- ALLERGIES -->
								<div class="col-span-1">
									<div class="text-[11px] text-gray-500">Allergies</div>
									<div class="mt-1 text-[13px] font-medium">
										{patient.getAllergies() || '-'}
									</div>
								</div>

								<!-- DIVIDER -->
								<div class="col-span-0 flex justify-center">
									<div class="h-10 border-l w-px border-gray-300"></div>
								</div>

								<!-- FIRST REGISTERED -->
								<div class="col-span-1">
									<div class="text-[11px] text-gray-500">First Registered</div>
									<div class="mt-1 text-[13px] font-medium">
										{formatDate(patient.getCreatedAt())}
									</div>
								</div>
							</div>
						</Item.Content>
					</Item.Root>
				{/each}
			</Item.Group>
		</div>
	</section>

	<!-- PAGINATION SECTION (Pill style) -->
	<section id="pagination" class="bg-[#F5F5F5] px-4 pb-8">
		<div class="flex justify-center">
			<div
				class="flex w-auto items-center justify-between gap-6 rounded-full border border-gray-300 bg-white px-6 py-3 shadow-sm"
			>
				<!-- LEFT: Pagination Buttons -->
				<nav class="inline-flex items-center gap-2" aria-label="Pagination">
					<!-- Prev Button -->
					<button
						class="rounded-full border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
						on:click={() => goToPage($currentPage - 1)}
						disabled={$currentPage === 1}
					>
						Prev
					</button>

					<!-- Page Numbers -->
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
								on:click={() => goToPage(p)}
								aria-current={p === $currentPage ? 'page' : undefined}
							>
								{p}
							</button>
						{/if}
					{/each}

					<!-- Next Button -->
					<button
						class="rounded-full border-2 border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
						on:click={() => goToPage($currentPage + 1)}
						disabled={$currentPage === totalPages}
					>
						Next
					</button>
				</nav>

				<!-- RIGHT: Result count -->
				<div class="text-sm whitespace-nowrap text-gray-600">
					Showing {$displayedPatients.length} of {totalResults} results
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* defensive helper classes if your build doesn't include some Tailwind utilities */
	:global(.-translate-y-full) {
		transform: translateY(-100%);
	}
	:global(.translate-y-0) {
		transform: translateY(0);
	}
</style>
