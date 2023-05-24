import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import { resolve } from "node:path";
import { uploadRoutes } from "./routes/upload";

const app = fastify();

app.register(multipart);
app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: "spacetime",
});

app.register(authRoutes);
app.register(memoriesRoutes);
app.register(uploadRoutes);

app
  .listen({
    port: 3333,
    host: "::",
  })
  .then(() => {
    console.log("🚀 HTTP server running on port http://localhost:3333");
  });

// http://192.168.97.186:3333/
// web
// host: "127.0.0.1",
// mobile
// host: "::"
