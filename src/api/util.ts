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

/** Delete a shipment from a specific shipment table within a workspace */
export function deleteShipment(
  dbString: string,
  workspaceId: string,
  shipmentTableId: string,
  shipmentId: string
): Workspace {
  const workspace = getWorkspace(dbString, workspaceId)

  const tableIndex = workspace.buildShipments.findIndex((t) => t.id === shipmentTableId)
  if (tableIndex === -1) {
    throw new Error('Could not find shipment table with id "' + shipmentTableId + '"')
  }

  const shipments = workspace.buildShipments[tableIndex].shipments
  const shipmentIndex = shipments.findIndex((s) => s.id === shipmentId)
  if (shipmentIndex === -1) {
    throw new Error('Could not find shipment with id "' + shipmentId + '"')
  }

  shipments.splice(shipmentIndex, 1)
  return updateWorkspace(dbString, workspace)
}
