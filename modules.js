// modules.js
import { id as differentielId, renderSVG as renderDifferentiel, attributes as differentielAttributes } from './modules/differentiel.js';
import { id as disjoncteurId, renderSVG as renderDisjoncteur, attributes as disjoncteurAttributes } from './modules/disjoncteur.js';
import { id as prise220vEUId, renderSVG as renderPrise220vEU, attributes as prise220vEUAttributes } from './modules/prise_220v_eu.js';
import { id as prise110vUSId, renderSVG as renderPrise110vUS, attributes as prise110vUSAttributes } from './modules/prise_110v_us.js';

export const moduleTypes = [
    { id: differentielId, renderSVG: renderDifferentiel, attributes: differentielAttributes },
    { id: disjoncteurId, renderSVG: renderDisjoncteur, attributes: disjoncteurAttributes },
    { id: prise220vEUId, renderSVG: renderPrise220vEU, attributes: prise220vEUAttributes },
    { id: prise110vUSId, renderSVG: renderPrise110vUS, attributes: prise110vUSAttributes }
];