export default () => ({
  "custom-test-plugin": {
    enabled: true,
    resolve: "./src/plugins/custom-test-plugin",
    config: {
      allowSelfRegister: true,
    },
  },
});
