
# component-run

  Run (component.io) components with node

## Status
Experimental. Local dependencies are not yet implemented.

## Why
	
Let's say you have a component based application with a local component lib/my-component.

While developing you might want to run this component in node, but since the resolution of `require` calls in component differs from node, it will not behave as expected.

For example, if the local component depends on `component/emitter` and thus requires it with `require('emitter')`, this will fail when running in node because there is no `emitter` node module.

Using `component-run`, the `require` calls will be intercepted, and it will first try to resolve the module using the component resolution algorithm. Failing this, it will fallback to the native node require.

## Installation

    $ npm install component-run

## Usage
	
	component-run path/to/my-component.js

## License

  MIT
