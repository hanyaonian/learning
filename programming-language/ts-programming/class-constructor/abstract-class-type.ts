abstract class Animal {
  constructor(readonly name: string) {}

  abstract act(): void;
}

class Man extends Animal {
  act(): void {
    console.log(`My name is ${this.name}`);
  }
}

// 1.  抽象类实例问题;
// error: Cannot create an instance of an abstract class.
// const b = new Animal('B');

export {};

// 2. 抽象实例类型问题
const unknow_animal: InstanceType<typeof Animal> = new Man("test");

// 3. 抽象类类型定义问题
declare global {
  interface Window {
    // error: Type 'Animal' has no construct signatures.

    AnimalClass: new (name: string) => Animal;
  }
}

// but you dont know its dog or man
const animal = new window.AnimalClass("test");
