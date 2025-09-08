"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = exports.createWorkspace = exports.getWorkspace = exports.getWorkspaces = void 0;
const db_1 = require("./db/db");
const uuid_1 = require("uuid");
/** Returns a list of all workspaces in the database */
function getWorkspaces(dbString) {
    return (0, db_1.all)(dbString, 'workspaces');
}
exports.getWorkspaces = getWorkspaces;
/** Returns a single workspace from the database */
function getWorkspace(dbString, id) {
    return (0, db_1.findOne)(dbString, 'workspaces', id);
}
exports.getWorkspace = getWorkspace;
/** Create a workspace in the database */
function createWorkspace(dbString) {
    const workspace = {
        id: (0, uuid_1.v4)(),
        title: 'New Workspace',
        buildShipments: [
            {
                id: (0, uuid_1.v4)(),
                buildNumber: '',
                // Initialize the workspace with a single empty build shipment
                shipments: [],
            },
        ],
    };
    (0, db_1.insert)(dbString, 'workspaces', workspace);
    return workspace;
}
exports.createWorkspace = createWorkspace;
/** Update a workspace in the database */
function updateWorkspace(dbString, workspace) {
    (0, db_1.update)(dbString, 'workspaces', workspace.id, workspace);
    return (0, db_1.findOne)(dbString, 'workspaces', workspace.id);
}
exports.updateWorkspace = updateWorkspace;
// TODO: Implement deleteShipment function
// export function deleteShipment(dbString: string, id: string) : Workspace {
//   // Implementation will be added later
// }
