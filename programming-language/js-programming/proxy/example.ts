/**
 * proxy usage example: request/report method
 */

type RequestConfig = {
  get: {
    get_user_profile: [{}, { user_name: string }];
  };
  post: {
    change_user_name: [{ new_name: string }, { is_success: boolean }];
  };
};

/**
 *  get value from tuple with infer
 */
type RequestType<T> = T extends [infer Request, any] ? Request : never;
type ResponseType<T> = T extends [any, infer Response] ? Response : never;

export const request = new Proxy(
  {} as {
    readonly [Action in keyof RequestConfig]: {
      readonly [SubAction in keyof RequestConfig[Action]]: void extends RequestConfig[Action][SubAction]
        ? () => Promise<void>
        : (
            ext_content: RequestType<RequestConfig[Action][SubAction]>
          ) => Promise<ResponseType<RequestConfig[Action][SubAction]>>;
    };
  },
  {
    get(_target, action) {
      return new Proxy(
        {},
        {
          get(_target, sub_action) {
            return async (data) => {
              if (typeof action === "symbol" || typeof sub_action === "symbol")
                return;
              // await fetch(sub_action, { data, method: action });
              return await console.log(
                `using method to ${action} with ${sub_action}, params is: ${JSON.stringify(
                  data
                )}`
              );
            };
          },
        }
      );
    },
  }
);

// these get type hint!

// (property) get_user_profile: (ext_content: {}) => Promise<void>
request.get.get_user_profile({});
//(property) change_user_name: (ext_content: { new_name: string; }) => Promise<void>
request.post.change_user_name({ new_name: "hi" });

// result in console:
// using method to get with get_user_profile and {}
// using method to post with change_user_name and {"new_name":"hi"}
