<script lang="ts">
	import { Medicine } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { ArrowLeft, Save } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	// Buat interface sederhana untuk data dari server
	interface MedicinePageData {
		medicine: any; // Untuk halaman edit
		medicines: any[]; // Untuk halaman list
		[key: string]: any;
	}

	// Gunakan as untuk memaksa tipe pada $props
	let { data } = $props<{ data: MedicinePageData }>();

	// Sekarang ini tidak akan merah lagi
	const medicine = Medicine.fromPOJO(data.medicine);

	// Form states menggunakan rune $state
	let name = $state(medicine.getName());
	let form = $state(medicine.getForm());
	let strength = $state(medicine.getStrength());
	let unitPrice = $state(medicine.getUnitPrice());
	let packaging = $state(medicine.getUnitType());
	let stockQty = $state(medicine.getStockQty());

	let isSubmitting = $state(false);

	// Opsi untuk Form Dropdown
	const forms = [
		{ value: 'Tablet', label: 'Tablet' },
		{ value: 'Capsule', label: 'Capsule' },
		{ value: 'Syrup', label: 'Syrup' },
		{ value: 'Injection', label: 'Injection' }
	];

	let triggerContentForm = $derived(forms.find((f) => f.value === form)?.label ?? 'Select Form');
</script>

<svelte:head>
	<title>Edit Medicine - {medicine.getName()}</title>
</svelte:head>

<div class="min-h-screen bg-[#F3F5F7] p-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-6 flex items-center gap-4">
			<Button
				variant="ghost"
				class="h-10 w-10 rounded-full border border-gray-200 bg-white p-0 shadow-sm hover:bg-gray-50"
				onclick={() => window.history.back()}
			>
				<ArrowLeft size={18} class="text-gray-600" />
			</Button>
			<div>
				<h1 class="text-lg leading-tight font-bold text-gray-900">Edit Medicine Details</h1>
				<p class="font-mono text-[11px] text-gray-400">ID: {medicine.getId()}</p>
			</div>
		</div>

		<form
			id="medicineForm"
			method="POST"
			action="?/updateMedicine"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						toast.success('Medicine updated successfully');
						goto('/app/medicine/admin');
					}
					await update();
				};
			}}
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
		>
			<input type="hidden" name="id" value={medicine.getId()} />

			<div class="grid grid-cols-3 gap-x-6 gap-y-6 gap-4">
				<div class="flex flex-col gap-2">
					<label for="name" class="px-1 text-xs font-semibold text-gray-600">Medicine Name</label>
					<input
						name="name"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={name}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="form" class="px-1 text-xs font-semibold text-gray-600">Form</label>
					<Select.Root type="single" name="form" bind:value={form}>
						<Select.Trigger
							class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-left text-sm font-medium text-gray-900 focus:ring-[#1D69D1]/10"
						>
							{triggerContentForm}
						</Select.Trigger>
						<Select.Content class="rounded-xl border border-gray-100 shadow-xl">
							{#each forms as f}
								<Select.Item
									value={f.value}
									label={f.label}
									class="cursor-pointer py-3 text-sm font-medium"
								>
									{f.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex flex-col gap-2">
					<label for="strength" class="px-1 text-xs font-semibold text-gray-600">Strength</label>
					<input
						name="strength"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={strength}
						placeholder="e.g. 500 mg"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="unitPrice" class="px-1 text-xs font-semibold text-gray-600">Unit Price</label>
					<input
						type="number"
						name="unitPrice"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={unitPrice}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="unitType" class="px-1 text-xs font-semibold text-gray-600">Packaging</label>
					<input
						name="unitType"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={packaging}
						placeholder="e.g. Strips, Bottle"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="stockQty" class="px-1 text-xs font-semibold text-gray-600">Stock Qty</label>
					<input
						type="number"
						name="stockQty"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={stockQty}
					/>
				</div>
			</div>
		</form>

		<div class="mt-8 flex justify-end">
			<Button
				form="medicineForm"
				type="submit"
				disabled={isSubmitting}
				class="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#1D69D1] px-8 text-base font-bold text-white shadow-lg transition-all hover:bg-[#1656b0] active:scale-95"
			>
				{#if isSubmitting}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					<Save size={20} />
					<span>Save Medicine</span>
				{/if}
			</Button>
		</div>
	</div>
</div>

<style>
	:global(.rounded-2xl) {
		border-radius: 20px;
	}
</style>
