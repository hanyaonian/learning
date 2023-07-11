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