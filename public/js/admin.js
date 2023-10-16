import utils from './utils.js';

// ============================================================================
// DOM

// Kotak Upload
const formUpload = document.getElementById('form-search');
const selectKelurahan = document.getElementById('select-kelurahan');
const selectKecamatan = document.getElementById('select-kecamatan');
const selectProvinsi = document.getElementById('select-provinsi');
const selectKota = document.getElementById('select-kota');
const btnUpload = formUpload.querySelector('input[type="submit"]');
const inputFile = document.getElementById('input-file');
const containerFilePath = document.getElementById('container-file-path');


// ============================================================================
// Variabel lain-lain

// Elemen input tahun
const inputYear = document.createElement('input');
inputYear.type = 'number';
inputYear.name = 'tahunFiles[]';
inputYear.min = 1900;
inputYear.max = 2099;
inputYear.placeholder = "-- tahun --";

// ============================================================================
// Fungsi-fungsi

/**
 * Fungsi yang di-trigger ketika kursor lepas fokus dari input angka tahun.
 * Berfungsi mengubah nilai input jadi nilai batas jika input user kurang dari 
 * batas bawah atau lebih dari batas atas.
 * @param {Event} event 
 */
const onInputYearBlur = (event) => {
  let inputVal = event.target.value;
  let maxVal = event.target.max;
  let minVal = event.target.min;
  if (inputVal.length > 0) {
    if (inputVal > maxVal) {
      event.target.value = maxVal;
    }
    else if (inputVal < minVal) {
      event.target.value = minVal;
    }
  }
}

// =============================================================================
const displayFiles = () => {
  const files = inputFile.files;
  utils.removeAllChildren(containerFilePath)

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      
      // Kontainer dari 1 baris nama file + input tahun.
      const divFileRow = document.createElement('div')
      divFileRow.classList.add('file-row')

      // Get file name + buat span yang berisi nama file untuk preview.
      const file = files[i];
      const spanFileName = document.createElement('span');
      spanFileName.textContent = `Nama File ${i + 1}: ${file.name}`;
      divFileRow.appendChild(spanFileName);

      // Label tahun
      const spanFileYear = document.createElement('span');
      spanFileYear.textContent = "Tahun: ";
      divFileRow.appendChild(spanFileYear);

      // Input tahun
      const inputYearCopy = inputYear.cloneNode(true);
      inputYearCopy.addEventListener('blur', (event) => onInputYearBlur(event));
      let fileYear = utils.extractYear(file.name);
      if (fileYear){
        inputYearCopy.value = fileYear;
      }
      divFileRow.appendChild(inputYearCopy);

      containerFilePath.appendChild(divFileRow);
    }
  } else {
  }
}

// ============================================================================


selectProvinsi.addEventListener('change', async (event) => {
  selectKecamatan.disabled = true;
  selectKota.disabled = true;
  selectKelurahan.disabled = true;
  btnUpload.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get kota tersedia
  const url = utils.URL_AJAX_KOTA + selectedId;
  const data = await utils.requestJson(url);

  // Ganti opsi kota
  utils.fillSelectFromObjectArray(selectKota, data, 'idKota', 'namaKota');

  // Enable opsi
  selectKota.disabled = false;
})

// Event listener select kota
selectKota.addEventListener('change', async (event) => {
  selectKecamatan.disabled = true;
  selectKelurahan.disabled = true;
  btnUpload.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get kecamatan tersedia
  const url = utils.URL_AJAX_KECAMATAN + selectedId;
  const data = await utils.requestJson(url);

  // Ganti opsi kecamatan
  utils.fillSelectFromObjectArray(selectKecamatan, data, "idKecamatan", "namaKecamatan");
  selectKecamatan.disabled = false;
})

// Event listener select kecamatan
selectKecamatan.addEventListener('change', async (event) => {
  selectKelurahan.disabled = true;
  btnUpload.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get kelurahan tersedia
  const url = utils.URL_AJAX_KELURAHAN + selectedId;
  const data = await utils.requestJson(url);

  // Ganti opsi kelurahan
  utils.fillSelectFromObjectArray(selectKelurahan, data, "idKelurahan", "namaKelurahan");
  selectKelurahan.disabled = false;
})

selectKelurahan.addEventListener('change', (event) => {
  btnUpload.disabled = false;
})

inputFile.addEventListener('input', (event) => {
  displayFiles();
})

formUpload.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formUpload = document.getElementById('form-search');
  const data = new FormData(formUpload);

  console.log(await utils.sendToServer(data, formUpload.action));
});


(() => {

})()