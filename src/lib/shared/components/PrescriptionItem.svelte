<script lang="ts">
	import type { PrescriptionItems } from '../entities';

	export let item: PrescriptionItems;


	const formatPrice = (n: number) =>
		n == null
			? '-'
			: (n).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR'
				});
</script>

<div class="grid grid-cols-8 items-center gap-4 py-2 text-sm">
	<div class="font-medium">{item.getMedicineName() ?? item.getMedicine() ?? '-'}</div>
	<div class="text-sm text-slate-600">{item.getForm() ?? '-'}</div>
	<div class="text-slate-600">{item.getStrength() ?? '-'}</div>
	<div class="text-slate-600">{item.getDosage() ?? '-'}</div>
	<div class="text-slate-600">{item.getFrequency() ?? '-'}</div>
	<div class="text-slate-600">{item.getQuantity() ?? '-'}</div>
	<div class="text-slate-600">{item.getInstructions() ?? '-'}</div>
	<div class="text-right font-medium">{formatPrice(item.getSubtotalPrice())}</div>
</div>
<hr>
<!-- {#each item. as note}
	<div class="mt-1 text-xs italic text-slate-500">* {note}</div>
{/each} -->
