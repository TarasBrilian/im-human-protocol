module.exports = {
  apps: [
    {
      name: 'ngrok',
      script: 'ngrok',
      args: 'http 3001',
      autorestart: true,
      watch: false,
      error_file: './logs/ngrok-err.log',
      out_file: './logs/ngrok-out.log',
      time: true
    },
    {
      name: 'im-human-reclaim',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/server-err.log',
      out_file: './logs/server-out.log',
      time: true
    }
  ]
};
