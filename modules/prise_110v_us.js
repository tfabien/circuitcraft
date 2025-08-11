// modules/prise_110v_us.js
export const id = 'prise_110v_us';
export const attributes = [
    { name: 'nom', label: 'Nom', type: 'text' }
];

export function renderSVG(svg, module) {
    fetch('modules/prise_110v_us.svg')
        .then(response => response.text())
        .then(svgContent => {
            svg.innerHTML = svgContent
                .replace('{nom}', module.nom);
        })
        .catch(error => console.error('Error loading SVG:', error));

    return svg;
}