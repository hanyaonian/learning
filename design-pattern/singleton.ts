class singleton {
  private static _instance?: singleton;

  // private 化构造函数，不让访问
  private constructor() {}

  // 暴露获取实例的方法
  static getInstance() {
    if (!singleton._instance) {
      singleton._instance = new singleton();
    }
    return singleton._instance;
  }
}

// 验证是否单例
let a = singleton.getInstance();
let b = singleton.getInstance();
console.log(a === b);

// 以下两种方式都无法获取到实例，只能通过暴露的方法获取

// let c =  singleton._instance
// Property '_instance' is private and only accessible within class 'singleton'.
// let c = new singleton()
// Constructor of class 'singleton' is private and only accessible within the class declaration.
