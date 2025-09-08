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
  const [validationErrors, setValidationErrors] = useState<{
    orderNumber?: string
    description?: string
    cost?: string
  }>({})
  const [serverError, setServerError] = useState<string | null>(null)

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
    setValidationErrors({})
    setServerError(null)
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
    const updated = { ...newRow, [field]: newValue }
    setNewRow(updated)
    validate(updated)
  }

  const validate = (row: Shipment) => {
    const errors: { orderNumber?: string; description?: string; cost?: string } = {}
    const order = String(row.orderNumber || '').trim()
    if (!order) {
      errors.orderNumber = 'Required'
    } else if (!/^[0-9-]+$/.test(order)) {
      errors.orderNumber = 'Digits and hyphens only'
    }
    const desc = String(row.description || '').trim()
    if (!desc) {
      errors.description = 'Required'
    }
    const cost = Number(row.cost)
    if (Number.isNaN(cost) || cost < 0) {
      errors.cost = 'Must be ≥ 0'
    }
    setValidationErrors(errors)
    return errors
  }

  const isValid = !!newRow &&
    !validationErrors.orderNumber &&
    !validationErrors.description &&
    !validationErrors.cost

  const handleSave = async () => {
    if (!workspace || !newRow) {
      return
    }
    setServerError(null)
    const errs = validate(newRow)
    if (Object.keys(errs).length > 0) {
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
    try {
      await DosspaceApi.updateWorkspace(updatedWorkspace)
    } catch (e: any) {
      setServerError('Save failed. Please check inputs and try again.')
      return
    }

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
                      <div style={{ opacity: isValid ? 1 : 0.5, pointerEvents: isValid ? 'auto' : 'none' }} onClick={handleSave}>Save</div>
                    ) : (
                      <div onClick={handleAddRow}>
                        Add Row <FontAwesomeIcon icon={faPlus} />
                      </div>
                    )}
                  </div>
                </div>
                {serverError && (
                  <div style={{ color: 'crimson', margin: '8px 0' }}>{serverError}</div>
                )}
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
                          {validationErrors.orderNumber && (
                            <div style={{ color: 'crimson', fontSize: 12 }}>{validationErrors.orderNumber}</div>
                          )}
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
                          {validationErrors.cost && (
                            <div style={{ color: 'crimson', fontSize: 12 }}>{validationErrors.cost}</div>
                          )}
                        </td>
                        <td>
                          <input
                            value={newRow.description}
                            onChange={(e) => updateNewRow(e.target.value, 'description')}
                            onBlur={(e) => updateNewRow(e.target.value, 'description')}
                          />
                          {validationErrors.description && (
                            <div style={{ color: 'crimson', fontSize: 12 }}>{validationErrors.description}</div>
                          )}
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
