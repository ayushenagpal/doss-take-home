"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.all = exports.findOne = exports.deleteObj = exports.update = exports.insert = exports.getFilePath = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
function getFilePath(dbFile) {
    return path_1.default.resolve(__dirname, dbFile);
}
exports.getFilePath = getFilePath;
/** Insert a new object into the database */
function insert(dbFile, key, obj) {
    const data = fs_1.default.readFileSync(getFilePath(dbFile), 'utf8');
    const json = JSON.parse(data);
    json[key] || (json[key] = []);
    json[key].push(obj);
    fs_1.default.writeFileSync(getFilePath(dbFile), JSON.stringify(json));
}
exports.insert = insert;
/** Update an existing object in the database */
function update(dbFile, key, id, obj) {
    const data = fs_1.default.readFileSync(getFilePath(dbFile), 'utf8');
    const json = JSON.parse(data);
    const updatingIndex = json[key].findIndex((item) => item.id === id);
    if (updatingIndex === -1) {
        throw new Error('Could not find object with id "' + id + '"');
    }
    json[key].splice(updatingIndex, 1, obj);
    fs_1.default.writeFileSync(getFilePath(dbFile), JSON.stringify(json));
}
exports.update = update;
/** Delete an existing object from the database */
function deleteObj(dbFile, key, id) {
    const data = fs_1.default.readFileSync(getFilePath(dbFile), 'utf8');
    const json = JSON.parse(data);
    const removingIndex = json[key].findIndex((item) => item.id === id);
    if (removingIndex === -1) {
        throw new Error('Could not find object with id "' + id + '"');
    }
    json[key].splice(removingIndex, 1);
    fs_1.default.writeFileSync(getFilePath(dbFile), JSON.stringify(json));
}
exports.deleteObj = deleteObj;
/** Return a single object from the database */
function findOne(dbFile, key, id) {
    const data = fs_1.default.readFileSync(getFilePath(dbFile), 'utf8');
    const json = JSON.parse(data);
    const result = json[key].find((item) => item.id === id);
    if (!result) {
        throw new Error('Could not find item with id "' + id + '"');
    }
    return result;
}
exports.findOne = findOne;
/** Return all objects from the database */
function all(dbFile, key) {
    const data = fs_1.default.readFileSync(getFilePath(dbFile), 'utf8');
    const json = JSON.parse(data);
    return json[key];
}
exports.all = all;
/** Reset the database to a single workspace and invoice */
function reset(dbFile, uuid) {
    const workspaces = [
        {
            id: uuid !== null && uuid !== void 0 ? uuid : (0, uuid_1.v4)(),
            title: "Wiley's Shipping",
            buildShipments: [
                {
                    id: (0, uuid_1.v4)(),
                    buildNumber: 'A82D2-108',
                    // Initialize the workspace with a single empty build shipment
                    shipments: [
                        {
                            id: (0, uuid_1.v4)(),
                            description: '64 units',
                            orderNumber: '121-5821131-5985042',
                            cost: 107643,
                        },
                    ],
                },
            ],
        },
    ];
    fs_1.default.writeFileSync(getFilePath(dbFile), JSON.stringify({ workspaces }));
}
exports.reset = reset;
