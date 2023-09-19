const selectKelurahan = document.getElementById('search-kelurahan');
const formSearch = document.getElementById('form-search');
const containerMap = document.getElementById('container-map');
const selectTahun1 = document.getElementById('search-tahun-1');
const selectTahun2 = document.getElementById('search-tahun-2');
const submitSearch = formSearch.querySelector('input[type="submit"]');
const overlay = document.getElementById('overlay')
const canvasChart = document.getElementById('canvas-chart')

const defYear = selectTahun1.firstElementChild.cloneNode(true);
let choicesKelurahan = null;
var reportChart;

// Memeriksa apakah value adalah tahun
function isYear(value) {
  if ((typeof value === 'number' || typeof value === 'string') && parseInt(value) > 0) {
    if (value.toString().length === 4) {
      return true;
    }
  }
  return false;
}

// Fungsi untuk menggambar grafik pada canvas
const generateGraph = (canvas, data, label) => {
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
          text: "Area Hijau",
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
  const canvas = document.createElement('canvas');

  const context = canvas.getContext('2d');

  // Tentukan koordinat maksimal untuk ukuran canvas
  const lastRow = csvData.data[csvData.data.length - 1];
  canvas.width = lastRow['x'];
  canvas.height = lastRow['y'];

  let greenPixel = 0; // Jumlah piksel hijau untuk menghitung luas area ijau
  let greenPixelChange = 0;

  for (const csvRow of csvData.data) {
    let x = csvRow.x;
    let y = csvRow.y;
    const warna = csvRow.warna

    let totalBandVal = 0;

    if (warna === 'g') {
      context.fillStyle = 'green';
      greenPixel += 1;
    } else if (warna === 'w') {
      context.fillStyle = 'white'
    } else if (warna === 'b') {
      context.fillStyle = 'green';
    } else if (warna === 'r') {
      context.fillStyle = 'red';
    } else {
      context.fillStyle = 'black';
    }

    context.fillRect(x, y, 1, 1);
  }

  // Tampilkan di kontainer
  containerMap.innerHTML = '';
  containerMap.appendChild(canvas);
  canvas.style.height = '100%';
  canvas.style.width = 'auto';
  canvas.style.imageRendering = 'pixelated';

  // Sembunyikan overlay
  overlay.classList.add('hidden');
}

// ============================================================================

document.addEventListener('DOMContentLoaded', async function () {
  // Generate dropdown kelurahan yang dapat di-search
  choicesKelurahan = new Choices(selectKelurahan, {
    allowHTML: false,
    searchChoices: true
  });

  // Tambahkan event listener ke dropdown kelurahan
  choicesKelurahan.passedElement.element.addEventListener('choice', async (event) => {
    submitSearch.disabled = true;
    selectTahun1.disabled = true;
    selectTahun2.disabled = true;

    const selectedChoice = event.detail.choice;
    const selectedId = selectedChoice.value;

    // AJAX get tahun-tahun tersedia
    const url = `ajaxTahun?idKelurahan=${selectedId}`;
    const response = await fetch(url);
    const tahuns = await response.json();

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

    // Request luas ke server
    const urlLuas = `ajaxLuas?idKelurahan=${selectedId}`;
    const responseLuas = await fetch(urlLuas);
    const luases = await responseLuas.json();

    // Buat grafik
    generateGraph(canvasChart, luases, tahuns)

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
});

// ============================================================================

formSearch.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Ambil data dari form
  const idKelurahan = choicesKelurahan.getValue(true);
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
});


