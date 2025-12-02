<script lang="ts">
	import { Card, CardHeader, CardContent } from '$lib/components/ui/card'; // sesuaikan jika beda
	import { Separator } from '$lib/components/ui/separator'; // sesuaikan jika beda
	import PrescriptionList from './PrescriptionList.svelte';
	import type { MedicalRecord, Prescription, PrescriptionItems } from '$lib/shared/entities'; // contoh path

	export let record: MedicalRecord; // expect instance of MedicalRecord (or its toJson)
	export let prescriptions: Prescription[]; // array of Prescription instances

	const fmtDate = (d: string | Date | undefined) => {
		if (!d) return '-';
		const dt = new Date(d);
		return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
	};

	const formatVital = (v: Record<string, any>) => {
		if (!v) return {};
		return v;
	};
</script>

<Card class="overflow-hidden rounded-2xl p-0">
	<div class="p-6">
		<!-- visit header -->
		<div class="mb-4 flex items-center justify-between">
			<div class="font-semibold text-slate-800">Visit — {fmtDate(record?.getVisitDate())}</div>
		</div>

		<!-- top grid -->
		<div class="grid grid-cols-14 gap-2 text-sm text-slate-700">
			<div class="col-span-2 space-y-2">
				<div class="text-xs text-slate-400">Visit Type</div>
				<div class="font-medium">{record?.getVisitType() ?? '-'}</div>

				<div class="mt-4 text-xs text-slate-400">Primary Complaint</div>
				<div class="text-slate-600">{record?.getComplaints() ?? '-'}</div>
			</div>
			<div class="col-span-0 flex justify-center">
				<div class="h-30 w-px border-l border-gray-300"></div>
			</div>
			<div class="col-span-2 space-y-2">
				<div class="text-xs text-slate-400">Medical History</div>
				<div class="text-slate-600">{record?.getHistory() ?? '-'}</div>
				<div class="text-xs text-slate-400">Physical Examination</div>
				<div class="text-slate-600">{record?.getPhysicalExam() ?? '-'}</div>
			</div>
			<div class="col-span-0 flex justify-center">
				<div class="h-30 w-px border-l border-gray-300"></div>
			</div>
			<div class="col-span-2 space-y-2">
				<div class="text-xs text-slate-400">Diagnosis</div>
				<div class="text-slate-600">{record?.getDiagnosis() ?? '-'}</div>
				<div class="mt-3 text-xs text-slate-400">Treatment Plan</div>
				<div class="text-slate-600">{record?.getTreatmentPlan() ?? '-'}</div>
			</div>
			<div class="col-span-0 flex justify-center">
				<div class="h-30 w-px border-l border-gray-300"></div>
			</div>
			<div class="col-span-2 space-y-2">
				<div class="text-xs text-slate-400">Vitals</div>
				{#if record?.getVital()}
					{#each Object.entries(formatVital(record.getVital())) as [k, v]}
						<div class="text-sm">
							<span class="text-xs text-slate-400">{k.toUpperCase()}:</span>
							<span class="font-medium"> {String(v)}</span>
						</div>
					{/each}
				{:else}
					<div class="text-slate-600">-</div>
				{/if}
			</div>
			<div class="col-span-0 flex justify-center">
				<div class="h-30 w-px border-l border-gray-300"></div>
			</div>
			<div class="col-span-2 space-y-2">
				<div class="mt-3 text-xs text-slate-400">Follow-Up Date</div>
				<div class="text-slate-600">{fmtDate(record?.getFollowUpDate())}</div>

				<div class="mt-3 text-xs text-slate-400">Notes</div>
				<div class="text-slate-600">{record?.getNotes() ?? '-'}</div>
			</div>
		</div>
	</div>

	<div class="border-t">
		<!-- prescription header -->
		<div class="px-6 py-4">
			<div class="flex items-center gap-4">
				<h3 class="text-2xl font-semibold text-sky-600">Prescription</h3>
				<div class="h-1 flex-1 rounded bg-sky-600/30"></div>
			</div>
		</div>

		<div class="px-6 pb-6">
			<PrescriptionList {prescriptions} />
		</div>
	</div>
</Card>

<style>
	/* small visual tweaks (optional) */
</style>
