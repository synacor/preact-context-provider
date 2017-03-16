import { h } from 'preact';

/**
 * Adds all passed props into context, making them available to all descendants.
 *
 * To learn about context, see the [React Docs](https://facebook.github.io/react/docs/context.html).
 *
 * @name Provider
 * @param {Object} props All props are exposed as properties in `context`.
 *
 * @example
 * const Demo = (props, context) => {
 *   console.log(context.a);  // "b"
 * };
 * render(
 *   <Provider a="b">
 *     <Demo />
 *   </Provider>
 * )
 */
export default class Provider {
	getChildContext() {
		let context = {};
		for (let i in this.props) if (i!=='children') {
			context[i] = this.props[i];
		}
		return context;
	}

	render(props) {
		return props.children[0];
	}
}

Provider.provide = provide;

/**
 * Higher Order Component that wraps components in a {@link Provider} for the given context.
 *
 * @name provide
 * @param {Object} ctx	Properties to pass into context (passed to {@link Provider})
 * @returns {Function}	A function that, given a Child component, wraps it in a Provider component for the given context.
 *
 * @example
 * const Demo = (props, context) => {
 *   console.log(context.a);  // "b"
 * };
 * const ProvidedDemo = provide({a: "b"})(Demo);
 *
 * render( <ProvidedDemo /> );
 */
export const provide = ctx => Child => props => h(Provider, ctx, h(Child, props));
