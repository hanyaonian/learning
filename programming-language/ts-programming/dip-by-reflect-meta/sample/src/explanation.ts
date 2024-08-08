import "reflect-metadata";

const Injectable = (): ClassDecorator => {
  return () => {};
};

@Injectable()
class HelloService {
  constructor(number: Number, string: String) {
    console.log("hello service");
  }
}

(() => {
  const deps = [
    ...(Reflect.getMetadata("design:paramtypes", HelloService) || []),
  ];
  console.log(deps);
})();
