<svelte:options accessors={true} />

<script lang="ts">
	import type { SuggestionProps } from '@tiptap/suggestion';

	export let props: SuggestionProps;
	const SCROLL_HEIGHT = 400;

	let selectedIndex = 0;

	export const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
		if (event.key === 'ArrowUp') {
			upHandler();
			return true;
		}

		if (event.key === 'ArrowDown') {
			downHandler();
			return true;
		}

		if (event.key === 'Enter') {
			enterHandler();
			return true;
		}

		return false;
	};
	const upHandler = () => {
		selectedIndex = (selectedIndex + props.items.length - 1) % props.items.length;
	};

	const downHandler = () => {
		selectedIndex = (selectedIndex + 1) % props.items.length;
	};

	const enterHandler = () => {
		onSelect(selectedIndex);
	};

	const onSelect = (idx: number) => {
		const item = props.items[idx];
		if (item) {
			props.command({ id: item });
		}
	};
</script>

<div>
	{#if props.items.length === 0}
		<p>No results</p>
	{:else}
		<div style="max-height:{SCROLL_HEIGHT}px">
			{#each props.items as item, idx}
				<div
					class:selected={selectedIndex === idx}
					class="cursor-pointer"
					on:click={() => onSelect(idx)}
				>
					{item}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.selected {
		background-color: #f3f3f3;
		color: #333;
	}
	.cursor-pointer {
		cursor: pointer;
	}
</style>
