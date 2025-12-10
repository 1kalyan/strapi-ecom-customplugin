export default {
  routes: [
    {
      method: "POST",
      path: "/auth/local/custom-register",
      handler: "user.customRegister",
      config: {
        auth: false,
        prefix: "",
      },
    },
  ],
};
