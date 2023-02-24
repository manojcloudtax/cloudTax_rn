module.exports = function(api) {
  const babelEnv = api.env();
  const plugins = [];
  api.cache(true);
    //change to 'production' to check if this is working in 'development' mode
  if (babelEnv === 'production') {
    plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};

// module.exports = api => {
//   const babelEnv = api.env();
//   const plugins = [];
//   api.cache(true);
//   //change to 'production' to check if this is working in 'development' mode
//   if (babelEnv === 'production') {
//     plugins.push(['transform-remove-console']);
//   }
//   return {
//     presets: ['babel-preset-expo'],
//     plugins,
//   };
// };