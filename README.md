# Doss take-home technical challenge

Getting Started:
1. Make sure you have NodeJS, npm, and yarn installed on your local machine.
2. Run `yarn install` from `src/web` and `web/api`.
3. Run `yarn start` from the root directory and the frontend should open at `localhost:3000`.
4. Open `localhost:3000/readme`.

# Details
This project contains a frontend and backend, with data stored in a JSON file.

- `src/web` contains all frontend files, with UI classes under the `components` direction and CSS in `style`. The class `api.ts` should contain
  client-side functions for interacting with the backend API.
- `src/api` contains all backend classes. API endpoints are defined in `app.ts`, functions for managing invoice and project data are in `util.ts`,
  and generic utility functions for interacting with the JSON data file are in `db/db.ts`.

# Useful Commands
To run prettier, run `yarn prettier`.
To run eslint, run `yarn eslint`.
To run tests, run `yarn test --watchAll=false`.

## API

Base URL: `http://localhost:8080`

### List workspaces
GET `/`

Example:
```bash
curl http://localhost:8080
```

### Get workspace details
GET `/:workspaceId`

Example:
```bash
curl http://localhost:8080/<workspaceId>
```

### Create workspace
POST `/`

Example:
```bash
curl -X POST http://localhost:8080
```

### Update workspace
POST `/:workspaceId`

Body: `{ "workspace": <workspaceObject> }`

Example:
```bash
curl -X POST http://localhost:8080/<workspaceId> \
  -H "Content-Type: application/json" \
  -d '{"workspace": {"id": "<workspaceId>", "title": "Updated", "buildShipments": []}}'
```

### Duplicate shipment table
POST `/:workspaceId/shipment-tables/:shipmentTableId/duplicate`

Example:
```bash
curl -X POST http://localhost:8080/<workspaceId>/shipment-tables/<shipmentTableId>/duplicate
```

### Delete shipment (row)
DELETE `/:workspaceId/shipment-tables/:shipmentTableId/shipments/:shipmentId`

Example:
```bash
curl -X DELETE http://localhost:8080/<workspaceId>/shipment-tables/<shipmentTableId>/shipments/<shipmentId>
```

### Validation
On update/create, invalid input returns `400` with `{ error, details }`. Notably:
- `orderNumber`: digits and hyphens only
- `cost`: positive integer (cents)
