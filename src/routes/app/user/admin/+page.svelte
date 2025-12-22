<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageProps } from './$types';
    import * as NavigationMenu from '$lib/components/ui/navigation-menu';
    import * as InputGroup from '$lib/components/ui/input-group';
    import * as Item from '$lib/components/ui/item';
    import * as Pagination from '$lib/components/ui/pagination';
    import * as Accordion from '$lib/components/ui/accordion';
    import { SearchIcon, User as UserIcon, Mail, ShieldCheck, Phone } from '@lucide/svelte';
    import { User } from '$lib/shared/entities/User';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { writable, derived } from 'svelte/store';

    // ---------- INITIAL DATA ----------
    let { data }: PageProps = $props();
    const allUsers: User[] = data.users.map((u: any) => User.fromPOJO(u));

    // ---------- PAGINATION SYSTEM (Based on Patients) ----------
    const userPaginationStore = writable({
        currentPage: 1,
        itemsPerPage: 10
    });

    let { itemsPerPage } = $userPaginationStore;
    const totalResults = allUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

    const displayedUsers = derived(userPaginationStore, ($store) => {
        const start = ($store.currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, totalResults);
        return allUsers.slice(start, end);
    });

    function goToPage(n: number) {
        if (n >= 1 && n <= totalPages) {
            userPaginationStore.update(s => ({ ...s, currentPage: n }));
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ---------- NAVBAR HIDE / SHOW ----------
    const navHidden = writable(false);
    let lastScrollY = 0;
    onMount(() => {
        function handleScroll() {
            const currentY = window.scrollY;
            navHidden.set(currentY > lastScrollY && currentY > 50);
            lastScrollY = Math.max(0, currentY);
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<svelte:head>
    <title>User Management - SCA Hospital</title>
</svelte:head>

<!-- NAVBAR SECTION ARGH, NEED HELP PLOX -->
<NavigationMenu.Root
	class={'sticky top-0 z-0 flex w-full max-w-full items-center justify-end bg-white text-black shadow-md transition-transform duration-200 ' +
		($navHidden ? '-translate-y-full' : 'translate-y-0')}
>

	<!-- keep NavigationMenu.List as container (positioning context) -->
	<NavigationMenu.List class="flex items-center justify-center px-4 py-5">
		<!-- ABSOLUTELY CENTERED LOGO (always centered regardless of other items) -->
		<NavigationMenu.Item class="absolute top-4.4 left-1/2 -translate-x-1/2">
			<InputGroup.Root
				class="hidden w-72 rounded-full border border-[#E5E7EB] bg-white py-6 pr-3 pl-2 shadow-sm sm:flex"
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
		<!-- RIGHT-ALIGNED SEARCH (kept inside NavigationMenu.Item) -->
		<NavigationMenu.Item class="flex items-center">
			<Button
				class="rounded-full bg-[#1D69D1] px-6 py-6 text-sm text-white shadow-sm hover:opacity-90"
				onclick={() => goto('/app/user/admin/add')}
			>
				Add New User
			</Button>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<div class="min-h-screen p-4">
    <Item.Group>
        {#each $displayedUsers as user (user.getUserId())}
            <Accordion.Root type="single" class="w-full mb-3">
                <Accordion.Item value={user.getUserId()} class="w-full border border-gray-300 bg-white rounded-lg shadow-sm">
                    <Accordion.Trigger class="w-full hover:no-underline" onclick={() => goto(`/app/user/admin/edit?id=${encodeURIComponent(user.getUserId())}`)}>
                        <Item.Root class="border-none shadow-none p-4 grid grid-cols-7 gap-2">
                            <Item.Content class="col-span-2">
                                <Item.Description class="flex items-center gap-1">
                                    <Mail size={12}/> Email (Username)
                                </Item.Description>
                                <Item.Title class="text-xs truncate">{user.getEmail()}</Item.Title>
                                <Item.Title class="text-[#1D69D1]">{user.getUsername()}</Item.Title>
                            </Item.Content>

                            <div class="flex justify-center items-center"><div class="h-10 w-px bg-gray-200"></div></div>

                            <Item.Content class="col-span-1">
                                <Item.Description class="flex items-center gap-1">
                                    <UserIcon size={12}/> Full Name
                                </Item.Description>
                                <Item.Title>{user.getFullName()}</Item.Title>
                            </Item.Content>

                            <div class="flex justify-center items-center"><div class="h-10 w-px bg-gray-200"></div></div>

                            <Item.Content class="col-span-1">
                                <Item.Description class="flex items-center gap-1">
                                    <ShieldCheck size={12}/> Role
                                </Item.Description>
                                <Item.Title class="capitalize">{user.getRole()}</Item.Title>
                            </Item.Content>

                            <div class="flex justify-center items-center"><div class="h-10 w-px bg-gray-200"></div></div>

                            <Item.Content class="col-span-1">
                                <Item.Description class="flex items-center gap-1">
                                    <Phone size={12}/> Phone Number
                                </Item.Description>
                                <Item.Title>{user.getPhone()}</Item.Title>
                            </Item.Content>
                        </Item.Root>
                    </Accordion.Trigger>
                </Accordion.Item>
            </Accordion.Root>
        {/each}
    </Item.Group>

    <Pagination.Root
        count={totalResults}
        perPage={itemsPerPage}
        page={$userPaginationStore.currentPage}
        class="mt-8 flex justify-center pb-8"
    >
        {#snippet children({ pages, currentPage })}
            <Pagination.Content class="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm">
                <Pagination.Item>
                    <Pagination.PrevButton onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        <span class="px-3 text-[#1D69D1] font-bold disabled:opacity-40">Prev</span>
                    </Pagination.PrevButton>
                </Pagination.Item>

                {#each pages as page (page.key)}
                    {#if page.type === 'ellipsis'}
                        <Pagination.Ellipsis />
                    {:else}
                        <Pagination.Item>
                            <Pagination.Link
                                {page}
                                isActive={currentPage === page.value}
                                class="h-10 w-10 rounded-full font-bold {currentPage === page.value ? 'bg-[#1D69D1] text-white' : 'text-[#1D69D1] hover:bg-blue-50'}"
                                onclick={() => goToPage(page.value)}
                            >
                                {page.value}
                            </Pagination.Link>
                        </Pagination.Item>
                    {/if}
                {/each}

                <Pagination.Item>
                    <Pagination.NextButton onclick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        <span class="px-3 text-[#1D69D1] font-bold disabled:opacity-40">Next</span>
                    </Pagination.NextButton>
                </Pagination.Item>
            </Pagination.Content>
        {/snippet}
    </Pagination.Root>
</div>
