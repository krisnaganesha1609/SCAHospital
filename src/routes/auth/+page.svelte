<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<Card.Root
	class="absolute top-1/2 left-1/2 mx-auto my-8 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] transform"
>
	<Card.Header>
		<Card.Title class="text-center text-2xl">Login</Card.Title>
	</Card.Header>
	<Card.Content>
	<form method="POST" action="?/login">
		<div class="flex flex-col gap-6">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" name="email" placeholder="doctor@example.com" required />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
					<a href="##" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
						Forgot your password?
					</a>
				</div>
				<Input id="password" type="password" name="password" required />
			</div>

			<Button type="submit" class="w-full mt-4">Login</Button>
		</div>
	</form>
</Card.Content>

</Card.Root>
