<script lang="ts">
	import { Accordion, AccordionItem, AccordionContent } from '$lib/components/ui/accordion';
	import { Separator } from '$lib/components/ui/separator';

	import PrescriptionItem from './PrescriptionItem.svelte';
	import type { Prescription } from '../entities';

	export let prescriptions: Prescription[] | null;

	const fmtDateTime = (d: string | Date | undefined) => {
		if (!d) return '-';
		const dt = new Date(d);
		return dt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	};

	const statusColor = (s: string) => {
		switch (String(s).toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'paid':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-slate-100 text-slate-800';
		}
	};

	const totalCurrency = (n: number) =>
		n == null ? '-' : n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
</script>

<div class="space-y-4">
	{#if prescriptions === null}
		<div class="text-sm text-slate-500">No prescriptions</div>
	{:else if prescriptions.length === 0}
		<div class="text-sm text-slate-500">Prescriptions is empty</div>
	{:else}
		<Accordion type="single">
			{#each prescriptions as p (p.getId())}
				<AccordionItem value={p.getId()}>
					<div class="w-full">
						<div class="grid grid-cols-12 items-center gap-4 py-3">
							<div class="col-span-1">
								<span
									class={'inline-flex rounded-full px-2 py-1 text-xs ' + statusColor(p.getStatus())}
									>{p.getStatus()}</span
								>
							</div>

							<div class="col-span-3">
								<div class="text-sm font-medium">Prescribed</div>
								<div class="text-xs text-slate-500">{fmtDateTime(p.getPrescribedAt())}</div>
							</div>

							<div class="col-span-5">
								<div class="text-sm font-medium">Doctor</div>
								<div class="text-xs text-slate-500">{p.getDoctor()?.getFullName() ?? '-'}</div>
							</div>

							<div class="col-span-2 text-right">
								<div class="text-xs text-slate-400">Total</div>
								<div class="font-medium">{totalCurrency(p.getTotalCost())}</div>
							</div>
							<div class="col-span-1 text-right">
								<!-- arrow handled by AccordionTrigger -->
							</div>
						</div>
						<Separator />
					</div>

					<AccordionContent>
						<div class="mt-3">
							<!-- column header -->
							<div
								class="grid grid-cols-6 gap-4 border-b pb-2 text-xs font-semibold text-slate-400"
							>
								<div>Status</div>
								<div>Medication Name</div>
								<div>Form</div>
								<div>Frequency</div>
								<div>Quantity</div>
								<div class="text-right">Price</div>
							</div>

							<div class="mt-3 space-y-2">
								{#each p.getPrescriptionItems() as it (it.getId())}
									<PrescriptionItem item={it} />
								{/each}
							</div>

							{#if p.getNotes()}
								<div class="mt-4 text-sm text-slate-600">
									<div class="text-xs text-slate-400">Instructions</div>
									<div>{p.getNotes()}</div>
								</div>
							{/if}
						</div>
					</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	{/if}
</div>
