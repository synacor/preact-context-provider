import { h } from 'preact';

/** A simpler Object.assign
 *  @private
 */
function assign(obj, props) {
	for (let i in props) {
		if (obj.hasOwnProperty(i)) {
			obj[i] = props[i];
		}
	}
	return obj;
}


/** Recursively copy keys from `source` to `target`, skipping truthy values already in `target`.
 *	@private
 */
function deepAssign(target, source) {
	let out = assign({}, target);
	for (let i in source) {
		if (source.hasOwnProperty(i)) {
			if (target[i] && source[i] && typeof target[i]==='object' && typeof source[i]==='object') {
				out[i] = deepAssign(target[i], source[i]);
			}
			else {
				out[i] = target[i] || source[i];
			}
		}
	}
	return out;
}

/**
 * Adds all passed `props`, with the exception of `mergeEnabled` into `context`, making them available to all descendants.
 *
 * To learn about `context`, see the [React Docs](https://facebook.github.io/react/docs/context.html).
 *
 * @name Provider
 * @param {Object} props All props are exposed as properties in `context`, except children and mergeEnabled
 * @param {Boolean} [props.mergeEnabled=false] If true, deep merges any existing keys in `context` with the newly provided keys, giving precedence to parent values
 *
 * @example
 * const Demo = (props, context) => {
 *   console.log(context);  // "{ a: 'b' }"
 * };
 * render(
 *   <Provider a="b">
 *     <Demo />
 *   </Provider>
 * );
 * //	"{ a: 'b' }"
 *
 * // without mergeEnabled, top level parent key value overwrites child key
 * render(
 *   <Provider a={key1: 'foo'}>
 *     <Provider a={key1: 'bar', key2: 'baz'}>
 *       <Demo />
 *     </Provider>
 *   </Provider>
 * );
 * // "{ a: { key1: 'foo' } }"
 *
 * // with mergeEnabled, parent key is merged with children, parent values taking precedence
 * render(
 *   <Provider a={name: 'foo'}>
 *     <Provider mergeEnabled a={name: 'bar'}>
 *       <Demo />
 *     </Provider>
 *   </Provider>
 * );
 * // "{ a: { key1: 'foo', key2: 'baz' } }"
 *
 */
export default class Provider {
	getChildContext() {
		let context = {}, props=this.props;
		for (let i in props) if (i !== 'children' && i !== 'mergeEnabled') {
			context[i] = props.mergeEnabled ? deepAssign(this.context[i], props[i]) : props[i];
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
