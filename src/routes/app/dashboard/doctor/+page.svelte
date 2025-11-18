<script lang="ts">
	let { data } = $props();
	let { user } = $derived(data);
</script>

<h1>Dashboard Dokter</h1>
<p>Selamat datang, dr. {user?.email}</p>
