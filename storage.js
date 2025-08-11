// storage.js
import { getSchemas, setSchemas } from './schemaManager.js';

export function loadSchemasFromLocalStorage() {
    const savedSchemas = localStorage.getItem('electricalSchemas');
    if (savedSchemas) {
        setSchemas(JSON.parse(savedSchemas));
    }
}

export function saveSchemasToLocalStorage() {
    localStorage.setItem('electricalSchemas', JSON.stringify(getSchemas()));
}