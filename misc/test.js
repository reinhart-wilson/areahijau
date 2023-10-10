/**
 * Mengambil data namaKota dan isKabupaten dari DB berdasarkan id yang 
 * diberikan.
 * 
 * @param {Number} idKota
 * @returns array of objects
 */
getKota = async (idKota) => {
    const queryStr = 'CALL sp_getKota(?);'
    try {
        const res = await this.execQuery(queryStr, [idKota]);
        return res[0]
    } catch (error) {
        console.error(error);
        throw error;
    };
}