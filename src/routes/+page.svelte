<script lang="ts">
	let text = $state('');
	let card = $state<string | null>(null);
	let loading = $state(false);
	let error = $state('');
	let copied = $state(false);

	async function generate() {
		if (!text.trim()) return;

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

<section class="space-y-6">
	<form onsubmit={generate} class="space-y-5">
		<div>
			<label for="text" class="block text-sm font-medium text-rose-400 mb-2">
				Paste your text
			</label>
			<textarea
				id="text"
				bind:value={text}
				rows="6"
				placeholder="Paste the text you want to turn into an Anki card..."
				class="w-full rounded-2xl border border-pink-200 bg-white/80 px-4 py-3 text-sm text-gray-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-y shadow-sm"
			></textarea>
		</div>

		<button
			type="submit"
			disabled={loading || !text.trim()}
			class="w-full rounded-2xl bg-rose-400 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-rose-500 hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md"
		>
			{loading ? 'Generating...' : 'Generate Card'}
		</button>
	</form>

	{#if error}
		<div class="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
			{error}
		</div>
	{/if}

	{#if card}
		<div class="rounded-2xl border border-pink-100 bg-white/80 backdrop-blur-sm p-6 shadow-md space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-base font-semibold text-rose-400">Your Cloze Card</h2>
				<button
					onclick={copyToClipboard}
					class="text-xs font-medium text-rose-400 hover:text-rose-500 transition-colors"
				>
					{copied ? 'Copied!' : 'Copy HTML'}
				</button>
			</div>
			<div class="rounded-xl bg-pink-50/60 p-4">
				<p class="text-xs font-semibold text-rose-300 uppercase tracking-wide mb-2">Preview</p>
				<div class="text-gray-800">{@html card.replaceAll(/\{\{c\d+::(.*?)\}\}/g, '<span class="font-bold text-rose-500 underline decoration-dotted">$1</span>')}</div>
			</div>
			<div class="rounded-xl bg-purple-50/60 p-4">
				<p class="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">Raw HTML</p>
				<pre class="text-xs text-gray-600 whitespace-pre-wrap break-words font-mono">{card}</pre>
			</div>
		</div>
	{/if}
</section>
