<nav class="sidebar toc" id="main-contents">

- [Installation](#installation)
- [Defining tests](#defining-tests)
	- [`data-test` attribute](#data-test-attribute)
	- [`data-columns` attribute](#data-columns-attribute)
	- [`data-click` attribute](#data-click-attribute)
	- [`data-error` attribute](#data-error-attribute)
	- [`$out()` and `$outln()` functions](#out-and-outln-functions)
- [Running tests](#running-tests)
- [Isolating tests](#isolating-tests)

</nav>

<main>

# HTML-first tests

While you can run any hTests in the browser,
you can also write tests directly in HTML,
without any JS file being involved.

These tests can *only* run in the browser, but can be useful for testing UI-heavy code.
The pass-criteria extends beyond value matching or error catching, and could even be things like what CSS selectors match or what the DOM looks like.
They are evaluated reactively, so if the HTML changes or the user interacts with the UI, relevant tests are re-evaluated.
Last, they also support mocking basic interactions like click or focus, via HTML attributes.

## Installation

Just include hTest on the HTML page:

```html
<link rel="stylesheet" href="https://htest.dev/htest.css" crossorigin />
<script src="https://htest.dev/htest.js" crossorigin></script>
```

## Defining tests

The primary test format is reftests, i.e. automatic comparison of two things, typically app output with expected (reference) output. When the two match, the test passes (green), otherwise it fails (red).

You can create reftests by using a table with `class="reftest"`. Each row is a new test. Typically these tables have two columns: output and expected. However, if your test requires initialization data, you can also have 3 columns, and the first one will be ignored in the matching.

Typically these tables are inside sections with HTML like the following:

```html
<section>
	<h1>Heading</h1>
	<table class="reftest">
		<!-- ...tests as <tr>s -->
	</table>
</section>
```

This structure is not necessary for the reftests to work, but it allows you to isolate specific sections, which is often convenient when debugging.
You can also isolate an individual row by <kbd>Alt</kbd>/<kbd>Option</kbd> + double clicking.

Below is a short description of the syntax we support.

### `data-test` attribute

This applies to either the whole table or individual tests and controls how the matching is done.
By default the contents of the cells are compared which corresponds to `data-test="contents"`.

Other useful values are:

- `"selector"` which treats the reference cell as a selector (or list of a selectors, if using a `<ul>`) that the output HTML must match. You can reverse the matching with `class="not"`.
- `"numbers"` which only compares the numbers returned, ignoring all other output. You can specify an epsilon value by using a `data-epsilon` attribute, either on the row or an ancestor.
- `"dom"` which compares both contents and attributes.
{# - `"attribute"` ??? #}

Besides the built-in comparison functions, you can provide your own, by defining a JavaScript function, either as the content of the `data-test` attribute, or by defining a global function.
It accepts the 2-3 cells of your test as arguments and should return a truthy value for pass and a falsy value for fail.

### `data-columns` attribute

2 by default, which means there are two columns: ref and test.
Set it to 3 or more for custom tests that need the previous columns for data.

### `data-click` attribute

Automatic clicking on elements. It can be placed on either the whole table or individual tests. Its location specifies the root for the selector, if one is specified. Its syntax is (angle brackets indicate a parameter, square brackets mean that something is optional):

```
[<selector>] [wait <delay>s] [after <event name>] [<times> times]
```

The parameters can be specified in any order.

Examples:

- `data-click=""`: Clicks the element it's specified on immediately on `DOMContentLoaded`.
- `data-click=".foo"`: Clicks `.foo` elements immediately on `DOMContentLoaded`.
- `data-click=".foo .bar wait 5s after load"`: Clicks `.foo .bar` elements 5 seconds after the `load` event fires.
- `data-click=".foo 3 times after hashchange"`: Clicks `.foo` elements 3 times after the `hashchange` event.
- `data-click="wait 1s after load"`: Clicks the element it's specified on 1 second after the `load` event fires.
- `data-click="wait 1s after load 2 times"`: Same as above, but clicks twice.

### `data-error` attribute

Use on tests that *should* produce an error to pass.
Use the `data-error` attribute **on the `<tr>`, not the table cell**.
Put the expected error type in the "expected" table cell.

### `$out()` and `$outln()` functions { #out-and-outln-functions }

Sometimes what is tested is pure JS output with no UI.
While the [JS-first mode](https://htest.dev/docs/define/) is typically better for those use cases, it is possible to use HTML-first mode as well.
In that case, use `<script>` tags and the `$out()` or `$outln()` functions.
Their only difference is that `$outln()` also prints a line break.

## Running tests

HTML-first tests can currently only run in the browser, by opening the HTML file.

## Isolating tests

It is often useful to isolate a single group of tests, or even a single test so you can debug a particular failure.

To isolate a group of tests (`<section>`), simply click the link of the section heading.

To isolate a specific test (`<tr>`), hold down the <kbd>Alt</kbd>/<kbd>Option</kbd> key and double click on the table row.

</main>
