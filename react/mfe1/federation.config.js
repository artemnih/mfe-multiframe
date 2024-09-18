const { withNativeFederation, shareAll } = require("@softarc/native-federation/build");

module.exports = withNativeFederation({
  name: "mfe",

  exposes: {
    // "./component": "./mfe1/app",
    "./MyReactComponent": "./mfe1/MyReactComponent",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
      includeSecondaries: false,
    }),
  },

});
