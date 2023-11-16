import tippy, { type GetReferenceClientRect, type Instance as TippyInstance } from 'tippy.js';
import MentionComponent from './Mention.svelte';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import SvelteRenderer from './SvelteRenderer';

const suggestion = {
	items: ({ query }: { query: string }) => {
		return [
			'Lea Thompson',
			'Cyndi Lauper',
			'Tom Cruise',
			'Madonna',
			'Jerry Hall',
			'Joan Collins',
			'Winona Ryder',
			'Christina Applegate',
			'Alyssa Milano',
			'Molly Ringwald',
			'Ally Sheedy',
			'Debbie Harry',
			'Olivia Newton-John',
			'Elton John',
			'Michael J. Fox',
			'Axl Rose',
			'Emilio Estevez',
			'Ralph Macchio',
			'Rob Lowe',
			'Jennifer Grey',
			'Mickey Rourke',
			'John Cusack',
			'Matthew Broderick',
			'Justine Bateman',
			'Lisa Bonet'
		]
			.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
			.slice(0, 5);
	},
	render() {
		let component: SvelteRenderer<MentionComponent>;
		let popup: TippyInstance[];
		return {
			onStart(props: SuggestionProps) {
				const { editor } = props;

				component = new SvelteRenderer(MentionComponent, { props, editor });

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect as GetReferenceClientRect,
					appendTo: () => document.body,
					content: component.target,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start'
				});
			},

			onUpdate(props: SuggestionProps) {
				component.updateProps({ props });
				if (!props.clientRect) {
					return;
				}

				popup[0].setProps({
					getReferenceClientRect: () => {
						const rect = props.clientRect?.();
						if (!rect) {
							throw new Error('Could not get client rect');
						}
						return rect;
					}
				});
			},

			onExit() {
				component.destroy();
				popup[0].destroy();
			},

			onKeyDown(props: SuggestionKeyDownProps) {
				if (props.event.key === 'Escape') {
					popup[0].hide();
					return true;
				}
				return component.ref.onKeyDown(props);
			}
		};
	}
};

export default suggestion;
