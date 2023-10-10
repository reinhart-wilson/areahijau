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
//

// ============================================================================

const displayFiles = () => {
  const files = inputFile.files;
  utils.removeAllChildren(containerFilePath)

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const p = document.createElement('p');
      p.textContent = `File ${i + 1}: ${file.name}`;

      containerFilePath.appendChild(p);
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
  formUpload.submit();
});


(() => {

})()