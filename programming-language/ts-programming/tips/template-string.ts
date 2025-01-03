/**
 * typescript template string type
 *
 * 结合 Proxy Report 看看？
 * @description https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 */

// refer 1: https://www.zhihu.com/question/418792736
// refer 2: https://www.typescriptlang.org/play/?ts=4.1.2#code/C4TwDgpgBA6gFgS2BAzmAhgY2gXigcgB0BXABnIE58oAfAk809auos8zF+90gEy7bkATKXwBYAFChIUADIB7AO4QATgEEANmDjooefM1oEARgM5H8-CxAEAzAQHMBcAQgEArAQGsBGgQFsBADsBeQEwAQBHARUBFAFgAWIBADcBRQEADwEQAQAvcSlwaABVMEh1LR09KDKKzHQUCAAeBWVK7XQAPklpaAARBAckGvxRCwBGASEBAGYBABYBAFYBADYBAHYBAA4BKl7i2qDeVRRMeRVcAgB9Qr7YS94autVNTqM2t6rdOhKTs4XK4AbkOMgAcvIgvAkKgMNgajAnkZBsNgKCJGDoAAFdAqJoANTxCHQxg0LQAKlAIJlkCcUFAUMAVAggg4ujVJFBuVAqTS6bwGQADAAkAG9WbZVFAAMrAPHAAC+4sl0oASqglUKuTzdQB+WXylTAam0iD0x4qXg63W2qAGjVM00Chn4Qp2j08g1Mllsm2e20ALiguPxEEh0MQyDQWBajuAPQkAZ5waCEBSqn9utT6dUGKxIbxTQjMOj8MpzvNgsZzNZ7M5SZ5fLNFtFEqCUpUhoVyvbnag8cV2sbdoNcoVlYtJajcNjWY9Ds1k+rbvnye9tb9I+TKcLYensJj2Ga8cTO6gOYzKjXF6gaav+aKMgAorSVFhgBSIP4wBp0MhQ3QfwIGQfFmmbF0a19BwABo9yAhl+SrBkNSBXhmh9Os4MwtkjCCYh-GMVQOTwMVFRIqB-Qg5CoDbHCHGVFUO2lIkVEYvt1U1IcbwNVjl1dd0dwNV9mQ-L8fz-AC8SAkCzhPTU4MA-wUDPHdg1DQliVJclmlYjkkIte9M23c9hLfMTv1-f8ICU2SwPjRTpOU1Tz25YMRPfTBP0sySbKcuyUHkplHPfZSoAAMigMUoAAbWxKBWSgViAF1g3ovCCKIrtyJvdSnJQSRJAuIInWQCTrJqAAKMqrOQOVoLSzdYKgDBQpQYN0CCEAAEpGugvQOTFHUAHphqgDR5F4Ro4CgQAQtygGrfJ1K5gGIFQggIfAMUVR9iqdVQVEuAAxD9LhAGpwP4qC6y6SqLlOPqsKgYCUBQdAHAgcTaogYMKW6gadUwP9XuOBBImICBnxUQ6uyG7d7p+662QxXUXrej7HuR-09uZYgvMuSrWoQvV3PMryvt82zQMCikun+uG7WARAUAAOgRmoEZR20mYQVm0fe65Fusyr+Y+inrLgonlO64Eue5RUdR2wqJBx3liiJDQECm4AEChKGYZqA7jtOlQQEqoUNa1-9daCFmKWKIU4KFQAh5UAB1MoBFKWRSgQAUvUALjkPb6b3AG8fQBo9SFGWiqhJ0NXBhArl4fXLkN6Hjfx03zct7WbZZ2PiHjiBeEd2i3Y9r2oD9wBR-UAaw03Yjx800UNXICz629dTlRKoZnkpeDAxyi1-AYP9Po+-oof-VGqAAAFgBQABaGlIC8xeO-9Wx5HkPvjDxQpFRloA

const getApiPrefix =
  <Pre extends string>(prefix: Pre) =>
  <Api extends `/${string}`>(api: Api) =>
    `${prefix}${api}` as const;

const getUserApi = getApiPrefix("user");
// ... mutliple definition

// bad case detect:
// Argument of type '"get_age"' is not assignable to parameter of type '`/${string}`'.
// const queryUserAge = getUserApi("get_age");

// good case:
// const queryUserAge: "user/get_age"
const queryUserAge = getUserApi("/get_age");
