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
     * 
     * @param {HTMLElement} selectElement 
     * @param {Array} data 
     */
    function fillSelectKota(selectElement, data, valueKey, textKey) {

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

            if (item['isKabupaten'] === 1){
                option.textContent += " KABUPATEN"
            }

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


    function extractYear(inputString) {
        const yearRegex = /(?:20|19)\d{2}/;
        const match = inputString.match(yearRegex);
        
        return match ? match[0] : null;
    }

    const sendToServer = async (data, path, contentType) => {
        const options = {
            method: "post",
            body: data,
        };
    
        if (contentType != null) {
            options["headers"] = {
                "Content-Type": contentType,
            };
        }
    
        const response = await fetch(path, options);
        return response;
    };


    const emailIsValid = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
    
    const is8Chars = (st) => {
        if (st.length >= 8) {
            return true;
        }
        return false;
    }
    

    // Object dengan fungsi dan atribut statis
    return {
        URL_AJAX_KOTA: URL_AJAX_KOTA,
        URL_AJAX_KECAMATAN: URL_AJAX_KECAMATAN,
        URL_AJAX_KELURAHAN: URL_AJAX_KELURAHAN,
        URL_AJAX_TAHUN,

        fillSelectFromObjectArray,
        fillSelectKota,
        requestJson,
        removeAllChildren,
        extractYear,
        sendToServer,
        emailIsValid,
        is8Chars
    };
})();

export default utils;