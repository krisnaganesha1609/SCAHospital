<script lang="ts">
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { Patient } from '$lib/shared/entities';
	import { format } from 'date-fns';
	import { patientPaginationStore } from '$lib/shared/stores/pagination';
	import MedicalRecordCard from '$lib/shared/components/MedicalRecordCard.svelte';
	// data transport to add record functionality
	import { goto } from '$app/navigation';
	import { persistSelectedPatient } from '$lib/shared/stores/selectedPatient';
	import { Button } from '$lib/components/ui/button';
	import { writable, derived } from 'svelte/store';

	// ---------- INITIAL DATA ----------
	let { data }: PageProps = $props();
	const patients: Patient[] = data.patients.map((p) => Patient.fromPOJO(p));

	// REMINDER: PAGINATION INI SEMUANYA DIUBAH
	// START
	let { itemsPerPage, currentPage } = $patientPaginationStore;
	const perPage = itemsPerPage;
	let siblingCount = 1;

	const totalResults = patients.length;
	const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

	const searchQuery = writable('');

	// derived store: the patients to show on current page
	const displayedPatients = derived([patientPaginationStore, searchQuery], ([$current, $searchQuery]) => {
		if ($searchQuery.trim() !== '') {
			return patients.filter((p) => {
				const fullName = p.getFullName().toLowerCase();
				const medicalRecordNumber = p.getMedicalRecordNumber().toLowerCase();
				const query = $searchQuery.toLowerCase();
				return fullName.includes(query) || medicalRecordNumber.includes(query);
			});
		}
		const start = ($current.currentPage - 1) * perPage;
		const end = Math.min(start + perPage, totalResults);
		return patients.slice(start, end);
	});

	// // helper to create compact page numbers with ellipsis
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

	// go to page (client-only scroll guard)
	function goToPage(n: number) {
		if (n < 1) n = 1;
		if (n > totalPages) n = totalPages;
		patientPaginationStore.update((store) => ({ ...store, currentPage: n }));
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	// END OF PART 1

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
</script>

<svelte:head>
	<title>Patients - SCA Hospital</title>
</svelte:head>

<!-- NAVBAR SECTION ARGH, NEED HELP PLOX -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 flex w-full max-w-full items-center justify-center bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<!-- keep NavigationMenu.List as container (positioning context) -->
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<!-- CENTER-ALIGNED SEARCH (kept inside NavigationMenu.Item) -->
		<NavigationMenu.Item>
			<InputGroup.Root
				class="hidden w-72 rounded-full border border-[#E5E7EB] bg-white py-6 pr-3 pl-2 shadow-sm sm:flex"
			>
				<InputGroup.Input
					placeholder="Find name, medical record..."
					class="border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
					bind:value={$searchQuery}
				/>
				<InputGroup.Addon align="inline-end" class="rounded-full bg-white pr-1">
					<SearchIcon class="h-5 w-5" color="#1D69D1" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
<div class="min-h-[calc(100vh-64px)] p-4">
	<Item.Group>
		{#each $displayedPatients as patient (patient.getId())}
			<Accordion.Root type="single" class="w-full">
				<Accordion.Item value={patient.getId()} class="w-full">
					<Accordion.Trigger class="min-w-full">
						<Item.Root class="border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md">
							<Item.Content>
								<Item.Title
									>{patient.getFullName()}
									{#if patient.getGender() == 'Male'}
										<Mars class="ml-1 inline-block" color="#0000FF" />
									{:else}
										<Venus class="ml-1 inline-block" color="#FF1493" />
									{/if}</Item.Title
								>

								<Item.Description
									>Medical Record No.<br /> {patient.getMedicalRecordNumber()}</Item.Description
								>
							</Item.Content>
							<div class="col-span-0 flex justify-center">
								<div class="h-10 w-px border-l border-gray-300"></div>
							</div>
							<Item.Content>
								<Item.Description>Info</Item.Description>
								<Item.Title>{patient.getPhone()}</Item.Title>
								<Item.Title>{patient.getAddress()}</Item.Title>
							</Item.Content>
							<div class="col-span-0 flex justify-center">
								<div class="h-10 w-px border-l border-gray-300"></div>
							</div>
							<Item.Content>
								<Item.Description>Birth Date</Item.Description>
								<Item.Title>
									{format(new Date(patient.getDateOfBirth()), 'dd MMMM yyyy')}</Item.Title
								>
							</Item.Content>
							<div class="col-span-0 flex justify-center">
								<div class="h-10 w-px border-l border-gray-300"></div>
							</div>
							<Item.Content>
								<Item.Description>Blood Type</Item.Description>
								<Item.Title>{patient.getBloodType()}</Item.Title>
							</Item.Content>
							<div class="col-span-0 flex justify-center">
								<div class="h-10 w-px border-l border-gray-300"></div>
							</div>
							<Item.Content>
								<Item.Description>Allergies</Item.Description>
								<Item.Title>{patient.getAllergies()}</Item.Title>
							</Item.Content>
							<div class="col-span-0 flex justify-center">
								<div class="h-10 w-px border-l border-gray-300"></div>
							</div>
							<Item.Content>
								<Item.Description>First Registered</Item.Description>
								<Item.Title>{format(new Date(patient.getCreatedAt()), 'dd MMMM yyyy')}</Item.Title>
							</Item.Content>
						</Item.Root>
					</Accordion.Trigger>
					<Accordion.Content class="flex flex-col space-y-6">
						<div class="flex items-center justify-end">
							<div></div>
							<Button
								class="mt-5 rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
								onclick={() => {
									// set store and persist to sessionStorage then navigate
									persistSelectedPatient(patient);
									// include id in query just in case user wants direct link later
									goto(`/app/patients/doctor/add?id=${encodeURIComponent(patient.getId())}`);
								}}
							>
								Add Record
							</Button>
						</div>
						<div class="mb-6">
							{#if patient.getMedicalRecord() === null || patient.getMedicalRecord()[0] === undefined}
								<div class="p-6 text-center text-sm text-slate-500">
									No medical record found for this patient.
								</div>
							{:else}
								{#each patient.getMedicalRecord() as record (record.getId())}
									<MedicalRecordCard {record} prescriptions={record.getPrescriptions() ?? null} />
									<div class="mt-5"></div>
								{/each}
							{/if}
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		{/each}
	</Item.Group>
	<!-- REMINDER: PAGINATION INI SEMUANYA DIUBAH -->
	<!-- START  -->
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
					Showing {$displayedPatients.length} of {totalResults} results
				</div>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
	<!-- END OF PART 2  -->
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
