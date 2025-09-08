"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationErrors = exports.validateWorkspace = exports.validateShipmentTable = exports.validateShipment = exports.validateNumberField = exports.validateStringField = exports.ValidationError = void 0;
/** Validation error class for structured error handling */
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/** Validates a string field for common requirements */
function validateStringField(value, fieldName, options = {}) {
    const errors = [];
    const { required = true, minLength = 1, maxLength = 255, allowEmpty = false } = options;
    // Check if value exists
    if (value === null || value === undefined) {
        if (required) {
            errors.push(new ValidationError(`${fieldName} is required`, fieldName));
        }
        return errors;
    }
    // Convert to string
    const stringValue = String(value).trim();
    // Check if empty
    if (stringValue === '' && !allowEmpty && required) {
        errors.push(new ValidationError(`${fieldName} cannot be empty`, fieldName));
        return errors;
    }
    // Check length
    if (stringValue.length < minLength && stringValue !== '') {
        errors.push(new ValidationError(`${fieldName} must be at least ${minLength} characters long`, fieldName));
    }
    if (stringValue.length > maxLength) {
        errors.push(new ValidationError(`${fieldName} must be no more than ${maxLength} characters long`, fieldName));
    }
    return errors;
}
exports.validateStringField = validateStringField;
/** Validates a number field for common requirements */
function validateNumberField(value, fieldName, options = {}) {
    const errors = [];
    const { required = true, min = 0, max = Number.MAX_SAFE_INTEGER, allowZero = true, allowNegative = false } = options;
    // Check if value exists
    if (value === null || value === undefined) {
        if (required) {
            errors.push(new ValidationError(`${fieldName} is required`, fieldName));
        }
        return errors;
    }
    // Convert to number
    const numValue = Number(value);
    // Check if it's a valid number
    if (isNaN(numValue)) {
        errors.push(new ValidationError(`${fieldName} must be a valid number`, fieldName));
        return errors;
    }
    // Check if zero is allowed
    if (numValue === 0 && !allowZero) {
        errors.push(new ValidationError(`${fieldName} cannot be zero`, fieldName));
    }
    // Check if negative is allowed
    if (numValue < 0 && !allowNegative) {
        errors.push(new ValidationError(`${fieldName} cannot be negative`, fieldName));
    }
    // Check range
    if (numValue < min) {
        errors.push(new ValidationError(`${fieldName} must be at least ${min}`, fieldName));
    }
    if (numValue > max) {
        errors.push(new ValidationError(`${fieldName} must be no more than ${max}`, fieldName));
    }
    return errors;
}
exports.validateNumberField = validateNumberField;
/** Validates a shipment object */
function validateShipment(shipment) {
    const errors = [];
    // Validate order number
    errors.push(...validateStringField(shipment.orderNumber, 'Order Number', {
        required: true,
        minLength: 1,
        maxLength: 50
    }));
    // Validate description
    errors.push(...validateStringField(shipment.description, 'Description', {
        required: true,
        minLength: 1,
        maxLength: 200
    }));
    // Validate cost (in cents)
    errors.push(...validateNumberField(shipment.cost, 'Cost', {
        required: true,
        min: 0,
        max: 100000000,
        allowZero: false,
        allowNegative: false
    }));
    return {
        isValid: errors.length === 0,
        errors
    };
}
exports.validateShipment = validateShipment;
/** Validates a shipment table object */
function validateShipmentTable(shipmentTable) {
    const errors = [];
    // Validate build number
    errors.push(...validateStringField(shipmentTable.buildNumber, 'Build Number', {
        required: true,
        minLength: 1,
        maxLength: 50
    }));
    // Validate shipments array
    if (!Array.isArray(shipmentTable.shipments)) {
        errors.push(new ValidationError('Shipments must be an array', 'shipments'));
    }
    else {
        // Validate each shipment
        shipmentTable.shipments.forEach((shipment, index) => {
            const shipmentValidation = validateShipment(shipment);
            shipmentValidation.errors.forEach(error => {
                errors.push(new ValidationError(`${error.message} (shipment ${index + 1})`, `shipments[${index}].${error.field}`));
            });
        });
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
exports.validateShipmentTable = validateShipmentTable;
/** Validates a workspace object */
function validateWorkspace(workspace) {
    const errors = [];
    // Validate title
    errors.push(...validateStringField(workspace.title, 'Title', {
        required: true,
        minLength: 1,
        maxLength: 100
    }));
    // Validate build shipments array
    if (!Array.isArray(workspace.buildShipments)) {
        errors.push(new ValidationError('Build shipments must be an array', 'buildShipments'));
    }
    else {
        // Validate each shipment table
        workspace.buildShipments.forEach((shipmentTable, index) => {
            const tableValidation = validateShipmentTable(shipmentTable);
            tableValidation.errors.forEach(error => {
                errors.push(new ValidationError(`${error.message} (table ${index + 1})`, `buildShipments[${index}].${error.field}`));
            });
        });
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
exports.validateWorkspace = validateWorkspace;
/** Helper function to format validation errors for API responses */
function formatValidationErrors(errors) {
    return errors.map(error => `${error.field}: ${error.message}`).join('; ');
}
exports.formatValidationErrors = formatValidationErrors;
