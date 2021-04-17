// babel.config.js
module.exports = {
  presets: [
    /*
    "env"
    */
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
  ]
};
