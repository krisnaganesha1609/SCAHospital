<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Pagination from '$lib/components/ui/pagination'; // Added Pagination Import
	import { SearchIcon, LogOut, Pill, Calendar, User, Activity } from '@lucide/svelte';
	import { format } from 'date-fns';
	import { Button } from '$lib/components/ui/button';
	import { writable } from 'svelte/store';
	import { PharmacyApproval } from '$lib/shared/entities';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { refreshAll } from '$app/navigation';

	// ---------- INITIAL DATA ----------
	let { data }: PageProps = $props();
	let { user } = $derived(data);

	// Data Prescriptions
	let prescriptions = $derived(data.prescriptions.map((p: any) => PharmacyApproval.fromPOJO(p)));

	// ---------- PAGINATION & SEARCH LOGIC (ADAPTED) ----------
	let searchQuery = $state(''); // Changed to rune for easier derived logic
	let currentPage = $state(1);
	const itemsPerPage = 5; // Set items per page
	let siblingCount = 1;

	// 1. Filter Logic (Search by Doctor Name or Status)
	let filteredPrescriptions = $derived.by(() => {
		if (searchQuery.trim() !== '') {
			const q = searchQuery.trim().toLowerCase();
			return prescriptions.filter(
				(p) =>
					p.getPrescription().getDoctor().getFullName().toLowerCase().includes(q) ||
					p.getStatus().toLowerCase().includes(q)
			);
		}
		return prescriptions;
	});

	// 2. Pagination Logic (Slice the array)
	// Note: If searching, we show ALL results (logic copied from Patient Admin)
	let displayedPrescriptions = $derived.by(() => {
		if (searchQuery.trim() !== '') {
			return filteredPrescriptions;
		}
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return prescriptions.slice(start, end);
	});

	// 3. Pagination Calculations
	let totalResults = $derived(prescriptions.length);
	let totalPages = $derived(Math.max(1, Math.ceil(totalResults / itemsPerPage)));

	// 4. Helper: Get Page Numbers
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

	// 5. Helper: Go To Page
	function goToPage(n: number) {
		if (n < 1) n = 1;
		if (n > totalPages) n = totalPages;
		currentPage = n;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// ---------- CANCEL MODAL LOGIC ----------
	let showCancelModal = $state(false);
	let selectedId = $state<string | null>(null);
	let selectedPrescriptionId = $state<string | null>(null);

	function openCancelModal(id: string, prescriptionId: string | null) {
		selectedId = id;
		selectedPrescriptionId = prescriptionId;
		showCancelModal = true;
	}

	function closeCancelModal() {
		showCancelModal = false;
		selectedId = null;
		selectedPrescriptionId = null;
	}

	// ---------- NAVBAR HIDE / SHOW ----------
	const navHidden = writable(false);
	let lastScrollY = 0;

	onMount(() => {
		function handleScroll() {
			const currentY = window.scrollY;
			if (currentY > lastScrollY && currentY > 50) {
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
	<title>Prescriptions Admin - SCA Hospital</title>
</svelte:head>

{#if showCancelModal}
	<div
		class="fixed inset-0 z-100 bg-black/50"
		onclick={closeCancelModal}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && closeCancelModal()}
	></div>

	<div class="fixed inset-0 z-101 flex items-center justify-center p-4 text-black">
		<form
			method="POST"
			action="?/cancel"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					closeCancelModal();
				};
			}}
		>
			<div class="relative w-full max-w-lg bg-white p-6 shadow-lg" style="border-radius: 32px;">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
						<LogOut color="#EC2D30" size={24} />
					</div>
					<button
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] text-2xl font-bold"
						onclick={closeCancelModal}
					>
						X
					</button>
				</div>

				<div class="flex flex-col space-y-2">
					<h3 class="text-left text-2xl font-bold">Cancel Prescription?</h3>
					<p class="text-left" style="color: #8E8E8E;">
						You are about to cancel this prescription. This action cannot be reversed.
					</p>
				</div>
				<div>
					<label class="mt-4 mb-2 block font-normal text-gray-700" for="cancelReason"
						>Reason for Cancellation (optional)</label
					>
					<Input type="text" name="cancelReason" placeholder="Type here..." />
				</div>

				<div class="mt-6 flex w-full justify-end space-x-3">
					<button
						class="rounded-full border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50"
						onclick={closeCancelModal}
					>
						Keep Prescription
					</button>

					<input type="hidden" name="pharmacyApprovalId" value={selectedId} />
					<input type="hidden" name="prescriptionId" value={selectedPrescriptionId} />
					<button
						type="submit"
						class="rounded-full bg-[#EC2D30] px-6 py-2 font-medium text-white hover:opacity-90"
					>
						Yes, Cancel it
					</button>
				</div>
			</div>
		</form>
	</div>
{/if}

<NavigationMenu.Root
	class={'sticky top-0 flex w-full max-w-full items-center justify-center bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<NavigationMenu.Item class="top-4.4 left-1/2 -translate-x-1/2">
			<InputGroup.Root
				class="hidden w-96 rounded-full border border-[#E5E7EB] bg-white py-6 pr-3 pl-2 shadow-sm sm:flex"
			>
				<InputGroup.Input
					bind:value={searchQuery}
					placeholder="Find medicine name, code..."
					class="border-none bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
				/>
				<InputGroup.Addon align="inline-end" class="rounded-full bg-white pr-1">
					<SearchIcon class="h-5 w-5" color="#1D69D1" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<div class="mx-auto flex w-full flex-col">
	<div class="min-h-[calc(100vh-64px)] p-4">
		<Item.Group>
			{#each displayedPrescriptions as presc (presc.getId())}
				<Accordion.Root type="single" class=" w-full">
					<Accordion.Item
						value={presc.getId()}
						class="w-full rounded-lg border border-gray-300"
					>
						<Accordion.Trigger class="min-w-full hover:no-underline">
							<Item.Root class="border-none bg-white p-6 shadow-sm">
								<Item.Content>
									<Item.Description>Prescribed By</Item.Description>
									<Item.Title class="flex items-center">
										<User size={16} class="mr-2 text-gray-400" />
										{presc.getPrescription().getDoctor().getFullName()}
									</Item.Title>
								</Item.Content>

								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>

								<Item.Content>
									<Item.Description>Prescribed For</Item.Description>
									<Item.Title class="flex items-center">
										<User size={16} class="mr-2 text-gray-400" />
										{presc.getPrescription().getMedicalRecord()?.getPatient()?.getFullName()}
									</Item.Title>
								</Item.Content>

								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>

								<Item.Content>
									<Item.Description>Date</Item.Description>
									<Item.Title class="flex items-center">
										<Calendar size={16} class="mr-2 text-gray-400" />
										{format(new Date(presc.getPrescription().getPrescribedAt()), 'dd MMM yyyy')}
									</Item.Title>
								</Item.Content>

								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>

								<Item.Content>
									<Item.Description>Total Cost</Item.Description>
									<Item.Title class="text-[#1D69D1]"
										>Rp {presc.getPrescription().getTotalCost().toLocaleString()}</Item.Title
									>
								</Item.Content>

								<div class="col-span-0 flex justify-center">
									<div class="h-10 w-px border-l border-gray-300"></div>
								</div>

								<Item.Content>
									<Item.Description>Status</Item.Description>
									<Item.Title>
										<span
											class="rounded-full px-3 py-1 text-[10px] font-black uppercase
                                        {presc.getPrescription().getStatus() === 'Approved'
												? 'bg-blue-100 text-blue-600'
												: presc.getPrescription().getStatus() === 'Dispensed'
													? 'bg-green-100 text-green-600'
													: presc.getPrescription().getStatus() === 'Cancelled'
														? 'bg-red-100 text-red-600'
														: 'bg-gray-100 text-gray-600'}"
										>
											{presc.getPrescription().getStatus()}
										</span>
									</Item.Title>
								</Item.Content>
							</Item.Root>
						</Accordion.Trigger>

						<Accordion.Content class="border-t border-gray-200 bg-gray-50 p-8">
							<div class="mb-6">
								<h4 class="mb-4 flex items-center text-sm font-bold tracking-tight text-gray-900">
									<Pill size={18} class="mr-2 text-[#1D69D1]" /> Medicines In Prescription
								</h4>
								<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
									{#each presc.getPrescription().getPrescriptionItems() as item}
										<div
											class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
										>
											<div>
												<p class="font-bold">{item.getMedicineName()}</p>
												<p class="text-xs text-gray-500">
													{item.getDosage()} • {item.getFrequency()}
												</p>
											</div>
											<div class="text-right">
												<p class="text-sm font-medium">Qty: {item.getQuantity()}</p>
												<p class="text-xs text-[#1D69D1]">
													Rp {item.getSubtotalPrice().toLocaleString()}
												</p>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<div class="flex items-center justify-end space-x-4 border-t border-gray-200 pt-4">
								{#if presc.getPrescription().getStatus() !== 'Cancelled' && presc
										.getPrescription()
										.getStatus() !== 'Dispensed'}
									<Button
										variant="outline"
										class="h-12 w-44 rounded-full border-2 border-[#EC2D30] font-bold text-[#EC2D30] hover:bg-red-50 hover:text-[#EC2D30]"
										onclick={() => openCancelModal(presc.getId(), presc.getPrescriptionId())}
									>
										Cancel
									</Button>

									{#if presc.getPrescription().getStatus() === 'Approved'}
										<form
											method="POST"
											action="?/dispense"
											use:enhance={({}) => {
												return async ({ result, update }) => {
													if (result.type === 'failure') {
														toast.error('Dispense Failed', {
															description: 'Could not dispense the prescription.',
															closeButton: true
														});
													} else {
														toast.success('Dispense Successful', {
															description: 'Wait for a moment to refresh...',
															closeButton: true
														});
														refreshAll();
													}
													update({ reset: false });
												};
											}}
										>
											<input type="hidden" name="pharmacyApprovalId" value={presc.getId()} />
											<input
												type="hidden"
												name="prescriptionId"
												value={presc.getPrescriptionId()}
											/>
											<Button
												type="submit"
												class="h-12 w-44 rounded-full bg-[#0C9D61] font-bold text-white hover:bg-[#0a8652]"
											>
												Dispense
											</Button>
										</form>
									{:else}
										<form
											method="POST"
											action="?/approve"
											use:enhance={({}) => {
												return async ({ result, update }) => {
													if (result.type === 'failure') {
														toast.error('Approval Failed', {
															description: 'Could not approve the prescription.',
															closeButton: true
														});
													} else {
														toast.success('Approval Successful', {
															description: 'Wait for a moment to refresh...',
															closeButton: true
														});
														refreshAll();
													}
													update({ reset: false });
												};
											}}
										>
											<input
												type="hidden"
												name="prescriptionId"
												value={presc.getPrescriptionId()}
											/>
											<input type="hidden" name="pharmacyApprovalId" value={presc.getId()} />
											<input type="hidden" name="pharmacistId" value={user?.id} />

											<Button
												type="submit"
												class="h-12 w-44 rounded-full bg-[#1D69D1] font-bold text-white hover:opacity-90"
											>
												Approve
											</Button>
										</form>
									{/if}
								{:else if presc.getPrescription().getStatus() === 'Dispensed'}
									<div
										class="flex items-center rounded-full border border-green-200 bg-green-50 px-6 py-2 font-bold text-green-600"
									>
										<Activity size={20} class="mr-2" /> Status: Fully Dispensed
									</div>
								{:else}
									<div class="font-bold text-red-500 italic">Prescription Cancelled</div>
								{/if}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/each}
		</Item.Group>
	</div>

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
				<div class="mr-4 text-sm whitespace-nowrap text-gray-600">
					Showing {displayedPrescriptions.length} of {totalResults} results
				</div>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>
