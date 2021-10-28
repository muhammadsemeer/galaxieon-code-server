module.exports = {
  apps: [
    {
      name: "gcode-server-staging",
      script: "./dist/index.js",
      env: {
      NODE_ENV: "staging",
      PORT: 5000,
      DB_HOST: "localhost",
      DB_NAME: "gcode-stage"
      DB_USER: "gcode",
      DB_PASS: "gcodestaging",
      GOOGLE_CLIENT_ID: "402670498374-o3clsli8p0bnsqa8s4ibpeo7o3re5smq.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET: "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",
      GITHUB_CLIENT_ID: "dc966ddf8a37cf15051e",
      GITHUB_CLIENT_SECRET: "725b59d314441c2eacb9fda7cecf236a8b3ba055", 
      JWT_SECRET: "stage",
      JWT_REFRESH_TOKEN: "stage-refersh",
      JWT_ADMIN: "stage-admin",
      }
    },
  ],
};
