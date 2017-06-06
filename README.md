# preact-context-provider

[![Greenkeeper badge](https://badges.greenkeeper.io/synacor/preact-context-provider.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/preact-context-provider.svg)](http://npm.im/preact-context-provider)
[![Build Status](https://travis-ci.org/synacor/preact-context-provider.svg?branch=master)](https://travis-ci.org/synacor/preact-context-provider)

A generic `<Provider />` for preact. It exposes any props you pass it into context.

## Usage

Install it via npm:

```sh
npm install --save preact-context-provider
```

Then import it and use:

```js
import Provider from 'preact-context-provider';

let OBJ = { a: 'b' };

const App = (props, context) => {
	// now it's exposed to context!
	console.log(context.obj === OBJ) // true
};

render(
	<Provider obj={OBJ}>
		<App />
	</Provider>
);
```

## API

### Provider

Adds all passed props into context, making them available to all descendants.

To learn about context, see the [React Docs](https://facebook.github.io/react/docs/context.html).

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** All props are exposed as properties in `context`.

**Examples**

```javascript
const Demo = (props, context) => {
  console.log(context.a);  // "b"
};
render(
  <Provider a="b">
    <Demo />
  </Provider>
)
```

### provide

Higher Order Component that wraps components in a [Provider](#provider) for the given context.

**Parameters**

-   `ctx` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Properties to pass into context (passed to [Provider](#provider))

**Examples**

```javascript
const Demo = (props, context) => {
  console.log(context.a);  // "b"
};
const ProvidedDemo = provide({a: "b"})(Demo);

render( <ProvidedDemo /> );
```

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A function that, given a Child component, wraps it in a Provider component for the given context.
