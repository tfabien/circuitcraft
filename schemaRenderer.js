import { moduleTypes } from './modules.js';
import {
    getSchemas,
    saveModule as saveModuleToSchema,
    addRail as addRailToSchema
} from './schemaManager.js';

export function renderSchemas() {
    const schemas = getSchemas();
    const container = document.getElementById('schemas-container');
    container.innerHTML = '';

    schemas.forEach((tableau, tableauIndex) => {
        const tableauElement = renderTableau(tableau, tableauIndex);
        container.appendChild(tableauElement);
    });
}

function renderTableau(tableau, tableauIndex) {
    const tableauElement = document.createElement('div');
    tableauElement.className = 'tableau';
    tableauElement.innerHTML = `
        <h2>Tableau ${tableauIndex + 1}: ${tableau.name}</h2>
        <div class="rails"></div>
        <button onclick="addRail(${tableauIndex})">Ajouter rail</button>
    `;

    const railsContainer = tableauElement.querySelector('.rails');
    tableau.rails.forEach((rail, railIndex) => {
        const railElement = renderRail(tableauIndex, rail, railIndex);
        railsContainer.appendChild(railElement);
    });

    return tableauElement;
}

function renderRail(tableauIndex, rail, railIndex) {
    const railElement = document.createElement('div');
    railElement.className = 'rail';
    railElement.innerHTML = `
        <h3>Rail ${railIndex + 1}</h3>
        <div class="modules"></div>
    `;

    const modulesContainer = railElement.querySelector('.modules');
    rail.modules.forEach((module, moduleIndex) => {
        const moduleElement = renderModule(tableauIndex, railIndex, module, moduleIndex);
        modulesContainer.appendChild(moduleElement);
    });

    const emptyModuleElement = renderEmptyModule(tableauIndex, railIndex);
    modulesContainer.appendChild(emptyModuleElement);

    return railElement;
}

function renderModule(tableauIndex, railIndex, module, moduleIndex) {
    const moduleElement = document.createElement('div');
    moduleElement.className = 'module';

    const moduleType = moduleTypes.find(type => type.id === module.type);
    if (moduleType) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "100");

        moduleType.renderSVG(svg, module);

        moduleElement.appendChild(svg);
    }

    const paragraph = document.createElement('p');
    paragraph.textContent = `Module ${moduleIndex + 1}: ${module.nom || 'Unnamed'}`;
    moduleElement.appendChild(paragraph);

    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = () => removeModule(tableauIndex, railIndex, moduleIndex);
    moduleElement.appendChild(button);

    return moduleElement;
}

function renderEmptyModule(tableauIndex, railIndex) {
    const emptyModuleElement = document.createElement('div');
    emptyModuleElement.className = 'module placeholder';
    emptyModuleElement.style.border = '2px dashed #ccc';
    emptyModuleElement.style.textAlign = 'center';
    emptyModuleElement.innerHTML = `
        <button onclick="showModuleModal(${tableauIndex}, ${railIndex})">+</button>
        <p>Ajouter module</p>
    `;

    return emptyModuleElement;
}

export function showTableauModal() {
    document.getElementById('tableauModal').style.display = 'block';
}

// Fonction pour afficher le modal d'ajout/modification de module
export function showModuleModal(tableauId, railId, moduleIndex = null) {
    const modalTitle = document.getElementById('modalTitle');
    const ajouterModifierText = moduleIndex === null ? 'Ajouter' : 'Modifier';
    modalTitle.textContent = ajouterModifierText + ' un module';

    const moduleForm = document.getElementById('moduleForm');
    moduleForm.innerHTML = '';

    // Définir les attributs data sur le modal
    const moduleModal = document.getElementById('moduleModal');
    moduleModal.setAttribute('data-tableau-id', tableauId);
    moduleModal.setAttribute('data-rail-id', railId);
    moduleModal.setAttribute('data-module-index', moduleIndex !== null ? moduleIndex : '');

    // Création de la liste déroulante pour le type de module
    const moduleTypeSelect = document.createElement('select');
    moduleTypeSelect.id = 'moduleType';
    moduleTypeSelect.name = 'moduleType';
    moduleTypeSelect.onchange = updateForm;

    moduleTypes.forEach(moduleType => {
        const option = document.createElement('option');
        option.value = moduleType.id;
        option.textContent = moduleType.id;
        moduleTypeSelect.appendChild(option);
    });

    moduleForm.appendChild(moduleTypeSelect);

    if (moduleIndex !== null) {
        const module = getSchemas()[tableauId].rails[railId].modules[moduleIndex];
        moduleTypeSelect.value = module.type;
    } else {
        moduleTypeSelect.value = moduleTypes[0].id;
    }

    updateForm();

    if (moduleIndex !== null) {
        const module = getSchemas()[tableauId].rails[railId].modules[moduleIndex];
        const moduleType = moduleTypes.find(m => m.id === module.type);
        if (moduleType) {
            moduleType.attributes.forEach(attr => {
                const input = document.getElementById(attr.name);
                if (input) {
                    input.value = module[attr.name];
                }
            });
        }
    }

    document.getElementById('moduleModal').style.display = 'block';
}

export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fonction pour mettre à jour le formulaire de module en fonction du type de module sélectionné
export function updateForm() {
    const moduleType = document.getElementById('moduleType').value;
    const moduleForm = document.getElementById('moduleForm');

    const currentValues = {};
    const currentInputs = moduleForm.querySelectorAll('input, select');
    currentInputs.forEach(input => {
        currentValues[input.id] = input.value;
    });

    while (moduleForm.children.length > 1) {
        moduleForm.removeChild(moduleForm.lastChild);
    }

    const module = moduleTypes.find(m => m.id === moduleType);
    if (module) {
        module.attributes.forEach(attr => {
            const label = document.createElement('label');
            label.setAttribute('for', attr.name);
            label.textContent = attr.label;
            moduleForm.appendChild(label);

            let input;
            if (attr.type === 'select') {
                input = document.createElement('select');
                input.id = attr.name;
                input.name = attr.name;
                attr.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
            } else {
                input = document.createElement('input');
                input.type = attr.type;
                input.id = attr.name;
                input.name = attr.name;
                if (attr.placeholder) {
                    input.placeholder = attr.placeholder;
                }
            }
            moduleForm.appendChild(input);

            if (currentValues[attr.name]) {
                input.value = currentValues[attr.name];
            }
        });
    }

    // Ajout du bouton d'enregistrement
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Enregistrer';
    saveButton.onclick = () => {
        const moduleModal = document.getElementById('moduleModal');
        const tableauId = parseInt(moduleModal.getAttribute('data-tableau-id'));
        const railId = parseInt(moduleModal.getAttribute('data-rail-id'));
        const moduleIndex = moduleModal.getAttribute('data-module-index');
        const moduleIndexValue = moduleIndex !== null && moduleIndex !== '' ? parseInt(moduleIndex) : null;
        saveModule(tableauId, railId, moduleIndexValue);
    };
    moduleForm.appendChild(saveButton);
}

export function saveModule(tableauId, railId, moduleIndex) {
    const moduleType = document.getElementById('moduleType').value;
    const module = { type: moduleType };

    moduleTypes.find(m => m.id === moduleType).attributes.forEach(attr => {
        module[attr.name] = document.getElementById(attr.name).value;
    });

    saveModuleToSchema(tableauId, railId, moduleIndex, module);
    closeModal('moduleModal');
    renderSchemas();
}

export function addRail(tableauId) {
    addRailToSchema(tableauId);
    renderSchemas();
}