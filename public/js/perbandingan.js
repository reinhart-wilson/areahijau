import utils from './utils.js';

// ============================================================================
// DOM

// Kotak search
const formSearch = document.getElementById('form-search');
const selectTahun1 = document.getElementById('select-tahun-1');
const selectTahun2 = document.getElementById('select-tahun-2');
const selectKelurahan = document.getElementById('select-kelurahan');
const selectKecamatan = document.getElementById('select-kecamatan');
const selectProvinsi = document.getElementById('select-provinsi');
const selectKota = document.getElementById('select-kota');
const submitSearch = formSearch.querySelector('input[type="submit"]');
// Option default dari elemen select tahun
const defYear = selectTahun1.firstElementChild.cloneNode(true);
const defChoice = selectTahun1.firstElementChild.cloneNode(true);
let choicesKelurahan = null;

// Chart
const canvasChart = document.createElement('canvas')
canvasChart.setAttribute('id', 'canvas-chart')
const containerChart = document.getElementById('container-chart')
const divChartPlaceholder = containerChart.getElementsByClassName('placeholder')[0];

// Kotak detail
const tbKelurahan = document.getElementById('detail-kelurahan')
const tbLuas = document.getElementById('detail-luas1')
const tbLuas2 = document.getElementById('detail-luas2')
const tbPerubahan = document.getElementById('detail-perubahan')

// Misc
const overlay = document.getElementById('overlay')
const squared = document.createElement('span');
squared.innerHTML = "2";
squared.classList.add('superscript')
const spansTahun1 = document.getElementsByClassName('span-tahun1')
const spansTahun2 = document.getElementsByClassName('span-tahun2')

// ============================================================================
// DOM kotak peta

const containerMap = document.getElementById('container-map');
const radioTahun1 = document.getElementById('radio-tahun1');
const radioTahun2 = document.getElementById('radio-tahun2');
const radioTahunNone = document.getElementById('radio-tahunnone');
const radioPos = document.getElementById('radio-pos');
const radioNeg = document.getElementById('radio-neg');

// Canvas-canvas
var canvases;
var contexts;

const basicCanvas = document.createElement('canvas');
basicCanvas.setAttribute('id', 'canvas-basic');
const tambahCanvas = document.createElement('canvas');
tambahCanvas.setAttribute('id', 'canvas-changes')
const kurangCanvas = document.createElement('canvas');
kurangCanvas.setAttribute('id', 'canvas-kurang')
const tahun1Canvas = document.createElement('canvas');
tahun1Canvas.setAttribute('id', 'canvas-tahun1')
const tahun2Canvas = document.createElement('canvas');
tahun2Canvas.setAttribute('id', 'canvas-tahun2')
canvases = [basicCanvas, tambahCanvas, kurangCanvas, tahun1Canvas, tahun2Canvas];
for (let canvas of canvases) {
  canvas.classList.add('map')
}

const basicContext = basicCanvas.getContext('2d');
const tambahContext = tambahCanvas.getContext('2d');
const kurangContext = kurangCanvas.getContext('2d');
const tahun1Context = tahun1Canvas.getContext('2d');
const tahun2Context = tahun2Canvas.getContext('2d');
contexts = [basicContext, tambahContext, kurangContext, tahun1Context, tahun2Context]

const containerZoom = document.getElementById('container-zoom-map')
const divMapPlaceholder = containerZoom.getElementsByClassName('placeholder')[0];

// ============================================================================
// Variabel lain-lain

// Warna piksel peta
let colorTambah = 'rgb(69, 224, 255)';
let colorKurang = "red";
let colorHijau = 'rgb(48, 117, 49)';
const colorKelurahan = "white";
const colorOuter = "black";

//
var squaredText = document.createElement('sup');
squaredText.innerText = 2;

var reportChart; // Akan diisi elemen canvas untuk grafik. Var digunakan agar bisa bisa dihapus ketika peta berganti
var tahuns; // Array berisi tahun-tahun yang tersedia untuk kelurahan saat ini. Dibuat global agar dapat dipakai untuk select, grafik, dan detail.

let canvasIsAdded = false

// ============================================================================
// Fungsi-fungsi

// Memeriksa apakah value adalah tahun
function isYear(value) {
  if ((typeof value === 'number' || typeof value === 'string') && parseInt(value) > 0) {
    if (value.toString().length === 4) {
      return true;
    }
  }
  return false;
}

const toggleVisibility = (element) => {
  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
    return;
  }
  element.classList.add('hidden');
}

// Fungsi untuk menggambar grafik pada canvas
const generateGraph = (namaKelurahan, canvas, data, label) => {
  if (reportChart != null) {
    reportChart.destroy();
  }

  const config = {
    type: "line",
    data: {
      labels: label,
      datasets: [
        {
          data: data,
          backgroundColor: "indianRed",
          borderColor: "coral",
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Tahun",
            color: "#292929",
            font: {
              size: 18,
            },
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Luas Area Hijau (m^2)",
            color: "#292929",
            font: {
              size: 18,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Perkembangan Area Hijau Kelurahan ".toUpperCase() + namaKelurahan,
          color: "#CD5C5C",
          font: {
            size: 24,
          },
        },
      },
    },
  };
  reportChart = new Chart(canvas.getContext("2d"), config);
}

// Fungsi untuk menggambar peta pada canvas
const generateMap = (csvData) => {
  divMapPlaceholder.style.display = 'none'
  if (!canvasIsAdded) {
    for (let canvas of canvases) {
      containerMap.appendChild(canvas);
    }
    canvasIsAdded = true;
    tahun2Canvas.classList.add('hidden');
  }


  // Tentukan koordinat maksimal untuk ukuran canvas dan buat canvas kosong
  const lastRow = csvData.data[csvData.data.length - 1];
  for (let canvas of canvases) {
    canvas.width = lastRow['x'];
    canvas.height = lastRow['y'];
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  for (const csvRow of csvData.data) {
    let x = csvRow.x;
    let y = csvRow.y;
    const warna = csvRow.warna

    const contextsToFill = []

    if (warna === 'g') {
      tahun1Context.fillStyle = colorHijau;
      tahun2Context.fillStyle = colorHijau;
      basicContext.fillStyle = colorKelurahan
      contextsToFill.push(basicContext);
      contextsToFill.push(tahun1Context);
      contextsToFill.push(tahun2Context);
    } else if (warna === 'w') {
      basicContext.fillStyle = colorKelurahan
      contextsToFill.push(basicContext);
    } else if (warna === 'b') {
      tambahContext.fillStyle = colorTambah;
      tahun2Context.fillStyle = colorHijau;
      basicContext.fillStyle = colorKelurahan
      contextsToFill.push(basicContext);
      contextsToFill.push(tambahContext);
      contextsToFill.push(tahun2Context);
    } else if (warna === 'r') {
      tahun1Context.fillStyle = colorHijau;
      kurangContext.fillStyle = colorKurang;
      basicContext.fillStyle = colorKelurahan
      contextsToFill.push(basicContext);
      contextsToFill.push(tahun1Context);
      contextsToFill.push(kurangContext);
      // perubahanLuas += 1;
    } else {
      basicContext.fillStyle = colorOuter;
      contextsToFill.push(basicContext);
    }

    for (let context of contextsToFill) {
      context.fillRect(x, y, 1, 1);
    }
  }

  // Tampilkan di kontainer
  for (let canvas of canvases) {
    const canvasHeight = lastRow['y'];
    const canvasWidth = lastRow['x'];
    console.log(canvasHeight, canvasWidth)
    if (canvasHeight > canvasWidth) {      
      canvas.style.height = '100%';
      canvas.style.width = 'auto';
    } else {
      canvas.style.height = 'auto';
      canvas.style.width = '100%';
    }
    canvas.style.imageRendering = 'pixelated';
  }

  // Sembunyikan overlay
  overlay.classList.add('hidden');
}

// ============================================================================


document.addEventListener('DOMContentLoaded', async function () {

  // Warna kotak legenda
  const legendTambah = document.getElementById("legend-tambah");
  const legendKurang = document.getElementById("legend-kurang");
  const legendHijau = document.getElementById("legend-hijau");
  legendTambah.style.backgroundColor = colorTambah;
  legendKurang.style.backgroundColor = colorKurang;
  legendHijau.style.backgroundColor = colorHijau;

});

// ============================================================================

selectProvinsi.addEventListener('change', async (event) => {
  submitSearch.disabled = true;
  selectKecamatan.disabled = true;
  selectKota.disabled = true;
  selectKelurahan.disabled = true;
  selectTahun1.disabled = true;
  selectTahun2.disabled = true;
  submitSearch.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get kota tersedia
  const url = utils.URL_AJAX_KOTA + selectedId;
  const data = await utils.requestJson(url);

  // Ganti opsi kota
  utils.fillSelectKota(selectKota, data, 'idKota', 'namaKota');

  // Enable opsi
  selectKota.disabled = false;
})

// Event listener select kota
selectKota.addEventListener('change', async (event) => {
  submitSearch.disabled = true;
  selectKecamatan.disabled = true;
  selectKelurahan.disabled = true;
  selectTahun1.disabled = true;
  selectTahun2.disabled = true;
  submitSearch.disabled = true;

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
  submitSearch.disabled = true;
  selectKelurahan.disabled = true;
  selectTahun1.disabled = true;
  selectTahun2.disabled = true;
  submitSearch.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get kelurahan tersedia
  const url = utils.URL_AJAX_KELURAHAN + selectedId;
  const data = await utils.requestJson(url);

  // Ganti opsi kelurahan
  utils.fillSelectFromObjectArray(selectKelurahan, data, "idKelurahan", "namaKelurahan");
  selectKelurahan.disabled = false;
})

// Tambahkan event listener ke dropdown kelurahan
selectKelurahan.addEventListener('change', async (event) => {
  submitSearch.disabled = true;
  selectTahun1.disabled = true;
  selectTahun2.disabled = true;

  const selectedChoice = event.target;
  const selectedId = selectedChoice.value;

  // AJAX get tahun-tahun tersedia
  const url = utils.URL_AJAX_TAHUN + selectedId;
  const data = await utils.requestJson(url);
  tahuns = data.map(obj => Object.values(obj)[0]);

  // Ganti opsi tahun
  utils.fillSelectFromObjectArray(selectTahun1, data, "tahun", "tahun")
  utils.fillSelectFromObjectArray(selectTahun2, data, "tahun", "tahun")

  // Enable dropdown tahun
  selectTahun1.disabled = false;
  selectTahun2.disabled = false;
})

// Tambahkan event listener ke dropdown tahun
selectTahun1.addEventListener('change', function (event) {
  if (isYear(selectTahun1.value) & isYear(selectTahun2.value))
    submitSearch.disabled = false;
  else submitSearch.disabled = true;
});
selectTahun2.addEventListener('change', function (event) {
  if (isYear(selectTahun1.value) & isYear(selectTahun2.value))
    submitSearch.disabled = false;
  else submitSearch.disabled = true;
});

formSearch.addEventListener('submit', async function (event) {

  submitSearch.blur();
  event.preventDefault();

  // Ambil data dari form
  const idKelurahan = selectKelurahan.value;
  const tahun1 = selectTahun1.value;
  const tahun2 = selectTahun2.value;
  const url = `ajaxMap?idKelurahan=${idKelurahan}&tahun1=${tahun1}&tahun2=${tahun2}`;

  // AJAX ambil data gambar
  overlay.classList.remove('hidden'); // tampilkan overlay untuk memberi tahu data sedang di-load
  const response = await fetch(url);
  const csvData = await response.text();
  const results = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      generateMap(results);
    }
  });
  if (canvasIsAdded) resetTransform(); //reset posisi zoom peta

  // Request luas ke server  
  const selectedId = selectKelurahan.value;
  const urlLuas = `ajaxLuas?idKelurahan=${selectedId}`;
  const responseLuas = await fetch(urlLuas);
  const luases = await responseLuas.json();

  // Isi informasi di kotak detail
  const selectedIndex = selectKelurahan.selectedIndex;
  const selectedOption = selectKelurahan.options[selectedIndex];
  const selectedText = selectedOption.text;
  tbKelurahan.innerText = selectedText;

  // Buat grafik
  if (!reportChart) {
    divChartPlaceholder.style.display = 'none'
    containerChart.appendChild(canvasChart);
  }
  generateGraph(selectedText, canvasChart, luases, tahuns)

  let luas1 = luases[tahuns.indexOf(parseInt(tahun1))];
  let luas2 = luases[tahuns.indexOf(parseInt(tahun2))];
  tbLuas.innerText = luas1.toLocaleString() + ' m';
  tbLuas2.innerText = luas2.toLocaleString()+ ' m';

  let luasPerubahan = -1 * (parseInt(luas1) - parseInt(luas2));
  tbPerubahan.innerText = luasPerubahan.toLocaleString() + ' m';
  tbLuas.appendChild(squared.cloneNode(true));
  tbLuas2.appendChild(squared.cloneNode(true));
  tbPerubahan.appendChild(squared.cloneNode(true));
  console.log(Number(luasPerubahan) >= 0)
  if (Number(luasPerubahan) >= 0) {
    tbPerubahan.style.color = colorHijau;
  } else {
    tbPerubahan.style.color = colorKurang;
  }

  //
  for (let elem of spansTahun1) {
    elem.innerText = tahun1;
  }

  for (let elem of spansTahun2) {
    elem.innerText = tahun2;
  }
});

// ============================================================================

radioTahun1.addEventListener('input', (event) => {
  tahun2Canvas.classList.add('hidden');
  tahun1Canvas.classList.remove('hidden');
})

radioTahun2.addEventListener('input', (event) => {
  tahun2Canvas.classList.remove('hidden');
  tahun1Canvas.classList.add('hidden');
})

radioTahunNone.addEventListener('input', (event) => {
  tahun2Canvas.classList.add('hidden');
  tahun1Canvas.classList.add('hidden');
})

radioPos.addEventListener('input', (event) => {
  toggleVisibility(tambahCanvas)
})

radioNeg.addEventListener('input', (event) => {
  toggleVisibility(kurangCanvas)
})

var scale = 1,
  panning = false,
  pointX = 0,
  pointY = 0,
  start = { x: 0, y: 0 },
  zoom = document.getElementById("container-map");

function setTransform() {
  zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
  e.preventDefault();
  start = { x: e.clientX - pointX, y: e.clientY - pointY };
  panning = true;
}

zoom.onmouseup = function (e) {
  panning = false;
}

zoom.onmousemove = function (e) {
  e.preventDefault();
  if (!panning) {
    return;
  }
  pointX = (e.clientX - start.x);
  pointY = (e.clientY - start.y);
  setTransform();
}

const minScale = 0.5;
const maxScale = 3;

zoom.onwheel = function (e) {
  e.preventDefault();
  var xs = (e.clientX - pointX) / scale,
    ys = (e.clientY - pointY) / scale,
    delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

  if (delta > 0) {
    scale *= 1.2;
  } else {
    scale /= 1.2;
  }

  scale = Math.max(scale, minScale);
  scale = Math.min(scale, maxScale);

  pointX = e.clientX - xs * scale;
  pointY = e.clientY - ys * scale;

  setTransform();
}

function resetTransform() {
  scale = 1;
  pointX = 0;
  pointY = 0;
  setTransform();
}
