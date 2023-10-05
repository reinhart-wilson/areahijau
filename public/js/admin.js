const AJAX_KELURAHAN_URL = "ajaxKelurahan"
const AJAX_KECAMATAN_URL = "ajaxKecamatan"
const AJAX_KOTA_URL = "ajaxKota"
const AJAX_PROVINSI_URL = "ajaxProvinsi"

// ============================================================================

/**
 * Menambahkan query string ke URL
 * 
 * @param {string} baseUrl 
 * @param {object} queryStrDict 
 * @returns {string} formatted url
 */
const formatUrl = (baseUrl, queryStrDict) => {
    let mutableBaseUrl = baseUrl;
    if (queryStrDict) {
        mutableBaseUrl += "?"
        for (const [key, value] of queryStrDict.entries(object)) {
            const appendedStr = `&${key}=${value}`;
            mutableBaseUrl += appendedStr;
        }
    }
    return mutableBaseUrl
}

/**
 * 
 * @param {string} url
 * @returns {object}
 */
async function requestJson(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

// ============================================================================

