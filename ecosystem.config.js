module.exports = {
  apps: [
    {
      name: "quality-dashboard-server",
      cwd: "quality-dashboard-server",
      script: "npm",
      args: "run dev",
      watch: true,
      ignore_watch: ["node_modules", ".data"],
      watch_options: {
        usePolling: true,
        interval: 1000,
      },
      env_development: {
        NODE_ENV: "dev",
        AUTH_TOKEN_VALIDITY: "5000",
        AUTH_JWT_KEY: "TO_CHANGE"
      },
    },
    {
      name: "quality-dashboard-ui",
      cwd: "quality-dashboard-ui",
      script: "npm",
      args: "run dev",
      watch: false,
      autorestart: false,
    },
  ],
};
