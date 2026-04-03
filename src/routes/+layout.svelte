<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
	<main class="max-w-xl mx-auto px-6 py-14">
		{@render children()}
	</main>
</div>
