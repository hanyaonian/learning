import "reflect-metadata";

enum METADATA_KEYES {
  Path = "path",
  PathMethod = "path_method",
  Module = "module",
  Controller = "controllers",
  Providers = "providers",
}

const Controller = (path: string): any => {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEYES.Controller, path, target);
  };
};

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

const Module = (metadata: {
  [METADATA_KEYES.Controller]?: Type<any>[];
  [METADATA_KEYES.Providers]?: Type<any>[];
}): ClassDecorator => {
  return (target: Function) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
};

const Injectable = (): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEYES.Providers, {}, target);
  };
};

const createMappingDecorator = (method: string) => (path: string) => {
  return (_target, _key, descriptor: any) => {
    Reflect.defineMetadata(METADATA_KEYES.Path, path, descriptor.value);
    Reflect.defineMetadata(METADATA_KEYES.PathMethod, method, descriptor.value);
  };
};
const Get = createMappingDecorator("GET");
const Post = createMappingDecorator("POST");

const getControllerRoutes = (controllers: Type[]) => {
  const result: any[] = [];
  controllers.forEach((controller) => {
    const controller_path = Reflect.getOwnMetadata(
      METADATA_KEYES.Controller,
      controller
    );
    const controller_handlers = {
      controller_path,
      methods: [],
    };
    const proto = controller.prototype;
    Object.getOwnPropertyNames(proto).forEach((property) => {
      const fn = proto[property];
      controller_handlers.methods.push({
        sub_path: Reflect.getOwnMetadata(METADATA_KEYES.Path, fn),
        method: Reflect.getOwnMetadata(METADATA_KEYES.PathMethod, fn),
        controller,
        handler: fn,
      });
    });
    result.push(controller_handlers);
  });
  return result;
};

type Constructor<T = any> = new (...args: any[]) => T;

const inject = (target: Constructor<any>, providers: Constructor<any>[]) => {
  const deps = [...(Reflect.getMetadata("design:paramtypes", target) || [])];
  const args = deps.map((dep: Constructor) => {
    const target_provider = providers.find((provider) => {
      return dep === provider;
    });
    if (!target_provider) {
      console.log("required provider not configured");
    }
    return new target_provider();
  });
  return new target(...args);
};

const createServer = (instance) => {
  // 获取控制器、注册的路由
  const controllersClasses = Reflect.getOwnMetadata(
    METADATA_KEYES.Controller,
    instance
  );
  const routes = getControllerRoutes(controllersClasses);
  routes.forEach((route) => {
    console.log(route.controller_path, JSON.stringify(route.methods));
  });

  // 注入服务
  const providersClasses = Reflect.getOwnMetadata(
    METADATA_KEYES.Providers,
    instance
  );
  const controllers = controllersClasses.map((controller) =>
    inject(controller, providersClasses)
  );

  // 模拟有个server
  return {
    routes,
    controllers,
  };
};

// 测试一下实际效果
@Injectable()
class HelloService {
  constructor() {
    console.log("hello service created");
  }

  sayHi() {
    return "hello world";
  }
}

@Controller("/test")
class HelloController {
  constructor(private hello_service: HelloService) {
    console.log("hello controller created");
  }

  @Get("/get_hello")
  someGetMethod() {
    const result = this.hello_service.sayHi();
    console.log(`result from hello service: ${result}`);
    return result;
  }

  @Post("/post_hello")
  somePostMethod() {
    const result = this.hello_service.sayHi();
    console.log(`${result} post to hello service.`);
    return `post ${result} success`;
  }
}

@Module({
  [METADATA_KEYES.Controller]: [HelloController],
  [METADATA_KEYES.Providers]: [HelloService],
})
class Application {}

const server = createServer(Application);
const mock = (req_path: string, req_method: string) => {
  server.routes.forEach((route) => {
    const { methods = [], controller_path } = route;
    const target_method = methods.find((method) => {
      const { sub_path, method: method_type } = method;
      const fullPath = `${controller_path}${sub_path}`;
      return fullPath === req_path && req_method === method_type;
    });
    if (!target_method) {
      return console.log(`${req_method} at ${req_path} is 404`);
    }

    const { handler, controller } = target_method;
    const target_controller = server.controllers.find((c) => {
      return c instanceof controller;
    });
    return console.log(
      `${req_method} at ${req_path} gets ${handler.bind(target_controller)()}`
    );
  });
};
mock("/test/get_hello", "POST");
mock("/test/get_hello", "GET");
mock("/test/post_hello", "POST");
mock("/test/post_hello", "GET");
