import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { Workspace } from '../types'
import path from 'path'

export function getFilePath(dbFile: string): string {
  return path.resolve(__dirname, dbFile)
}

/** Insert a new object into the database */
export function insert(dbFile: string, key: string, obj: Workspace) {
  const data = fs.readFileSync(getFilePath(dbFile), 'utf8')
  const json = JSON.parse(data)
  json[key] ||= []
  json[key].push(obj)
  fs.writeFileSync(getFilePath(dbFile), JSON.stringify(json))
}

/** Update an existing object in the database */
export function update(dbFile: string, key: 'workspaces', id: string, obj: Workspace) {
  const data = fs.readFileSync(getFilePath(dbFile), 'utf8')
  const json: { workspaces: Workspace[] } = JSON.parse(data)
  const updatingIndex = json[key].findIndex((item) => item.id === id)
  if (updatingIndex === -1) {
    throw new Error('Could not find object with id "' + id + '"')
  }
  json[key].splice(updatingIndex, 1, obj)
  fs.writeFileSync(getFilePath(dbFile), JSON.stringify(json))
}

/** Delete an existing object from the database */
export function deleteObj(dbFile: string, key: 'workspaces', id: string) {
  const data = fs.readFileSync(getFilePath(dbFile), 'utf8')
  const json: { workspaces: Workspace[] } = JSON.parse(data)
  const removingIndex = json[key].findIndex((item) => item.id === id)
  if (removingIndex === -1) {
    throw new Error('Could not find object with id "' + id + '"')
  }
  json[key].splice(removingIndex, 1)
  fs.writeFileSync(getFilePath(dbFile), JSON.stringify(json))
}

/** Return a single object from the database */
export function findOne(dbFile: string, key: 'workspaces', id: string) {
  const data = fs.readFileSync(getFilePath(dbFile), 'utf8')

  const json: { workspaces: Workspace[] } = JSON.parse(data)
  const result = json[key].find((item) => item.id === id)
  if (!result) {
    throw new Error('Could not find item with id "' + id + '"')
  }
  return result
}

/** Return all objects from the database */
export function all(dbFile: string, key: string) {
  const data = fs.readFileSync(getFilePath(dbFile), 'utf8')
  const json = JSON.parse(data)
  return json[key]
}

/** Reset the database to a single workspace and invoice */
export function reset(dbFile: string, uuid?: string) {
  const workspaces: Workspace[] = [
    {
      id: uuid ?? uuidv4(),
      title: "Wiley's Shipping",
      buildShipments: [
        {
          id: uuidv4(),
          buildNumber: 'A82D2-108',
          // Initialize the workspace with a single empty build shipment
          shipments: [
            {
              id: uuidv4(),
              description: '64 units',
              orderNumber: '121-5821131-5985042',
              cost: 107_643,
            },
          ],
        },
      ],
    },
  ]
  fs.writeFileSync(getFilePath(dbFile), JSON.stringify({ workspaces }))
}
