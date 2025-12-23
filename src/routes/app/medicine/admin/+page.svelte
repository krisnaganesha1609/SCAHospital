<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Pagination from '$lib/components/ui/pagination';
	import { SearchIcon } from '@lucide/svelte';
	import { Medicine } from '$lib/shared/entities'; // Pastikan export di index entities benar
	import { Button } from '$lib/components/ui/button';
	import { writable, derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	// Jika Anda belum punya store global untuk medicine, kita buat local store di sini
	// atau import dari '$lib/shared/stores/pagination' jika sudah dibuatkan khusus medicine
	const medicinePaginationStore = writable({
		itemsPerPage: 5,
		currentPage: 1
	});

	// Tambahkan interface ini di atas script untuk memberitahu TS struktur data kita
	interface MedicinePageData {
		medicines: any[]; // atau ganti any dengan tipe POJO Medicine jika ada
		[key: string]: any;
	}

	// Gunakan as untuk memaksa tipe
	let { data } = $props<{ data: MedicinePageData }>();

	// Sekarang data.medicines tidak akan merah lagi
	const medicines: Medicine[] = (data.medicines ?? []).map((m: any) => Medicine.fromPOJO(m));

	// Gunakan $state agar reaktif
	let itemsPerPage = $state(5);
	let currentPage = $state(1);

	// Update subscription agar mengubah nilai $state
	medicinePaginationStore.subscribe((v) => {
		itemsPerPage = v.itemsPerPage;
		currentPage = v.currentPage;
	});

	const perPage = 5; // Hardcode default atau ambil dari store
	let siblingCount = 1;

	// Hitung total results & pages
	const totalResults = medicines.length;
	// Gunakan reactive statement untuk totalPages agar update jika data berubah
	let totalPages = Math.max(1, Math.ceil(totalResults / perPage));

	const searchQuery = writable('');

	// Derived store: Filter & Slice data medicine
	const displayedMedicines = derived(
		[medicinePaginationStore, searchQuery],
		([$pagination, $searchQuery]) => {
			// 1. Filter Logic
			let filtered = medicines;
			if ($searchQuery.trim() !== '') {
				filtered = medicines.filter(
					(med) =>
						med.getName().toLowerCase().includes($searchQuery.trim().toLowerCase()) ||
						med.getCode().toLowerCase().includes($searchQuery.trim().toLowerCase())
				);
			}

			// 2. Pagination Logic
			// Jika sedang search, biasanya pagination di-reset atau menampilkan hasil filter
			// Di sini kita slice hasil filter berdasarkan halaman aktif
			const start = ($pagination.currentPage - 1) * perPage;
			const end = Math.min(start + perPage, filtered.length); // Fix: gunakan length dari filtered

			// Jika hasil filter lebih sedikit dari current page range, reset ke page 1 (opsional logic)
			// Untuk simplicity, kita return slice dari filtered
			return filtered.slice(start, end);
		}
	);

	// Helper untuk persist data sebelum navigasi (mirip persistSelectedPatient)
	function persistSelectedMedicine(medicine: Medicine) {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem('selectedMedicine', JSON.stringify(medicine.toJson()));
		}
	}

	// Go to page function
	function goToPage(n: number) {
		if (n < 1) n = 1;
		if (n > totalPages) n = totalPages;
		medicinePaginationStore.update((store) => ({ ...store, currentPage: n }));
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// ---------- NAVBAR HIDE / SHOW LOGIC ----------
	const navHidden = writable(false);
	let lastScrollY = 0;
	const scrollThreshold = 50;

	onMount(() => {
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
	<title>Medicines - SCA Hospital</title>
</svelte:head>

<NavigationMenu.Root
	class={'sticky top-0 z-50 flex w-full max-w-full items-center justify-end bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<NavigationMenu.Item class="top-4.4 absolute left-1/2 -translate-x-1/2">
			<InputGroup.Root
				class="hidden w-96 rounded-full border border-[#E5E7EB] bg-white py-6 pr-3 pl-2 shadow-sm sm:flex"
			>
				<InputGroup.Input
					bind:value={$searchQuery}
					placeholder="Find medicine name, code..."
					class="border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
				/>
				<InputGroup.Addon align="inline-end" class="rounded-full bg-white pr-1">
					<SearchIcon class="h-5 w-5" color="#1D69D1" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</NavigationMenu.Item>

		<NavigationMenu.Item class="flex items-center">
			<Button
				class="rounded-full bg-[#1D69D1] px-6 py-6 text-sm text-white shadow-sm hover:opacity-90"
				onclick={() => goto('/app/medicine/admin/add')}
			>
				Add Medicine
			</Button>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<div class="min-h-[calc(100vh-64px)] bg-[#F3F5F7] p-8">
	<div class="mx-auto flex max-w-7xl flex-col gap-4">
		{#each $displayedMedicines as medicine (medicine.getId())}
			<button
				class="group relative flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
				onclick={() => {
					persistSelectedMedicine(medicine);
					goto(`/app/medicine/admin/edit?id=${encodeURIComponent(medicine.getId())}`);
				}}
			>
				<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-6 md:gap-2">
					<div class="flex flex-col justify-center md:col-span-1">
						<span class="text-lg font-bold text-gray-900">{medicine.getName()}</span>
						<span class="text-xs text-gray-400">{medicine.getCode()}</span>
					</div>

					<div
						class="flex flex-col justify-center border-l border-transparent pl-0 md:border-gray-100 md:pl-4"
					>
						<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
							>Strength</span
						>
						<span class="text-sm font-medium text-gray-700">{medicine.getStrength()}</span>
					</div>

					<div
						class="flex flex-col justify-center border-l border-transparent pl-0 md:border-gray-100 md:pl-4"
					>
						<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
							>Form</span
						>
						<span class="text-sm font-medium text-gray-700">{medicine.getForm()}</span>
					</div>

					<div
						class="flex flex-col justify-center border-l border-transparent pl-0 md:border-gray-100 md:pl-4"
					>
						<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
							>Unit Price</span
						>
						<span class="text-sm font-bold text-gray-900"
							>Rp{medicine.getUnitPrice().toLocaleString()}</span
						>
					</div>

					<div
						class="flex flex-col justify-center border-l border-transparent pl-0 md:border-gray-100 md:pl-4"
					>
						<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
							>Packaging</span
						>
						<span class="text-sm font-medium text-gray-700">{medicine.getUnitType()}</span>
					</div>

					<div
						class="flex flex-col justify-center border-l border-transparent pl-0 md:border-gray-100 md:pl-4"
					>
						<span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase"
							>Stock Qty</span
						>
						<span class="text-sm font-bold text-gray-900">{medicine.getStockQty()}</span>
					</div>
				</div>
			</button>
		{/each}

		{#if $displayedMedicines.length === 0}
			<div class="flex flex-col items-center justify-center py-20 text-center text-gray-500">
				<p>No medicines found.</p>
			</div>
		{/if}
	</div>

	<Pagination.Root
		count={totalResults}
		{perPage}
		page={currentPage}
		{siblingCount}
		class="mt-8 justify-center pb-8"
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

				<div class="hidden px-4 text-sm whitespace-nowrap text-gray-600 sm:block">
					Showing {$displayedMedicines.length > 0 ? $displayedMedicines.length : 0} of {totalResults}
					results
				</div>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>

<style>
	/* defensive helper classes */
	:global(.-translate-y-full) {
		transform: translateY(-100%);
	}
	:global(.translate-y-0) {
		transform: translateY(0);
	}
</style>
