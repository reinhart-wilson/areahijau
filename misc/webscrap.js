const scrapKecKel = (idKabupaten, namaKabupaten, lastIdKecamatan) => {
    const cityTitleId = namaKabupaten;
    let kelScript = "INSERT INTO kelurahan (namaKelurahan, isDesa, idKecamatan) VALUES ";
    let kecScript = "INSERT INTO kecamatan (idKecamatan, namaKecamatan, idKota) VALUES ";

    const titleEle = document.getElementById(cityTitleId);
    const titlePar = titleEle.parentNode;
    let nextEle = titlePar.nextElementSibling;
    while (!nextEle.classList.contains('wikitable')) {
        nextEle = nextEle.nextElementSibling;
    }
    const kabupatenTbody = nextEle.querySelector('tbody');

    let idKecamatan = lastIdKecamatan;

    const kecamatanTrs = kabupatenTbody.querySelectorAll('tr');
    for (let tr of kecamatanTrs) {
        const kelurahansTd = tr.lastElementChild;
        const kelurahansUl = kelurahansTd.querySelector('ul');
        const kelurahanType = kelurahansTd.previousElementSibling.innerText;

        if (tr.children.length > 2) {
            idKecamatan = idKecamatan + 1;
            const kecamatanTd = tr.children[1];
            const namaKecamatan = kecamatanTd.firstElementChild.innerText;
            const kecScriptRow = `(${idKecamatan}, \'${namaKecamatan.toUpperCase()}\', ${idKabupaten}),`;
            kecScript += kecScriptRow;
        } 

        for (let kelurahanLi of kelurahansUl.children) {
            const namaKelurahan = kelurahanLi.innerText;
            let isDesa = 0;
            if (kelurahanType.toLowerCase() === 'desa') isDesa = 1;
            const kelScriptRow = `(\'${namaKelurahan.toUpperCase()}\', ${isDesa}, ${idKecamatan}),`;
            kelScript += kelScriptRow;
        }
    }

    return [kecScript.slice(0,-1)+";", kelScript.slice(0,-1)+";"]
}