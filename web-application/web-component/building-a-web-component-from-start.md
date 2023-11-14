# Building a web component from start

- 3 core:

1. custom elements
2. shadow dom
3. html template

reference:

- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

## Custom elements

2 types:

- Customized built-in elements inherit from standard HTML elements such as HTMLImageElement or HTMLParagraphElement. Their implementation customizes the behavior of the standard element.

```js
// Customized built-in elements
class WordCount extends HTMLParagraphElement {
  constructor() {
    super();
  }
  // Element functionality written in here
}
```

```html
<!-- Customized built-in elements, use is -->
<p is="word-count"></p>
```

- Autonomous custom elements inherit from the HTML element base class HTMLElement. You have to implement their behavior from scratch.

```js
// Autonomous custom elements
class PopupInfo extends HTMLElement {
  constructor() {
    super();
  }
  // Element functionality written in here
}
```

```html
<!-- Autonomous custom elements -->
<popup-info></popup-info>
```

both of it needs to be defined:

```js
// Autonomous custom elements
customElements.define("popup-info", PopUpInfo);

// Customized built-in elements
customElements.define("expanding-list", ExpandingList, { extends: "ul" });
```

## Responding to attribute changes

Like built-in elements, custom elements can use HTML attributes to configure the element's behavior. To use attributes effectively, an element has to be able to respond to changes in an attribute's value. To do this, a custom element needs to add the following members to the class that implements the custom element:

A static property named `observedAttributes`. This must be an array containing the names of all attributes for which the element needs change notifications.
An implementation of the `attributeChangedCallback()` lifecycle callback.

The `attributeChangedCallback()` callback is then called whenever an attribute whose name is listed in the element's `observedAttributes` property is added, modified, removed, or replaced.

```js
// Create a class for the element
class MyCustomElement extends HTMLElement {
  static get observedAttributes () {
    return ["color", "size"];
  }
  // or 
  // static observedAttributes = ["color", "size"];
  constructor() {
    // Always call super first in constructor
    super();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("my-custom-element", MyCustomElement);
```

## With typescript

- Webcomponent basic type definition.

```ts
export abstract class WebComponent extends HTMLElement {
  static readonly observedAttributes?: Array<string>;
  abstract adoptedCallback?(): void;
  abstract connectedCallback?(): void;
  abstract disconnectedCallback?(): void;
  abstract attributeChangedCallback?(name: string, oldValue: null | string, newValue: null | string): void;
}
```

- creating custom events with type hints:

```ts
/**
 * In webcomponent, override
 * addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
 */
override addEventListener<K extends keyof CustomEventsHandler>(
  type: K,
  listener: K extends CustomEventNames ? CustomEventsHandler[K] : EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void {
  super.addEventListener(type, listener, options);
}
```

example with custom `Event`, which including data in specific data:

```ts
export interface CustomEventsHandler extends HTMLElementEventMap, CustomEvents {}

interface CustomEvents {
  "some-event": (this: HTMLElement, event: CustomEvent<string>) => any;
}

export type CustomEventNames = keyof CustomEvents;

export class CustomEvent<T> extends Event {
  constructor(
    name: CustomEventNames,
    readonly data?: T,
  ) {
    super(name, {
      bubbles: true,
      cancelable: true,
    });
  }
}
```

with these event's declartion:

```ts
// in your custom element, you can get type hints with correct data
// evt.data will show as string type
customEl.addEventListener('some-event', (evt) => {  })
```

## Custom web-component example & excercise

[check this](https://github.com/hanyaonian/terminal-effect-web.git)
