// modules/differentiel.js
export const id = 'differentiel';
export const attributes = [
    { name: 'typeDiff', label: 'Type', type: 'select', options: ['A', 'C', 'AC'] },
    { name: 'intensite', label: 'Intensité (A)', type: 'number' },
    { name: 'sensibilite', label: 'Sensibilité (mA)', type: 'number', placeholder: 'e.g., 30, 300, 500' },
    { name: 'nom', label: 'Nom', type: 'text' }
];

export function renderSVG(svg, module) {
    fetch('modules/differentiel.svg')
        .then(response => response.text())
        .then(svgContent => {
            svg.innerHTML = svgContent
                .replace('{intensite}', module.intensite)
                .replace('{sensibilite}', module.sensibilite)
                .replace('{typeValue}', module.typeValue)
                .replace('{nom}', module.nom);
        })
        .catch(error => console.error('Error loading SVG:', error));

    return svg;
}

