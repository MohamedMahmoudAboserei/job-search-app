import connectDB from "./db/connection.js";
import authController from './modules/auth/auth.controller.js';
import userController from './modules/user/user.controller.js';
import adminController from './modules/admin/admin.controller.js';
import companyController from './modules/company/company.controller.js';
import jobController from './modules/job/job.controller.js';
import chatController from './modules/chat/chat.controller.js';
import { globalErrorHandling } from "./utils/response/error.response.js";
import path from 'node:path';
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/modules.schema.js";

const bootstrap = async (app, express) => {
    app.use(express.json());
    app.use("/upload", express.static(path.resolve("uploads")));

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express, mongodb and ES6" });
    });

    app.use("/auth", authController);
    app.use("/user", userController);
    app.use("/admin", adminController);
    app.use("/company", companyController);
    app.use("/job", jobController);
    app.use("/chat", chatController);

    app.use('/graphql', createHandler({ schema }));

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" });
    });

    app.use(globalErrorHandling)

    connectDB();
};

export default bootstrap;