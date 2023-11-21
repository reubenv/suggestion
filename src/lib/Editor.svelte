<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Mention from '@tiptap/extension-mention';
	import suggestion from './slash/suggestion';

	let element: Element;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Mention.configure({
					HTMLAttributes: {
						class: 'mention'
					},
					suggestion
				})
			],
			content:
				'<p>1:1 This is the beginging, 1:2 and this is the end. 1:6 But it WAS NOT. THIS is the end. 1:7 Got you again!</p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;

				let content = getBeforeAndAfter(editor.state.selection.$anchor.pos);
				let matches = findVerseMarkers(content.before, 'last');
				let matches2 = findVerseMarkers(content.after, 'first');
				console.log(matches, matches2);
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const getBeforeAndAfter = (position: number) => {
		let textContent = editor.getText();
		let before = textContent.slice(0, position - 1);
		let after = textContent.slice(position - 1);
		return { before, after };
	};
	const findVerseMarkers = (text: string, position: string) => {
		let regex = /\b\d{1,3}:\d{1,3}\b/gm;
		let matches = text.match(regex);
		if (matches === null) {
			return [];
		}
		if (position === 'last') {
			return matches[matches.length - 1];
		}
		if (position === 'first') {
			return matches[0];
		}
	};
</script>

{#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if}

<div bind:this={element} />

<style>
	button.active {
		background: black;
		color: white;
	}
	:global(.mention) {
		border: 1px solid #ddd;
		border-radius: 3px;
		padding: 0 3px;
		border-radius: 3px;
	}
</style>
