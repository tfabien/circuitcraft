import {
    renderSchemas,
    showTableauModal,
    showModuleModal,
    closeModal,
    updateForm
} from './schemaRenderer.js';

import {
    addTableau,
    addRail,
    removeModule,
    removeRail,
    saveModule,
    clearAll,
    loadSchemas,
    saveSchemasToFile
} from './schemaManager.js';

import { loadSchemasFromLocalStorage } from './storage.js';

window.showTableauModal = showTableauModal;
window.showModuleModal = showModuleModal;
window.closeModal = closeModal;
window.updateForm = updateForm;
window.saveModule = saveModule;
window.removeModule = removeModule;
window.addTableau = () => {
    const tableauName = document.getElementById('tableauName').value;
    addTableau(tableauName);
    closeModal('tableauModal');
    renderSchemas();
};
window.addRail = (tableauIndex) => {
    addRail(tableauIndex);
    renderSchemas();
};
window.removeModule = (tableauIndex, railIndex, moduleIndex) => {
    removeModule(tableauIndex, railIndex, moduleIndex);
    renderSchemas();
};
window.removeRail = (tableauIndex, railIndex) => {
    removeRail(tableauIndex, railIndex);
    renderSchemas();
};
window.clearAll = clearAll;
window.loadSchemas = loadSchemas;
window.saveSchemas = saveSchemasToFile;

window.onload = () => {
    loadSchemasFromLocalStorage(); 
    renderSchemas();
};

