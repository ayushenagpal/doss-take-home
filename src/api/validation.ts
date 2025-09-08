/** Validation error class for structured error handling */
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/** Validation result type */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/** Validates a string field for common requirements */
export function validateStringField(
  value: any,
  fieldName: string,
  options: {
    required?: boolean
    minLength?: number
    maxLength?: number
    allowEmpty?: boolean
  } = {}
): ValidationError[] {
  const errors: ValidationError[] = []
  const { required = true, minLength = 1, maxLength = 255, allowEmpty = false } = options

  // Check if value exists
  if (value === null || value === undefined) {
    if (required) {
      errors.push(new ValidationError(`${fieldName} is required`, fieldName))
    }
    return errors
  }

  // Convert to string
  const stringValue = String(value).trim()

  // Check if empty
  if (stringValue === '' && !allowEmpty && required) {
    errors.push(new ValidationError(`${fieldName} cannot be empty`, fieldName))
    return errors
  }

  // Check length
  if (stringValue.length < minLength && stringValue !== '') {
    errors.push(new ValidationError(`${fieldName} must be at least ${minLength} characters long`, fieldName))
  }

  if (stringValue.length > maxLength) {
    errors.push(new ValidationError(`${fieldName} must be no more than ${maxLength} characters long`, fieldName))
  }

  return errors
}

/** Validates a number field for common requirements */
export function validateNumberField(
  value: any,
  fieldName: string,
  options: {
    required?: boolean
    min?: number
    max?: number
    allowZero?: boolean
    allowNegative?: boolean
  } = {}
): ValidationError[] {
  const errors: ValidationError[] = []
  const { required = true, min = 0, max = Number.MAX_SAFE_INTEGER, allowZero = true, allowNegative = false } = options

  // Check if value exists
  if (value === null || value === undefined) {
    if (required) {
      errors.push(new ValidationError(`${fieldName} is required`, fieldName))
    }
    return errors
  }

  // Convert to number
  const numValue = Number(value)

  // Check if it's a valid number
  if (isNaN(numValue)) {
    errors.push(new ValidationError(`${fieldName} must be a valid number`, fieldName))
    return errors
  }

  // Check if zero is allowed
  if (numValue === 0 && !allowZero) {
    errors.push(new ValidationError(`${fieldName} cannot be zero`, fieldName))
  }

  // Check if negative is allowed
  if (numValue < 0 && !allowNegative) {
    errors.push(new ValidationError(`${fieldName} cannot be negative`, fieldName))
  }

  // Check range
  if (numValue < min) {
    errors.push(new ValidationError(`${fieldName} must be at least ${min}`, fieldName))
  }

  if (numValue > max) {
    errors.push(new ValidationError(`${fieldName} must be no more than ${max}`, fieldName))
  }

  return errors
}

/** Validates a shipment object */
export function validateShipment(shipment: any): ValidationResult {
  const errors: ValidationError[] = []

  // Validate order number
  errors.push(...validateStringField(shipment.orderNumber, 'Order Number', {
    required: true,
    minLength: 1,
    maxLength: 50
  }))
  // Enforce allowed characters: digits and hyphens only
  if (shipment.orderNumber !== null && shipment.orderNumber !== undefined) {
    const orderStr = String(shipment.orderNumber).trim()
    if (orderStr !== '' && !/^[0-9-]+$/.test(orderStr)) {
      errors.push(new ValidationError('Order Number may contain only digits and hyphens', 'Order Number'))
    }
  }

  // Validate description
  errors.push(...validateStringField(shipment.description, 'Description', {
    required: true,
    minLength: 1,
    maxLength: 200
  }))

  // Validate cost (in cents)
  errors.push(...validateNumberField(shipment.cost, 'Cost', {
    required: true,
    min: 0,
    max: 100000000, // $1,000,000 in cents
    allowZero: false,
    allowNegative: false
  }))

  return {
    isValid: errors.length === 0,
    errors
  }
}

/** Validates a shipment table object */
export function validateShipmentTable(shipmentTable: any): ValidationResult {
  const errors: ValidationError[] = []

  // Validate build number
  errors.push(...validateStringField(shipmentTable.buildNumber, 'Build Number', {
    required: true,
    minLength: 1,
    maxLength: 50
  }))

  // Validate shipments array
  if (!Array.isArray(shipmentTable.shipments)) {
    errors.push(new ValidationError('Shipments must be an array', 'shipments'))
  } else {
    // Validate each shipment
    shipmentTable.shipments.forEach((shipment: any, index: number) => {
      const shipmentValidation = validateShipment(shipment)
      shipmentValidation.errors.forEach(error => {
        errors.push(new ValidationError(`${error.message} (shipment ${index + 1})`, `shipments[${index}].${error.field}`))
      })
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/** Validates a workspace object */
export function validateWorkspace(workspace: any): ValidationResult {
  const errors: ValidationError[] = []

  // Validate title
  errors.push(...validateStringField(workspace.title, 'Title', {
    required: true,
    minLength: 1,
    maxLength: 100
  }))

  // Validate build shipments array
  if (!Array.isArray(workspace.buildShipments)) {
    errors.push(new ValidationError('Build shipments must be an array', 'buildShipments'))
  } else {
    // Validate each shipment table
    workspace.buildShipments.forEach((shipmentTable: any, index: number) => {
      const tableValidation = validateShipmentTable(shipmentTable)
      tableValidation.errors.forEach(error => {
        errors.push(new ValidationError(`${error.message} (table ${index + 1})`, `buildShipments[${index}].${error.field}`))
      })
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/** Helper function to format validation errors for API responses */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => `${error.field}: ${error.message}`).join('; ')
}
