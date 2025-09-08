"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../util"));
const db_1 = require("../db/db");
const mock_fs_1 = __importDefault(require("mock-fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const testDbString = '../database.test.txt';
describe('Util tests', () => {
    function createMockUuid() {
        // Creates random unique ID for a mock object
        return (0, uuid_1.v4)();
    }
    const workspaceId = createMockUuid();
    beforeEach(() => {
        (0, mock_fs_1.default)({ [path_1.default.resolve(__dirname, testDbString)]: '' });
        (0, db_1.reset)(testDbString);
    });
    afterEach(() => {
        mock_fs_1.default.restore();
    });
    describe('getWorkspaces', () => {
        it('returns the workspaces from the db', () => {
            const workspaces = utils.getWorkspaces(testDbString);
            expect(workspaces).toBeDefined();
            expect(workspaces).toHaveLength(1);
            expect(workspaces[0].id).toBe(workspaceId);
            expect(workspaces[0].title).toEqual("Wiley's Shipping");
            expect(workspaces[0].buildShipments).toHaveLength(1);
            expect(workspaces[0].buildShipments[0].buildNumber).toEqual('A82D2-108');
            expect(workspaces[0].buildShipments[0].shipments).toHaveLength(1);
            expect(workspaces[0].buildShipments[0].shipments[0].description).toEqual('64 units');
        });
    });
    describe('getWorkspace', () => {
        it('returns the queried workspace from the db', () => {
            const workspace = utils.getWorkspace(testDbString, workspaceId);
            expect(workspace).toBeDefined();
            expect(workspace.title).toEqual("Wiley's Shipping");
            expect(workspace.buildShipments).toHaveLength(1);
        });
    });
    describe('createWorkspace', () => {
        it('creates a new workspace', () => {
            const workspace = utils.createWorkspace(testDbString);
            expect(workspace).toBeDefined();
            expect(workspace.title).toEqual('');
            expect(workspace.buildShipments).toHaveLength(1);
            expect(workspace.buildShipments[0].shipments).toHaveLength(1);
            expect(workspace.buildShipments[0].buildNumber).toEqual('');
            expect(workspace.buildShipments[0].shipments[0].description).toEqual('');
        });
    });
    describe('updateWorkspace', () => {
        it('updates a workspace', () => {
            const workspace = utils.createWorkspace(testDbString);
            workspace.title = "Arnav's Shipping";
            utils.updateWorkspace(testDbString, workspace);
            const updatedWorkspace = utils.getWorkspace(testDbString, workspace.id);
            expect(updatedWorkspace.title).toEqual("Arnav's Shipping");
        });
    });
});
