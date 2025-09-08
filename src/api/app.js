"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const util_1 = require("./util");
const db_1 = require("./db/db");
const validation_1 = require("./validation");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 8080;
const dbString = '../database.txt';
/** Admin endpoint for resetting the database */
app.get('/reset', (req, res) => {
    (0, db_1.reset)(dbString);
    res.send('Reset database');
});
/** Returns the workspace with the given ID */
app.get('/:workspaceId', (req, res) => {
    res.json({ workspace: (0, util_1.getWorkspace)(dbString, req.params.workspaceId) });
});
/** Updates the workspace with the given ID and returns the updated workspace */
app.post('/:workspaceId', (req, res) => {
    try {
        const workspace = req.body.workspace;
        // Validate the workspace data
        const validation = (0, validation_1.validateWorkspace)(workspace);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Validation failed',
                details: (0, validation_1.formatValidationErrors)(validation.errors)
            });
        }
        res.json({ workspace: (0, util_1.updateWorkspace)(dbString, workspace) });
    }
    catch (error) {
        if (error instanceof validation_1.ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
/** Returns all workspaces in the database */
app.get('/', (req, res) => {
    const allWorkspaces = (0, util_1.getWorkspaces)(dbString);
    const workspaces = allWorkspaces.map((workspace) => ({
        id: workspace.id,
        title: workspace.title,
    }));
    res.json({ workspaces });
});
/** Creates a new workspace in the database and returns it */
app.post('/', (req, res) => {
    try {
        // If workspace data is provided in the request body, validate it
        if (req.body.workspace) {
            const validation = (0, validation_1.validateWorkspace)(req.body.workspace);
            if (!validation.isValid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: (0, validation_1.formatValidationErrors)(validation.errors)
                });
            }
        }
        res.json({ workspace: (0, util_1.createWorkspace)(dbString) });
    }
    catch (error) {
        if (error instanceof validation_1.ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
module.exports = app;
app.listen(port, () => {
    console.log(`Dosspace is running on port ${port}.`);
});
