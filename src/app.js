import express from "express";
import cors from "cors";
import usersRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//allow reader the values of a body
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//allow cors
app.use(cors());

// routes
app.use("/public", express.static(`./public`)); // Habilitar carpeta publica
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
export default app;
