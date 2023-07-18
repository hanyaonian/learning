class Father {
  public someFuncNeedKey<T extends Father>(this: T) {
    // "Sub init", but:
    // no name in es5 anonymous function
    console.log(`${this.constructor.name} init`);
  }
  // a way to fix:
  public someFuncNeedKey2<T extends Father>(this: T & { customclassname: string }) {
    console.log(`${this.customclassname} init`);
  }
  constructor() { }
}

class Sub extends Father {
  // uncomment me: to fix error
  // public customclassname = 'Sub';
  // or
  // get customclassname() { return 'Sub' }
}

const sub = new Sub();

// error: Property 'customclassname' is missing in type 'Father' but required in type '{ customclassname: string; }'.
// sub.someFuncNeedKey2();

// undefined in es5
sub.someFuncNeedKey();