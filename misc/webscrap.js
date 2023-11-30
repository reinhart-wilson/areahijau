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

        if (kelurahansUl) {
            for (let kelurahanLi of kelurahansUl.children) {
                const namaKelurahan = kelurahanLi.innerText;
                let isDesa = 0;
                if (kelurahanType.toLowerCase() === 'desa') isDesa = 1;
                const kelScriptRow = `(\'${namaKelurahan.toUpperCase()}\', ${isDesa}, ${idKecamatan}),`;
                kelScript += kelScriptRow;
            }
        } else {
            const namaKelurahan = kelurahansTd.firstElementChild.innerText;
            let isDesa = 0;
            if (kelurahanType.toLowerCase() === 'desa') isDesa = 1;
            const kelScriptRow = `(\'${namaKelurahan.toUpperCase()}\', ${isDesa}, ${idKecamatan}),`;
            kelScript += kelScriptRow;
        }
    }

    return {'script':[kecScript.slice(0, -1) + ";", kelScript.slice(0, -1) + ";"],
        'lastIdKecamatan': idKecamatan}
}

// Buat daftar Kota/Kab
const cityList = document.getElementById('mw-panel-toc-list')
const listKotaKabupaten = []
for (const cityLi of cityList.children) {
    const myString = cityLi.innerText
    const isDaerahAdmin = (myString.includes('Kabupaten') || myString.includes('Kota')) ? true : false;
    if (isDaerahAdmin) listKotaKabupaten.push(myString);
}
const listKotaUnderscore = listKotaKabupaten.map(item => item.replace(/ /g, '_'));

// Generate script kec kel
let currIdKota = 1;
let currIdKec = 0;
const scriptsKecKel = []
for (let strKotaUnderscore of listKotaUnderscore) {
    const scrapRes = scrapKecKel(currIdKota, strKotaUnderscore, currIdKec);
    const script = scrapRes['script'];
    scriptsKecKel.push(script.join(''))
    currIdKota ++;
    currIdKec = scrapRes['lastIdKecamatan'];
}


// Generate script kab kota
currIdKota = 1;
let scriptsKota = "INSERT INTO kota (idKota, namaKota, isKabupaten, idProvinsi) VALUES ";
for (let strKota of listKotaKabupaten){
    const namaKota = strKota.replace(/^(Kota |Kabupaten )/i, '');
    let isKabupaten = strKota.includes('Kabupaten') ? 1 : 0;  
    const kotaScriptRow = `(${currIdKota},\'${namaKota.toUpperCase()}\', ${isKabupaten}, 1),`;
    scriptsKota += kotaScriptRow;
    currIdKota ++;
}