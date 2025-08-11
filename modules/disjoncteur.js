// modules/disjoncteur.js
export const id = 'disjoncteur';
export const attributes = [
    { name: 'intensite', label: 'Intensité (A)', type: 'number' },
    { name: 'icone', label: 'Icône', type: 'text' },
    { name: 'nom', label: 'Nom', type: 'text' }
];

export function renderSVG(svg, module) {
    fetch('modules/disjoncteur.svg')
        .then(response => response.text())
        .then(svgContent => {
            svg.innerHTML = svgContent
                .replace('{nom}', module.nom)
                .replace('{intensite}', module.intensite);
        })
        .catch(error => console.error('Error loading SVG:', error));

    return svg;
}