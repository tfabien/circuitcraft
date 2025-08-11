// modules/prise_220v_eu.js
export const id = 'prise_220v_eu';
export const attributes = [
    { name: 'nom', label: 'Nom', type: 'text' }
];

export function renderSVG(svg, module) {
    fetch('modules/prise_220v_eu.svg')
        .then(response => response.text())
        .then(svgContent => {
            svg.innerHTML = svgContent
                .replace('{nom}', module.nom);
        })
        .catch(error => console.error('Error loading SVG:', error));

    return svg;
}