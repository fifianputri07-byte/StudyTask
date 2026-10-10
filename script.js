function mulai() {
    keDaftarTugas();
}

function tambahTugas() {
    let namaTugas = prompt("Masukkan nama tugas:");
    if (!namaTugas) return;

    let mataKuliah = prompt("Masukkan mata kuliah:");
    if (!mataKuliah) return;

    let deadline = document.getElementById("deadline").value;

    if (!deadline) {
        alert("Pilih deadline terlebih dahulu!");
        return;
    }

    buatKartuTugas({
        nama: namaTugas,
        mataKuliah: mataKuliah,
        deadline: deadline,
        selesai: false
    });

    urutkanTugas();
    simpanTugas();
    updateStatistik();
}

function buatKartuTugas(data) {
    let daftar = document.getElementById("daftarTugas");

    let tugas = document.createElement("div");
    tugas.className = "kartu-tugas";

    tugas.innerHTML =
        "<h3>📝 " + data.nama + "</h3>" +
        "<p>📚 Mata Kuliah: " + data.mataKuliah + "</p>" +
        "<p>📅 Deadline: " + data.deadline + "</p>" +
        '<button class="status-btn" onclick="ubahStatus(this)">' +
        (data.selesai ? "✅ Selesai" : "🟣 Belum selesai") +
        "</button>" +
        "<br><br>" +
        '<button onclick="editTugas(this)">✏️ Edit</button> ' +
        '<button onclick="hapusTugas(this)">🗑️ Hapus</button>';

    daftar.appendChild(tugas);
}

function ubahStatus(tombol) {
    if (tombol.textContent.includes("Belum selesai")) {
        tombol.textContent = "✅ Selesai";
    } else {
        tombol.textContent = "🟣 Belum selesai";
    }

    urutkanTugas();
    simpanTugas();
    updateStatistik();
}

function editTugas(tombol) {
    let kartu = tombol.parentElement;

    let namaBaru = prompt("Masukkan nama tugas baru:");
    if (!namaBaru) return;

    let mataKuliahBaru = prompt("Masukkan mata kuliah baru:");
    if (!mataKuliahBaru) return;

    let inputTanggal = document.createElement("input");
    inputTanggal.type = "date";

    inputTanggal.style.display = "block";
    inputTanggal.style.margin = "10px auto";

    kartu.appendChild(inputTanggal);

    inputTanggal.onchange = function () {
        if (inputTanggal.value) {
            kartu.querySelector("h3").textContent = "📝 " + namaBaru;

            kartu.querySelectorAll("p")[0].textContent =
                "📚 Mata Kuliah: " + mataKuliahBaru;

            kartu.querySelectorAll("p")[1].textContent =
                "📅 Deadline: " + inputTanggal.value;

            inputTanggal.remove();

            urutkanTugas();
            simpanTugas();
            updateStatistik();
        }
    };

    inputTanggal.focus();
}

function hapusTugas(tombol) {
    tombol.parentElement.remove();

    simpanTugas();
    updateStatistik();
}

function keBeranda() {
    document.getElementById("home").style.display = "block";
    document.getElementById("tasks").style.display = "none";
}

function keDaftarTugas() {
    document.getElementById("home").style.display = "none";
    document.getElementById("tasks").style.display = "block";
}

function updateStatistik() {
    let semuaTugas = document.querySelectorAll(".kartu-tugas");

    let total = semuaTugas.length;
    let belumSelesai = 0;
    let sudahSelesai = 0;

    semuaTugas.forEach(function(tugas) {
        let status = tugas.querySelector(".status-btn");

        if (status.textContent.includes("Selesai")) {
            sudahSelesai++;
        } else {
            belumSelesai++;
        }
    });

    document.querySelectorAll(".stat-card h2")[0].textContent = total;
    document.querySelectorAll(".stat-card h2")[1].textContent = belumSelesai;
    document.querySelectorAll(".stat-card h2")[2].textContent = sudahSelesai;
}

function simpanTugas() {
    let data = [];

    document.querySelectorAll(".kartu-tugas").forEach(function(tugas) {
        let status = tugas.querySelector(".status-btn");

        data.push({
            nama: tugas.querySelector("h3").textContent.replace("📝 ", ""),
            mataKuliah: tugas.querySelectorAll("p")[0].textContent.replace("📚 Mata Kuliah: ", ""),
            deadline: tugas.querySelectorAll("p")[1].textContent.replace("📅 Deadline: ", ""),
            selesai: status.textContent.includes("Selesai")
        });
    });

    localStorage.setItem("studyTaskData", JSON.stringify(data));
}

function muatTugas() {
    let data = JSON.parse(localStorage.getItem("studyTaskData")) || [];

    data.forEach(function(tugasData) {
        buatKartuTugas(tugasData);
    });

    urutkanTugas();
    updateStatistik();
}

function urutkanTugas() {
    let daftar = document.getElementById("daftarTugas");

    let tugas = Array.from(daftar.querySelectorAll(".kartu-tugas"));

    tugas.sort(function(a, b) {
        let selesaiA = a.querySelector(".status-btn").textContent.includes("Selesai");
        let selesaiB = b.querySelector(".status-btn").textContent.includes("Selesai");

        // Yang belum selesai selalu di atas
        if (selesaiA !== selesaiB) {
            return selesaiA ? 1 : -1;
        }

        // Kalau statusnya sama, deadline paling dekat di atas
        let deadlineA = a.querySelectorAll("p")[1].textContent.replace("📅 Deadline: ", "");
        let deadlineB = b.querySelectorAll("p")[1].textContent.replace("📅 Deadline: ", "");

        return deadlineA.localeCompare(deadlineB);
    });

    tugas.forEach(function(kartu) {
        daftar.appendChild(kartu);
    });
}

window.onload = muatTugas;