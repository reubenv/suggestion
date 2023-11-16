import type { Editor } from '@tiptap/core';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { SvelteComponent } from 'svelte';

class SvelteRenderer<
	C extends SvelteComponent<Partial<P>>,
	P extends { editor: Editor; props: SuggestionProps } = { editor: Editor; props: SuggestionProps }
> {
	ref: C;
	target: HTMLElement;

	constructor(Component: new (arg: { target: HTMLElement; props: P }) => C, props: P) {
		this.target = document.createElement('div');

		props.editor.view.dom.parentNode?.appendChild(this.target);

		this.ref = new Component({
			target: this.target,
			props
		});
	}

	updateProps(props: Partial<P>) {
		this.ref.$set(props);
	}

	destroy() {
		this.ref.$destroy();
		this.target.remove();
	}
}

export default SvelteRenderer;
