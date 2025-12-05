<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Footer from '$lib/shared/components/Footer.svelte';
	import logo from '$lib/assets/logo.svg';
	import herobg from '$lib/assets/hero-bg-login.png';
	import LandingNavMenu from '$lib/shared/components/LandingNavMenu.svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login - SCA Hospital</title>
</svelte:head>

<LandingNavMenu />

<div
	class="relative flex min-h-screen w-full flex-col overflow-hidden bg-cover bg-center"
	style="background-image: url({herobg});"
>
	<div
		class="pointer-events-none absolute inset-0 bg-linear-to-b from-gray-800/70 via-gray-700/50 to-gray-600/35 mask-[linear-gradient(to_bottom,black_10%,black_20%,transparent_100%)]"
	></div>
	<!-- Main area: grows to fill available space and centers the card -->
	<main class="mt-8 flex flex-1 items-center justify-center px-4">
		<Card.Root class="w-full max-w-sm rounded-4xl bg-white/90 p-6 shadow-2xl backdrop-blur-lg">
			<Card.Header class="flex flex-col items-center">
				<img src={logo} alt="Logo" class="mb-4 h-20" />
			</Card.Header>

			<Card.Content>
				<form
					method="POST"
					action="?/login"
					class="flex flex-col gap-6"
					use:enhance={({}) => {
						isLoading = true;
						return async ({ result, update }) => {
							if (result.type === 'failure') {
								toast.error('Login Failed', {
									description: 'Invalid email or password.',
									closeButton: true
								});
							} else {
								toast.success('Login Successful', {
									description: 'Wait a moment while we redirect you...',
									closeButton: true
								});
							}
							isLoading = false;
							update({ reset: false });
						};
					}}
				>
					<div class="grid gap-2">
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="Email"
							required
							class="rounded-full py-6 text-lg"
						/>
					</div>

					<div class="grid gap-2">
						<Input
							id="password"
							type="password"
							name="password"
							placeholder="Password"
							required
							class="rounded-full py-6 text-lg"
						/>
					</div>

					{#if isLoading}
						<div class="flex justify-center">
							<svg
								class="h-8 w-8 animate-spin text-blue-600"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					{:else}
						<Button type="submit" class="mt-2 w-full rounded-full py-6">Login</Button>
					{/if}
				</form>
			</Card.Content>
		</Card.Root>
	</main>

	<!-- Footer row: full width, not constrained by the centered card -->
	<footer class="w-full shrink-0">
		<div class="mx-auto max-w-full">
			<!-- Footer component is now inside a full-width container so it won't be squished -->
			<Footer />
		</div>
	</footer>
</div>

<style>
	/* Make sure the page never scrolls and uses the full viewport height */
	:global(html),
	:global(body) {
		height: 100%;
		margin: 0;
	}

	/* Optional: keep overflow visible only when necessary. If you truly want no scrolling at all,
uncomment the next rule, but it may hide content on very small devices. */
	/* :global(body) { overflow: hidden; } */

	/* Small tweak: ensure the footer image inside Footer.svelte is responsive and won't force large width */
	:global(.footer-logo) {
		max-width: 100%; /* replace fixed w-96 */
		width: 100%;
		height: auto;
		opacity: 0.9;
	}
</style>
