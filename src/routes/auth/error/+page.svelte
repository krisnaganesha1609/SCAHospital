<script>
	import { page } from '$app/state';
</script>

<div class="mx-auto my-8 w-1/2 max-w-2xl rounded border border-red-300 bg-red-50 p-6">
	<h1 class="mb-4 text-2xl font-bold">Authentication Error</h1>
	<p class="mb-4">An error occurred during authentication:</p>
	<pre class="rounded bg-red-100 p-4 text-red-800">{page.error?.message}</pre>
	<p class="mt-4">Please try again or contact support if the issue persists.</p>
</div>
