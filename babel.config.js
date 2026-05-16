const nativewind = require("react-native-css-interop/babel");

module.exports = function (api) {
   api.cache(true);

   const { plugins: nativewindPlugins } = nativewind();

   // NativeWind 4 defaults to the worklets plugin (Reanimated 4). This project uses Reanimated 3.
   const plugins = nativewindPlugins
      .filter((plugin) => {
         const name = Array.isArray(plugin) ? plugin[0] : plugin;
         return name !== "react-native-worklets/plugin";
      })
      .concat("react-native-reanimated/plugin");

   return {
      presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
      plugins
   };
};
