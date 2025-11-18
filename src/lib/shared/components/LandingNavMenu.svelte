<script lang="ts">
	import logo from '$lib/assets/logo-white.svg';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Search } from '@lucide/svelte';
</script>

<NavigationMenu.Root
	class="sticky top-0 z-50 w-full max-w-full bg-[#1A1A1A] text-center text-white shadow-md"
>
	<NavigationMenu.List class=" flex w-full items-center justify-center space-x-8 align-middle">
		<NavigationMenu.Item>
			<NavigationMenu.Link class="cursor-pointer">
				<div class=" h-[54px] w-[170px]">
					<img src={logo} alt="Logo" />
				</div>
			</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link class="cursor-pointer">Home</NavigationMenu.Link>
		</NavigationMenu.Item>
		<NavigationMenu.Item
			><NavigationMenu.Link class="cursor-pointer">Values</NavigationMenu.Link></NavigationMenu.Item
		>
		<NavigationMenu.Item
			><NavigationMenu.Link class="cursor-pointer">Announcements</NavigationMenu.Link
			></NavigationMenu.Item
		>
		<NavigationMenu.Item
			><NavigationMenu.Link href="/auth" class="cursor-pointer">Sign In</NavigationMenu.Link
			></NavigationMenu.Item
		>
		<NavigationMenu.Item><Search color="#ffffff" /></NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
