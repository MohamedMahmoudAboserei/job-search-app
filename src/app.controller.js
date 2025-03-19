// Import files
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
import cors from 'cors';

// Main application configuration function
const bootstrap = async (app, express) => {
    // Cross-Origin
    app.use(cors());

    // Configure JSON request body parsing
    app.use(express.json());

    // Serve static files from 'uploads' directory under '/upload' route
    app.use("/upload", express.static(path.resolve("uploads")));

    // Root endpoint - Welcome message
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express, mongodb and ES6" });
    });

    // Mount modular route controllers
    app.use("/auth", authController);
    app.use("/user", userController);
    app.use("/admin", adminController);
    app.use("/company", companyController);
    app.use("/job", jobController);
    app.use("/chat", chatController);

    // GraphQL endpoint configuration
    app.use('/graphql', createHandler({ schema }));

    // Catch-all route for undefined endpoints
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" });
    });

    // Global error handling middleware
    app.use(globalErrorHandling)

    // Initialize database connection
    connectDB();
};

// Export the bootstrap function as default
export default bootstrap;