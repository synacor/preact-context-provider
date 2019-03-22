import { h } from 'preact';

/**
 * Adds all passed `props`, `children` into `context`, making them available to all descendants.
 *
 * To learn about `context`, see the [React Docs](https://facebook.github.io/react/docs/context.html).
 *
 * @name Provider
 * @param {Object} props All props are exposed as properties in `context`, except children
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
 * // lower-level providers override higher providers for any keys that they define
 * render(
 *   <Provider a={key1: 'foo'} b={key2: 'bar'}>
 *     <Provider a={key3: 'buz'} >
 *       <Demo />
 *     </Provider>
 *   </Provider>
 * );
 * // "{ a: { key3: 'buz' }, b: { key2: 'bar' } }"
 */
export default class Provider {
	getChildContext() {
		let context = {};
		for (let i in this.props) if (i !== 'children') {
			context[i] = this.props[i];
		}
		return context;
	}

	render(props) {
		return props.children[0];
	}
}

/**
 *  A simpler Object.assign
 *  @private
 */
function assign(obj, props) {
	for (let i in props) {
		if (props.hasOwnProperty(i)) {
			obj[i] = props[i];
		}
	}
	return obj;
}

/**
 * Recursively copy keys from `source` to `target`, skipping truthy values already in `target` so parent values can block child values
 * @private
 */
function deepAssign(target, source) {
	//if they aren't both objects, use target if it is defined (null/0/false/etc. are OK), otherwise use source
	if (!(target && source && typeof target==='object' && typeof source==='object')) {
		return typeof target !== 'undefined' ? target : source;
	}

	let out = assign({}, target);
	for (let i in source) {
		if (source.hasOwnProperty(i)) {
			out[i] = deepAssign(target[i], source[i]);
		}
	}
	return out;
}


/**
 * Similar to {@link Provider}, but allows a special `mergeProps` prop to allow parent supplied context keys with the same name as those
 * provided by the current `MergingProvider` to be deep merged, instead of replaced.
 *
 * To learn about `context`, see the [React Docs](https://facebook.github.io/react/docs/context.html).
 *
 * @name MergingProvider
 * @param {Object} props All props are exposed as properties in `context`, except `children` and `mergeProps`
 * @param {Array} [props.mergeProps] If not supplied, all supplied props will be merged with keys already in context.  If supplied as an array of strings,
 * it will deep merge any prop names that are present in the array, and missing prop names be overriden by the child like {@link Provider}.
 *
 * @example
 * import Provider, { MergingProvider } from 'preact-context-provider';
 * const Demo = (props, context) => {
 *   console.log(context);  // "{ a: 'b' }"
 * };
 *
 * // with mergeProps unspecified, all parent context keys are merged with the ones presently supplied, parent values taking precedence
 * render(
 *   <Provider a={key1: 'foo'}>
 *     <MergingProvider a={key2: 'bar'}>
 *       <Demo />
 *     </MergingProvider>
 *   </Provider>
 * );
 * // "{ a: { key1: 'foo', key2: 'bar' } }"
 *
 *  // when mergeProps is an array, only specified keys are merged, non-specified keys get their value from current node
 * // in this example, only the 'a' context key is merged.  'b' is overwritten by the lower node
 * render(
 *   <Provider a={key1: 'foo'} b={key2: 'bar'}>
 *     <MergingProvider mergeProps={['a']} a={key3: 'baz'} b={key4: 'buz'}>
 *       <Demo />
 *     </MergingProvider>
 *   </Provider>
 * );
 * // "{ a: { key1: 'foo', key3: 'baz' }, b: {key4: 'buz'} }"
 */
export class MergingProvider {
	getChildContext() {
		let context = {},
			props=this.props,
			mergeProps = props.mergeProps,
			mergeIsArray=Array.isArray(mergeProps);

		for (let i in props) if (i !== 'children' && i !== 'mergeProps') {
			context[i] = (!mergeIsArray || ~mergeProps.indexOf(i)) ? deepAssign(this.context[i], props[i]) : props[i];
		}
		return context;
	}

	render(props) {
		return props.children[0];
	}
}

/**
 * Higher Order Component that wraps components in a {@link Provider} for the given context.
 *
 * @name provide
 * @param {Object} ctx	Properties to pass into context (passed to {@link Provider})
 * @returns {Function}	A function that, given a Child component, wraps it in a Provider component for the given context.
 *
 * @example
 * import {provide} from 'preact-context-provider';
 * const Demo = (props, context) => {
 *   console.log(context.a);  // "b"
 * };
 * const ProvidedDemo = provide({a: "b"})(Demo);
 *
 * ProvidedDemo.getWrappedComponent() === Demo; // true
 *
 * render( <ProvidedDemo /> );
 */
export const provide = ctx => Child => {
	const ProviderWrapper = props => h(Provider, ctx, h(Child, props));
	ProviderWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (() => Child);
	return ProviderWrapper;
};

Provider.provide = provide;

/**
 * Higher Order Component that wraps components in a {@link MergingProvider} for the given context.
 *
 * @name mergingProvide
 * @param {Object} ctx	Properties to pass into context (passed to {@link MergingProvider})
 * @returns {Function}	A function that, given a Child component, wraps it in a {@link MergingProvider} component for the given context.
 *
 * @example
 * import {mergingProvide} from 'preact-context-provider';
 * const Demo = (props, context) => {
 *   console.log(context.a);
 * };
 * const ProvidedDemo = mergingProvide({a: "b"})(Demo);
 *
 * ProvidedDemo.getWrappedComponent() === Demo; // true
 *
 * render( <ProvidedDemo /> ); // "b"
 */
export const mergingProvide = ctx => Child => {
	const MergingProviderWrapper = props => h(MergingProvider, ctx, h(Child, props));
	MergingProviderWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (() => Child);
	return MergingProviderWrapper;
};
