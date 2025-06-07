class Animal {
  constructor() {
    this.init();
  }
  init() {
    console.log("Animal init");
  }

  act() {
    console.log("Animal act");
  }
}

class Human extends Animal {
  private name = "initial name";

  constructor() {
    super();
    console.log("before Human init");
  }

  init() {
    super.init();
    console.log("Human init, name: ", this.name);
    this.name = "Mike";
    console.log("Human init, given name: ", this.name);
  }

  act() {
    super.act();
    console.log(this.name, "act");
  }
}

const p1 = new Human();
p1.act();

/**
 * Result:
 * 
  Animal init
  Human init, name:  undefined
  Human init, given name:  Mike
  before Human init
  Animal act
  act
 * 
 */
