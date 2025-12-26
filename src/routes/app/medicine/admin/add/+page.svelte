<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Select from '$lib/components/ui/select';
    import { ArrowLeft, Save } from '@lucide/svelte';
    import { toast } from 'svelte-sonner';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
	import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';

    let { data } = $props();
    let { user } = $derived(data);

    // State menggunakan Svelte 5 runes
    let name = $state('');
    let form = $state('Tablet');
    let strength = $state('');
    let unitPrice = $state<number | undefined>(undefined);
    let packaging = $state('');
    let stockQty = $state<number>(0);
    
    let isSubmitting = $state(false);

    const forms = [
        { value: 'Tablet', label: 'Tablet' },
        { value: 'Capsule', label: 'Capsule' },
        { value: 'Syrup', label: 'Syrup' },
        { value: 'Injection', label: 'Injection' }
    ];

    let triggerContentForm = $derived(forms.find((f) => f.value === form)?.label ?? 'Select form');

    let formEl: HTMLFormElement | null = null;

    function validateForm(): boolean {
        if (!name || !form || !strength || unitPrice === undefined) {
            toast.error('Form incomplete', { description: 'Nama, bentuk, strength, dan harga wajib diisi.' });
            return false;
        }
        return true;
    }

    function submitExternal() {
        if (!validateForm()) return;
        isSubmitting = true;

        if (formEl) {
            if (typeof (formEl as any).requestSubmit === 'function') {
                (formEl as any).requestSubmit();
            } else {
                formEl.submit();
            }
        }
    }
</script>

<svelte:head>
    <title>Add New Medicine</title>
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
                <h1 class="text-lg leading-tight font-bold text-gray-900">Add New Medicine</h1>
                <p class="font-mono text-[11px] text-gray-400">Register a new medicine to the inventory</p>
            </div>
        </div>

        <form
            bind:this={formEl}
            method="POST"
            action="?/createMedicine"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ result, update }) => {
                    isSubmitting = false;
                    if (result.type === 'success') {
                        toast.success('Medicine created successfully');
                        goto('/app/medicine/admin');
                    } else {
                        toast.error('Failed to create medicine');
                    }
                    await update();
                };
            }}
            class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <div class="flex flex-col gap-2">
                    <label for="name" class="px-1 text-xs font-semibold text-gray-600">Medicine Name</label>
                    <input
                        name="name"
                        class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
                        bind:value={name}
                        placeholder="e.g. Paracetamol"
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
                                <Select.Item value={f.value} label={f.label} class="cursor-pointer py-3 text-sm font-medium">
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
                        class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
                        bind:value={strength}
                        placeholder="e.g. 500 mg"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="unitPrice" class="px-1 text-xs font-semibold text-gray-600">Unit Price</label>
                    <input
                        type="number"
                        name="unitPrice"
                        class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
                        bind:value={unitPrice}
                        placeholder="e.g. 5000"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="unitType" class="px-1 text-xs font-semibold text-gray-600">Packaging</label>
                    <input
                        name="unitType"
                        class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
                        bind:value={packaging}
                        placeholder="e.g. 10 strips"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="stockQty" class="px-1 text-xs font-semibold text-gray-600">Stock Qty</label>
                    <input
                        type="number"
                        name="stockQty"
                        class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
                        bind:value={stockQty}
                        placeholder="0"
                    />
                </div>
            </div>
        </form>

        <div class="mt-8 flex justify-end">
            <Button
                type="button"
                disabled={isSubmitting}
                onclick={submitExternal}
                class="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#1D69D1] text-base font-bold text-white shadow-lg transition-all hover:bg-[#1656b0] active:scale-95"
            >
                {#if isSubmitting}
                    <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {:else}
                    <Save size={20} />
                    <span>Save Medicine</span>
                {/if}
            </Button>
        </div>
    </div>
</div>

<style>
    :global(button[role='combobox']) {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    :global(.rounded-2xl) {
        border-radius: 20px;
    }
</style>