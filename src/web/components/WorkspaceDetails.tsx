import { useEffect, useState } from 'react'
import '../style/WorkspaceDetails.css'
import DosspaceApi from '../api'
import { useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface Shipment {
  id: string
  description: string
  orderNumber: string
  cost: number
}

interface ShipmentTable {
  id: string
  buildNumber: string
  shipments: Shipment[]
}

export interface DetailWorkspace {
  id: string
  title: string
  buildShipments: ShipmentTable[]
}

type WorkspaceDetailsParams = {
  workspaceId: string
}

/** Detail view of individual workspace */
export default function WorkspaceDetails() {
  const { workspaceId } = useParams() as WorkspaceDetailsParams
  const [workspace, setWorkspace] = useState<DetailWorkspace | null>(null)
  const [newRow, setNewRow] = useState<Shipment | null>(null)

  // Fetch all workspaces from the API
  useEffect(() => {
    if (newRow) {
      return
    }

    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(workspace)
    }

    fetchWorkspace()
  }, [workspaceId, newRow])

  const handleAddRow = () => {
    const newShipment: Shipment = {
      id: '',
      description: '',
      orderNumber: '',
      cost: 0,
    }
    setNewRow(newShipment)
  }

  // Convert the stored cents value to dollars
  const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: 'USD',
  })
  const centsToDollarFormat = (cost: number) => {
    return dollarFormatter.format(cost / 100)
  }

  const updateNewRow = (newValue: string | number, field: keyof Shipment) => {
    if (!newRow) {
      return
    }
    setNewRow({ ...newRow, [field]: newValue })
  }

  const handleSave = async () => {
    if (!workspace || !newRow) {
      return
    }

    const updatedWorkspace: DetailWorkspace = {
      ...workspace,
      buildShipments: [
        {
          ...workspace.buildShipments[0],
          shipments: [...workspace.buildShipments[0].shipments, newRow],
        },
      ],
    }
    await DosspaceApi.updateWorkspace(updatedWorkspace)

    setNewRow(null)
  }

  return (
    <div className="WorkspaceDetails">
      {workspace && (
        <div key={workspace.id}>
          <h1 className="WorkspaceDetails__header">{workspace.title}</h1>
          {workspace.buildShipments.map((shipmentTable) => {
            return (
              <div key={shipmentTable.id}>
                <div
                  className="WorkspaceDetails__workspaceCard"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h3>{shipmentTable.buildNumber}</h3>
                  <div className="WorkspaceDetails__editIcon">
                    {newRow ? (
                      <div onClick={handleSave}>Save</div>
                    ) : (
                      <div onClick={handleAddRow}>
                        Add Row <FontAwesomeIcon icon={faPlus} />
                      </div>
                    )}
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Cost</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipmentTable.shipments.map((shipment) => {
                      return (
                        <tr key={shipment.id}>
                          <td>{shipment.orderNumber}</td>
                          <td>{centsToDollarFormat(shipment.cost)}</td>
                          <td>{shipment.description}</td>
                        </tr>
                      )
                    })}
                    {newRow && (
                      <tr key={newRow.id} className="WorkspaceDetails__newRow">
                        <td>
                          <input
                            value={newRow.orderNumber}
                            onChange={(e) => updateNewRow(e.target.value, 'orderNumber')}
                            onBlur={(e) => updateNewRow(e.target.value, 'orderNumber')}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={newRow.cost / 100}
                            step="0.01"
                            onChange={(e) =>
                              updateNewRow(Math.round(e.target.valueAsNumber * 100), 'cost')
                            }
                            onBlur={(e) =>
                              updateNewRow(Math.round(e.target.valueAsNumber * 100), 'cost')
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={newRow.description}
                            onChange={(e) => updateNewRow(e.target.value, 'description')}
                            onBlur={(e) => updateNewRow(e.target.value, 'description')}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
