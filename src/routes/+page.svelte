<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let text = $state('');
	let card = $state<string | null>(null);
	let loading = $state(false);
	let error = $state('');
	let copied = $state(false);

	async function generate() {
		if (!text.trim() || loading) return;

		loading = true;
		error = '';
		card = null;

		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Failed to generate card');
			}

			const data = await res.json();
			card = data.html;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Something went wrong';
		} finally {
			loading = false;
		}
	}

	async function copyToClipboard() {
		if (!card) return;
		await navigator.clipboard.writeText(card);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="space-y-7">

	<!-- Header -->
	<div class="text-center space-y-2 pb-2">
		<p class="text-3xl select-none">🌸</p>
		<h1 class="text-3xl font-bold text-rose-400 tracking-tight">Anki Generator</h1>
		<p class="text-sm text-pink-300 font-light">Turn any text into beautiful cloze cards</p>
	</div>

	<!-- Input card -->
	<div class="bg-white/75 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-sm shadow-pink-100/50 p-6 space-y-4">
		<form onsubmit={generate} class="space-y-4">
			<div class="space-y-2">
				<label for="text" class="block text-xs font-semibold uppercase tracking-widest text-pink-400">
					Your text
				</label>
				<textarea
					id="text"
					bind:value={text}
					rows="6"
					placeholder="Paste the text you want to turn into Anki cards..."
					disabled={loading}
					class="w-full bg-rose-50/60 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-rose-950 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none leading-relaxed disabled:opacity-60 transition-all caret-rose-400"
					onkeydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); } }}
				></textarea>
				<p class="text-[11px] text-pink-200 pl-1">↵ Enter to generate &nbsp;·&nbsp; Shift+↵ for new line</p>
			</div>

			<button
				type="submit"
				disabled={loading || !text.trim()}
				class="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200/60 hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-200/60 active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md"
			>
				{loading ? '✨ Generating…' : '✨ Generate Card'}
			</button>
		</form>
	</div>

	<!-- Loading dots -->
	{#if loading}
		<div transition:fade={{ duration: 200 }} class="flex justify-center gap-2 py-1">
			<div class="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style="animation-delay: 0ms"></div>
			<div class="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style="animation-delay: 130ms"></div>
			<div class="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style="animation-delay: 260ms"></div>
		</div>
	{/if}

	<!-- Error -->
	{#if error}
		<div transition:fade={{ duration: 200 }} class="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-500">
			{error}
		</div>
	{/if}

	<!-- Result -->
	{#if card}
		<div transition:fly={{ y: 16, duration: 350 }} class="bg-white/75 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-sm shadow-pink-100/50 p-6 space-y-5">

			<div class="flex items-center justify-between">
				<h2 class="text-xs font-semibold uppercase tracking-widest text-pink-400">Your Card 🎴</h2>
				<button
					onclick={copyToClipboard}
					class="text-xs font-medium transition-colors duration-150"
					class:text-rose-400={!copied}
					class:hover:text-rose-500={!copied}
					class:text-emerald-400={copied}
				>
					{copied ? '✓ Copied!' : 'Copy HTML'}
				</button>
			</div>

			<!-- Preview -->
			<div class="space-y-2">
				<p class="text-[10px] font-semibold uppercase tracking-widest text-pink-300">Preview</p>
				<div class="rounded-2xl bg-pink-50/80 px-4 py-3 text-sm text-rose-950 leading-[1.85]">
					{@html card.replaceAll(/\{\{c\d+::(.*?)\}\}/g, '<span style="color:#e85d8a;font-weight:700;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;">$1</span>')}
				</div>
			</div>

			<!-- Raw -->
			<div class="space-y-2">
				<p class="text-[10px] font-semibold uppercase tracking-widest text-pink-300">Raw HTML</p>
				<div class="rounded-2xl bg-fuchsia-50/60 px-4 py-3">
					<pre class="text-xs text-fuchsia-400 font-mono leading-relaxed whitespace-pre-wrap break-all">{card}</pre>
				</div>
			</div>

		</div>
	{/if}

</div>
