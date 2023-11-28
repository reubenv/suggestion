<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Mention from '@tiptap/extension-mention';
	import suggestion from './slash/suggestion';

	let element: Element;
	let editor: Editor;
	let verseRange: string[];
	let chapter: number = 1;

	suggestion.items = ({ query }: { query: string }) => {
		return verseRange
			.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
			.slice(0, 5);
	};

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
				'<p>1:1 This is the beginning, 1:2 and this is the end. 1:6 But it WAS NOT. THIS is the end. 1:7 Got you again!</p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;

				// fetch the content from the editor and split it into two parts based on the cursor position
				let content = getContentBlocks(editor.state.selection.$anchor.pos);

				// find the verse markers in the content
				let matches: string[] = findVerseMarkers(content);

				// create an available verse range based on the verse markers
				verseRange = createVerseRange(matches);
				console.log(content);
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const getContentBlocks = (position: number) => {
		let textContent = editor.getText();
		return { before: textContent.slice(0, position - 1), after: textContent.slice(position - 1) };
	};

	const findVerseMarkers = (content: object): string[] => {
		let previousVerse: string, nextVerse: string;
		let regex = /\b\d{1,3}:\d{1,3}\b/gm;
		let leftVerses = content.before.match(regex);
		let rightVerses = content.after.match(regex);
		if (!leftVerses && !rightVerses) {
			return [];
		}
		previousVerse = leftVerses ? (previousVerse = leftVerses[leftVerses.length - 1]) : '';
		nextVerse = rightVerses ? (nextVerse = rightVerses[0]) : '';

		return [previousVerse, nextVerse];
	};

	const createVerseRange = (matches: string[]): string[] => {
		let previouseVerse: string = matches[0].split(':')[1];
		let nextVerse: string = matches[1].split(':')[1];
		let verseRange: string[] = [];
		if (previouseVerse && nextVerse) {
			for (let i = parseInt(previouseVerse) + 1; i < parseInt(nextVerse); i++) {
				verseRange.push(`${chapter}:${i}`);
			}
		}
		return verseRange;
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
