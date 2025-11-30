<script lang="ts">
	import type { PrescriptionItems } from '../entities';

	export let item: PrescriptionItems;

	const formatPrice = (n: number) =>
		n == null
			? '-'
			: (n * (item.getQuantity() ?? 1)).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR'
				});
</script>

<div class="grid grid-cols-6 items-center gap-4 py-2 text-sm">
	<div class="font-medium">{item.getMedicineName() ?? item.getMedicine()?.getName() ?? '-'}</div>
	<div class="text-sm text-slate-600">{item.getForm() ?? '-'}</div>
	<div class="text-slate-600">{item.getFrequency() ?? '-'}</div>
	<div class="text-slate-600">{item.getQuantity() ?? '-'}</div>
	<div class="text-right font-medium">{formatPrice(item.getUnitPrice())}</div>
</div>
