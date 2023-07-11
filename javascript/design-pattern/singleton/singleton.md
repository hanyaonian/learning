# Object Oriented Design Pattern: Singleton

We know how to write a Singleton case, it's very simple. Today I found a new way to make it more beautiful in TypeScript.

## Basic

let's start with simple one:

```ts
class Singleton {
  private static _instance: Singleton;

  // private constructor
  private constructor() { }

  // expose a static method to get instance
  static getInstance() {
    if (!Singleton._instance) {
      Singleton._instance = new Singleton();
    }
    return Singleton._instance;
  }
}

let a = Singleton.getInstance();
let b = Singleton.getInstance();
console.log(a === b); // true

// in both ways you can not access the constructor

// let c =  Singleton._instance
// Property '_instance' is private and only accessible within class 'Singleton'.
// let c = new Singleton()
// Constructor of class 'Singleton' is private and only accessible within the class declaration.
```

## Abstract one

We may have many singletons in one project, such as Logger, DB connector, etc. It's not good to write every case repeatly, let's make it abstact.

```ts
abstract class Singleton {
  private static instances: Map<string, Singleton> = new Map();

  public static getInstance<T extends Singleton>(this: new () => T) {
    const classname = this.name;
    if (!Singleton.instances.has(classname)) {
      Singleton.instances.set(classname, new this());
    }
    return Singleton.instances.get(classname) as T;
  }

  protected constructor() {
    if (Singleton.instances.has(this.constructor.name)) {
      throw new Error('Singleton can not construct twice.');
    }
    Singleton.instances.set(this.constructor.name, this);
  }
}
```

with abstract Classes, it is not need to rewrite same logic.

```ts
abstract class Singleton {
  private static instances: Map<string, Singleton> = new Map();

  public static getInstance<T extends Singleton>(this: new () => T) {
    const classname = this.name;
    if (!Singleton.instances.has(classname)) {
      Singleton.instances.set(classname, new this());
    }
    return Singleton.instances.get(classname) as T;
  }

  protected constructor() {
    if (Singleton.instances.has(this.constructor.name)) {
      throw new Error('Singleton can not construct twice.');
    }
    Singleton.instances.set(this.constructor.name, this);
  }
}

class SingletonA extends Singleton {
  // we need a public constructor
  // or you will have this:
  // The 'this' context of type 'typeof SingletonA' is not 
  // assignable to method's 'this' of type 'new () => SingletonA'.
  constructor() {
    super();
    console.log(this.constructor.name);
  }
}

let a1 = SingletonA.getInstance()
let a2 = SingletonA.getInstance()
// let a2 = new SingletonA(); error: Singleton can not construct twice.
console.log(a1 === a2); // true
```
