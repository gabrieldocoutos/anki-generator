<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
	<header class="bg-white/70 backdrop-blur-sm border-b border-pink-100">
		<div class="max-w-2xl mx-auto px-4 py-5 text-center">
			<h1 class="text-2xl font-bold text-rose-400 tracking-tight">Anki Generator</h1>
		</div>
	</header>
	<main class="max-w-2xl mx-auto px-4 py-10">
		{@render children()}
	</main>
</div>
