import fs from 'fs';
import xss from 'xss';


/**
 * This function is use to remove html tags
 *
 * @param {string} str   String to sanitize
 * @return {string}  String converted
 */
function stripTags(str: string): string {
    // Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist
    return xss(str.toString().replace(/(<([^>]+)>)/gi, ''));
};

function inputValidation(input: string): string {
    const word = stripTags(input.toString());
    return word.trim();
};

function getAcronymKeys(acronyms: Array<any> | object): string[] {
    if (Array.isArray(acronyms)) {
        let keys: string[] = [];
        for (let i = 0; i < acronyms.length; i++) {
            const acronym = acronyms[i];
            Object.keys(acronym).forEach(key => keys.push(key.toLowerCase()));
        }

        return keys;
    }
    return Object.keys(acronyms);
}

function saveAcronyms(acronyms: Array<any>) {
    fs.writeFileSync('./acronyms.json', JSON.stringify(acronyms), 'utf8');
}

function removeAcronym(acronym: any): boolean {
    let removed = false;
    const acronymsDb: any[] = require('../../acronyms.json');
    for (let j = 0; j < acronymsDb.length; j++) {
        const element = acronymsDb[j];
        if (String(acronym).toLowerCase() === Object.keys(element)[0].toLowerCase()) {
            acronymsDb.splice(j);
            saveAcronyms(acronymsDb);
            removed = true;
            break;
        }
    }
    return removed;
}

function editAcronym(acronym: string, definition: string): boolean {
    let edited = false;
    const acronymsDb: any[] = require('../../acronyms.json');
    for (let j = 0; j < acronymsDb.length; j++) {
        const element = acronymsDb[j];
        if (String(acronym).toLowerCase() === Object.keys(element)[0].toLowerCase()) {
            element[acronym] = definition;
            acronymsDb[j] = element;
            saveAcronyms(acronymsDb);
            edited = true;
            break;
        }
    }
    return edited;
}

function filterAcronyms(from?: number, limit?: number, search?: string): any[] {
    let acronymsDb: any[] = require('../../acronyms.json');
    if (from && !isNaN(from)) {
        acronymsDb = acronymsDb.filter(function (v, i: number) {
            if (i >= Number(from)) {
                return true;
            }
            return false;
        });
    }

    if (limit && !isNaN(limit)) {
        acronymsDb = acronymsDb.filter(function (v: number, i: number) {
            if (i < limit) return true;
            return false;
        });
    }

    if (search && search !== 'undefined') {
        acronymsDb = acronymsDb.filter(function (v: number, i: number) {
            if (Object.values(acronymsDb[i]).every((str) => String(str).toLowerCase().includes(search.toLowerCase()))) return true;
            return false;
        })
    }
    return acronymsDb;
}
export { stripTags, inputValidation, getAcronymKeys, saveAcronyms, removeAcronym, editAcronym, filterAcronyms };