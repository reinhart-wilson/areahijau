const utils = (function () {
    const URL_AJAX_KELURAHAN = "ajaxKelurahan?idKecamatan=";
    const URL_AJAX_KECAMATAN = "ajaxKecamatan?idKota=";
    const URL_AJAX_KOTA = "ajaxKota?idProvinsi=";
    const URL_AJAX_TAHUN = "ajaxTahun?idKelurahan="

    /**
     * 
     * @param {HTMLElement} element 
     */
    function removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    /**
     * 
     * @param {HTMLElement} selectElement 
     * @param {Array} data 
     */
    function fillSelectFromObjectArray(selectElement, data, valueKey, textKey) {

        // Clone opsi placeholder
        const defSelect = selectElement.firstElementChild.cloneNode(true); // opsi default

        removeAllChildren(selectElement);

        selectElement.appendChild(defSelect); // Opsi default

        data.forEach(item => {
            // Buat elemen option
            const option = document.createElement('option');

            // Set innertext dan value dari option
            option.textContent = item[textKey];
            option.value = item[valueKey];

            // Tambahkan option ke elemen select
            selectElement.appendChild(option);
        });
    }


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

    // Object dengan fungsi dan atribut statis
    return {
        URL_AJAX_KOTA: URL_AJAX_KOTA,
        URL_AJAX_KECAMATAN: URL_AJAX_KECAMATAN,
        URL_AJAX_KELURAHAN: URL_AJAX_KELURAHAN,
        URL_AJAX_TAHUN,

        fillSelectFromObjectArray,
        requestJson,
        removeAllChildren
    };
})();

export default utils;