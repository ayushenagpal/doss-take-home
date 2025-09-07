/** A single shipment with a description, order #, and cost */
export interface Shipment {
  id: string
  description: string
  orderNumber: string

  /** Amount paid in cents */
  cost: number
}

/** A simple shipment table containing any number of shipments for a specified build */
export interface ShipmentTable {
  id: string
  buildNumber: string // Treat this like the name of the shipment table
  shipments: Shipment[]
}

/** A workspace with a title and an invoice */
export interface Workspace {
  id: string
  title: string
  /** Table to track each shipping status for individual build */
  buildShipments: ShipmentTable[]
}
