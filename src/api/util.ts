import { all, findOne, insert, update } from './db/db'
import { Workspace } from './types'
import { v4 as uuidv4 } from 'uuid'

/** Returns a list of all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns a single workspace from the database */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

/** Create a workspace in the database */
export function createWorkspace(dbString: string): Workspace {
  const workspace: Workspace = {
    id: uuidv4(),
    title: '',
    buildShipments: [
      {
        id: uuidv4(),
        buildNumber: '',
        // Initialize the workspace with a single empty build shipment
        shipments: [
          {
            id: uuidv4(),
            orderNumber: '',
            description: '',
            cost: 0,
          }
        ],
      },
    ],
  }
  insert(dbString, 'workspaces', workspace)
  return workspace
}

/** Update a workspace in the database */
export function updateWorkspace(dbString: string, workspace: Workspace): Workspace {
  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Duplicate a shipment table within a workspace, generating new IDs */
export function duplicateShipmentTable(
  dbString: string,
  workspaceId: string,
  shipmentTableId: string
): Workspace {
  const workspace = getWorkspace(dbString, workspaceId)

  const tableIndex = workspace.buildShipments.findIndex((t) => t.id === shipmentTableId)
  if (tableIndex === -1) {
    throw new Error('Could not find shipment table with id "' + shipmentTableId + '"')
  }

  const original = workspace.buildShipments[tableIndex]

  const duplicatedTable = {
    id: uuidv4(),
    buildNumber: original.buildNumber ? original.buildNumber + ' (Copy)' : '',
    shipments: original.shipments.map((s) => ({
      id: uuidv4(),
      orderNumber: s.orderNumber,
      description: s.description,
      cost: s.cost,
    })),
  }

  // Insert duplicated table right after the original
  workspace.buildShipments.splice(tableIndex + 1, 0, duplicatedTable)

  return updateWorkspace(dbString, workspace)
}
