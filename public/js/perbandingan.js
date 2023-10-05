// ============================================================================
// DOM

// Kotak search
const formSearch = document.getElementById('form-search');
const selectTahun1 = document.getElementById('search-tahun-1');
const selectTahun2 = document.getElementById('search-tahun-2');
const selectKelurahan = document.getElementById('search-kelurahan');
const selectKecamatan = document.getElementById('search-kecamatan');
const selectProvinsi = document.getElementById('search-provinsi');
const selectKota = document.getElementById('search-kota');
const submitSearch = formSearch.querySelector('input[type="submit"]');

// Chart
const canvasChart = document.getElementById('canvas-chart')

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

const basicCanvas = document.getElementById('canvas-basic');
const tambahCanvas = document.getElementById('canvas-changes');
const kurangCanvas = document.getElementById('canvas-kurang');
const tahun1Canvas = document.getElementById('canvas-tahun1');
const tahun2Canvas = document.getElementById('canvas-tahun2');
canvases = [basicCanvas, tambahCanvas, kurangCanvas, tahun1Canvas, tahun2Canvas];

const basicContext = basicCanvas.getContext('2d');
const tambahContext = tambahCanvas.getContext('2d');
const kurangContext = kurangCanvas.getContext('2d');
const tahun1Context = tahun1Canvas.getContext('2d');
const tahun2Context = tahun2Canvas.getContext('2d');
contexts = [basicContext, tambahContext, kurangContext, tahun1Context, tahun2Context]



// ============================================================================
// Variabel lain-lain

// Option default dari elemen select tahun
const defYear = selectTahun1.firstElementChild.cloneNode(true);
const defChoice = selectTahun1.firstElementChild.cloneNode(true);
let choicesKelurahan = null;

// Warna piksel peta
let colorTambah= 'rgb(69, 224, 255)';
let colorKurang = "red";
let colorHijau = 'rgb(48, 117, 49)';
const colorKelurahan = "white";
const colorOuter = "black";

//
var squaredText = document.createElement('sup');
squaredText.innerText = 2;

var reportChart; // Akan diisi elemen canvas untuk grafik. Var digunakan agar bisa bisa dihapus ketika peta berganti
var tahuns; // Array berisi tahun-tahun yang tersedia untuk kelurahan saat ini. Dibuat global agar dapat dipakai untuk select, grafik, dan detail.


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
          text: "Perkembangan Area Hijau Kelurahan ".toUpperCase() +namaKelurahan,
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

    let totalBandVal = 0;
    const contextsToFill = []

    if (warna === 'g') {
      tahun1Context.fillStyle = colorHijau;
      tahun2Context.fillStyle = colorHijau;
      contextsToFill.push(tahun1Context);
      contextsToFill.push(tahun2Context);
    } else if (warna === 'w') {
      basicContext.fillStyle = colorKelurahan
      contextsToFill.push(basicContext);
    } else if (warna === 'b') {
      tambahContext.fillStyle = colorTambah;
      tahun2Context.fillStyle = colorHijau;
      contextsToFill.push(tambahContext);
      contextsToFill.push(tahun2Context);
    } else if (warna === 'r') {
      tahun1Context.fillStyle = colorHijau;
      kurangContext.fillStyle = colorKurang;
      contextsToFill.push(tahun1Context);
      contextsToFill.push(kurangContext);
      // perubahanLuas += 1;
    } else {
      basicContext.fillStyle = colorOuter;
      contextsToFill.push(basicContext);
    }


    // Isi luas
    // tbLuas.innerText = "" + (luasHijau * 10 * 10) + " m";
    // tbPerubahan.innerText = "" + (perubahanLuas * 10 * 10) + " m";
    // tbLuas.appendChild(squaredText.cloneNode(true));
    // tbPerubahan.appendChild(squaredText.cloneNode(true));
    for (let context of contextsToFill) {
      context.fillRect(x, y, 1, 1);
    }
  }

  // Tampilkan di kontainer
  for (let canvas of canvases) {
    canvas.style.height = 'auto';
    canvas.style.width = '100%';
    canvas.style.imageRendering = 'pixelated';
  }

  tahun2Canvas.classList.add('hidden');

  // Sembunyikan overlay
  overlay.classList.add('hidden');
}

// ============================================================================


document.addEventListener('DOMContentLoaded', async function () {
  //
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
    const url = `ajaxKota?idProvinsi=${selectedId}`;
    const response = await fetch(url);
    const kotas = await response.json();

    // Ganti opsi kota
    selectKota.innerHTML = ""; // Hapus semua opsi
    const defKota = defChoice.cloneNode(true);
    defKota.innerText = "-- Pilih Kota --";
    selectKota.appendChild(defKota); // Opsi default
    if (kotas.length) {
      for (let row of kotas) {
        const newOpt = document.createElement("option");
        newOpt.value = row.idKota;
        newOpt.innerText = row.namaKota;
        if (row.isKabupaten === 1) newOpt.innerText += " KABUPATEN"
        selectKota.appendChild(newOpt);
        selectKota.disabled = false;
      }
    }
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

    // AJAX get kota tersedia
    const url = `ajaxKecamatan?idKota=${selectedId}`;
    const response = await fetch(url);
    const data = await response.json();

    // Ganti opsi kota
    const defSelect = defChoice.cloneNode(true); // opsi default
    defSelect.innerText = "-- Pilih Kecamatan --";
    selectKecamatan.innerHTML = ""; // Hapus semua opsi
    selectKecamatan.appendChild(defSelect); // Opsi default
    if (data.length) {
      for (let row of data) {
        const newOpt = document.createElement("option");
        newOpt.value = row.idKecamatan;
        newOpt.innerText = row.namaKecamatan;
        selectKecamatan.appendChild(newOpt);
        selectKecamatan.disabled = false;
      }
    }
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

    // AJAX get kota tersedia
    const url = `ajaxKelurahan?idKecamatan=${selectedId}`;
    const response = await fetch(url);
    const data = await response.json();

    // Ganti opsi kota
    const defSelect = defChoice.cloneNode(true); // opsi default
    defSelect.innerText = "-- Pilih Kelurahan --";
    selectKelurahan.innerHTML = ""; // Hapus semua opsi
    selectKelurahan.appendChild(defSelect); // Opsi default
    if (data.length) {
      for (let row of data) {
        const newOpt = document.createElement("option");
        newOpt.value = row.idKelurahan;
        newOpt.innerText = row.namaKelurahan;
        selectKelurahan.appendChild(newOpt);
        selectKelurahan.disabled = false;
      }
    }
  })

  // Tambahkan event listener ke dropdown kelurahan
  selectKelurahan.addEventListener('change', async (event) => {
    submitSearch.disabled = true;
    selectTahun1.disabled = true;
    selectTahun2.disabled = true;

    const selectedChoice = event.target;
    const selectedId = selectedChoice.value;

    // AJAX get tahun-tahun tersedia
    const url = `ajaxTahun?idKelurahan=${selectedId}`;
    const response = await fetch(url);
    tahuns = await response.json();

    // Ganti opsi tahun
    selectTahun1.innerHTML = ""; // Hapus semua opsi
    selectTahun2.innerHTML = "";
    selectTahun1.appendChild(defYear.cloneNode(true)); // Opsi default
    selectTahun2.appendChild(defYear.cloneNode(true));
    if (tahuns.length) {
      for (let year of tahuns) {
        const newOpt = document.createElement("option");
        newOpt.value = year;
        newOpt.innerText = year;
        selectTahun1.appendChild(newOpt);
        selectTahun2.appendChild(newOpt.cloneNode(true));
      }
    } else {
      submitSearch.disabled = true;
    }

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

  // Warna kotak legenda
  const legendTambah = document.getElementById("legend-tambah");
  const legendKurang = document.getElementById("legend-kurang");
  const legendHijau = document.getElementById("legend-hijau");
  legendTambah.style.backgroundColor = colorTambah;
  legendKurang.style.backgroundColor = colorKurang;
  legendHijau.style.backgroundColor = colorHijau;

});

// ============================================================================


formSearch.addEventListener('submit', async function (event) {
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
  generateGraph(selectedText, canvasChart, luases, tahuns)

  let luas1 = luases[tahuns.indexOf(parseInt(tahun1))];
  let luas2 = luases[tahuns.indexOf(parseInt(tahun2))];
  tbLuas.innerText = luas1 + ' m';
  tbLuas2.innerText = luas2 + ' m';
  tbPerubahan.innerText = -1 * (parseInt(luas1) - parseInt(luas2)) + ' m';
  tbLuas.appendChild(squared.cloneNode(true));
  tbLuas2.appendChild(squared.cloneNode(true));
  tbPerubahan.appendChild(squared.cloneNode(true));

  //
  for (let elem of spansTahun1){
    elem.innerText = tahun1;
  }

  for (let elem of spansTahun2){
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
