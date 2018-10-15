module.exports = {
    apps: [{
      name: 'wms_server',
      script: './src/index.js',
      instances: 'max',
      exec_mode: "cluster",
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  };
  