// Import the function to save schemas to local storage
import { saveSchemasToLocalStorage } from './storage.js';

// Array to hold all the schemas
let schemas = [];

// Function to get the current schemas
export function getSchemas() {
    return schemas;
}

// Function to set the schemas
export function setSchemas(newSchemas) {
    schemas = newSchemas;
}

// Function to add a new tableau
export function addTableau(tableauName) {
    const schemas = getSchemas();
    schemas.push({ name: tableauName, rails: [] }); // Add a new tableau with an empty rails array
    setSchemas(schemas);
    saveSchemasToLocalStorage(); // Save the updated schemas to local storage
}

// Function to save a module to a specific tableau and rail
export function saveModule(tableauId, railId, moduleIndex, module, moduleType) {
    const schemas = getSchemas();
    if (!schemas[tableauId]) {
        schemas[tableauId] = { name: `Tableau ${tableauId}`, rails: [] };
    }
    if (!schemas[tableauId].rails[railId]) {
        schemas[tableauId].rails[railId] = { modules: [] }; // Initialize the rail if it doesn't exist
    }
    const moduleWithType = { ...module, _type: moduleType }; // Include the moduleType in the module object
    if (moduleIndex === null) {
        // If moduleIndex is null, it means we are adding a new module
        schemas[tableauId].rails[railId].modules.push(moduleWithType); // Add the new module with type
    } else {
        // If moduleIndex is not null, it means we are updating an existing module
        schemas[tableauId].rails[railId].modules[moduleIndex] = moduleWithType;
    }

    setSchemas(schemas);
    saveSchemasToLocalStorage(); // Save the updated schemas to local storage
}

// Function to remove a specific module from a tableau and rail
export function removeModule(tableauId, railId, moduleIndex) {
    const schemas = getSchemas();
    schemas[tableauId].rails[railId].modules.splice(moduleIndex, 1); // Remove the module at the specified index
    setSchemas(schemas);
    saveSchemasToLocalStorage(); // Save the updated schemas to local storage
}

// Function to remove a specific rail from a tableau
export function removeRail(tableauId, railId) {
    const schemas = getSchemas();
    if (schemas[tableauId].rails[railId].modules.length === 0) {
        schemas[tableauId].rails.splice(railId, 1); // Remove the rail if it has no modules
        setSchemas(schemas);
        saveSchemasToLocalStorage(); // Save the updated schemas to local storage
    } else {
        alert("Le rail n'est pas vide. Veuillez supprimer tous les modules d'abord."); // Alert if the rail is not empty
    }
}

// Function to add a new rail to a specific tableau
export function addRail(tableauId) {
    const schemas = getSchemas();
    const railId = schemas[tableauId].rails.length; // Generate a new rail ID
    schemas[tableauId].rails.push({ id: railId, modules: [] }); // Add a new rail with an empty modules array
    setSchemas(schemas);
    saveSchemasToLocalStorage(); // Save the updated schemas to local storage
}

// Function to clear all schemas
export function clearAll() {
    if (confirm("Êtes-vous sûr de vouloir tout effacer ?")) { // Confirm before clearing all schemas
        setSchemas([]);
        saveSchemasToLocalStorage(); // Save the cleared schemas to local storage
    }
}

// Function to load schemas from a file
export function loadSchemas(event) {
    const file = event.target.files[0]; // Get the file from the input event
    const reader = new FileReader();
    reader.onload = function(e) {
        const schemas = JSON.parse(e.target.result); // Parse the file content as JSON
        setSchemas(schemas);
        saveSchemasToLocalStorage(); // Save the loaded schemas to local storage
    };
    reader.readAsText(file); // Read the file as text
}

// Function to save schemas to a file
export function saveSchemasToFile() {
    const data = JSON.stringify(getSchemas()); // Convert schemas to JSON string
    const blob = new Blob([data], { type: 'application/json' }); // Create a blob with the JSON data
    const url = URL.createObjectURL(blob); // Create an object URL for the blob
    const a = document.createElement('a'); // Create a link element
    a.href = url;
    a.download = 'schemas.json'; // Set the download file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the link element
}