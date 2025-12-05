# Manual Book CMS Sekolah by @hasanarofid
## Panduan Penggunaan untuk Admin

---

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Cara Login ke Admin Panel](#cara-login-ke-admin-panel)
3. [Dashboard](#dashboard)
4. [Menu Home](#menu-home)
   - [Hero Slider](#hero-slider)
   - [Home Section](#home-section)
5. [Menu Halaman](#menu-halaman)
   - [Membuat Halaman Baru](#membuat-halaman-baru)
   - [Mengelola Section pada Halaman](#mengelola-section-pada-halaman)
   - [Tipe-Tipe Section](#tipe-tipe-section)
6. [Menu Berita](#menu-berita)
7. [Menu Kontak](#menu-kontak)
8. [Menu Menu](#menu-menu)
9. [Menu SEO](#menu-seo)
10. [Menu Pengaturan](#menu-pengaturan)
11. [Tips dan Trik](#tips-dan-trik)

---

## Pendahuluan

Manual book ini dibuat untuk membantu Admin dalam menggunakan CMS (Content Management System) Sekolah. CMS ini digunakan untuk mengelola konten website sekolah, termasuk halaman, berita, menu navigasi, dan berbagai konten lainnya.

**Fitur Utama:**
- Manajemen Halaman dengan berbagai tipe section
- Manajemen Berita/Postingan
- Manajemen Menu Navigasi
- Manajemen Hero Slider untuk halaman utama
- Manajemen Home Section untuk halaman utama
- Manajemen Kontak
- Pengaturan SEO
- Pengaturan Umum Website

---

## Cara Login ke Admin Panel

1. Buka browser dan akses URL admin panel (contoh: `https://website-sekolah.com/login`)
2. Masukkan **Email** dan **Password** yang telah diberikan
3. Klik tombol **Login**
4. Setelah berhasil login, Anda akan diarahkan ke halaman Dashboard

**Catatan:** Pastikan kredensial login Anda valid. Jika lupa password, hubungi administrator sistem.

---

## Dashboard

Dashboard adalah halaman utama setelah login. Di sini Anda dapat melihat:
- Ringkasan statistik website
- Informasi umum tentang konten yang telah dibuat
- Quick access ke menu-menu penting

**Navigasi:**
- Gunakan **Sidebar** di sebelah kiri untuk mengakses semua menu
- Klik **"Buka Halaman Depan"** di bagian bawah sidebar untuk melihat website publik
- Klik **Logout** untuk keluar dari admin panel

---

## Menu Home

Menu Home berisi pengaturan untuk halaman utama website. Terdapat 2 submenu:

### Hero Slider

Hero Slider adalah banner utama yang ditampilkan di bagian atas halaman utama website.

**Cara Mengelola Hero Slider:**

1. Klik menu **Home** di sidebar, lalu pilih **Hero Slider**
2. Anda akan melihat daftar semua slider yang ada
3. **Menambah Slider Baru:**
   - Klik tombol **"Tambah Slider"** atau **"New"**
   - Isi form dengan informasi:
     - **Title**: Judul slider (opsional)
     - **Image**: Upload gambar slider (disarankan ukuran besar, misal 1920x800px)
     - **Link**: URL tujuan ketika slider diklik (opsional)
     - **Order**: Urutan tampil slider (angka lebih kecil tampil lebih dulu)
     - **Is Active**: Aktifkan/nonaktifkan slider
   - Klik **"Simpan"** atau **"Save"**

4. **Mengedit Slider:**
   - Klik ikon **Edit** pada slider yang ingin diedit
   - Ubah informasi yang diperlukan
   - Klik **"Simpan"**

5. **Menghapus Slider:**
   - Klik ikon **Delete** pada slider yang ingin dihapus
   - Konfirmasi penghapusan

**Tips:**
- Gunakan gambar berkualitas tinggi untuk hasil yang lebih baik
- Pastikan ukuran file gambar tidak terlalu besar (disarankan < 2MB)
- Urutkan slider sesuai prioritas tampil

### Home Section

Home Section adalah section-section khusus yang ditampilkan di halaman utama website, selain Hero Slider.

**Cara Mengelola Home Section:**

1. Klik menu **Home** di sidebar, lalu pilih **Home Section**
2. Anda akan melihat daftar semua home section yang ada
3. **Menambah Home Section Baru:**
   - Klik tombol **"Tambah Home Section"** atau **"New"**
   - Pilih **Tipe Section** (lihat penjelasan tipe section di bagian Menu Halaman)
   - Isi form sesuai dengan tipe section yang dipilih
   - Klik **"Simpan"**

4. **Mengedit Home Section:**
   - Klik ikon **Edit** pada section yang ingin diedit
   - Ubah informasi yang diperlukan
   - Klik **"Simpan"**

5. **Menghapus Home Section:**
   - Klik ikon **Delete** pada section yang ingin dihapus
   - Konfirmasi penghapusan

**Catatan:** Tipe section yang tersedia untuk Home Section sama dengan section pada halaman biasa. Lihat penjelasan lengkap di bagian [Tipe-Tipe Section](#tipe-tipe-section).

---

## Menu Halaman

Menu Halaman digunakan untuk mengelola semua halaman website, selain halaman utama.

### Membuat Halaman Baru

1. Klik menu **Halaman** di sidebar
2. Klik tombol **"Tambah Halaman"** di pojok kanan atas
3. Isi form dengan informasi berikut:
   - **Title (ID)**: Judul halaman dalam bahasa Indonesia (wajib)
   - **Title (EN)**: Judul halaman dalam bahasa Inggris (opsional)
   - **Slug**: URL halaman (contoh: `tentang-kami` akan menjadi `/tentang-kami`) (wajib)
     - Slug harus unik dan tidak boleh mengandung spasi
     - Gunakan huruf kecil dan tanda hubung (-) untuk memisahkan kata
   - **Content (ID)**: Konten halaman dalam bahasa Indonesia (opsional, bisa diisi nanti)
   - **Content (EN)**: Konten halaman dalam bahasa Inggris (opsional)
   - **Meta Description**: Deskripsi untuk SEO (opsional)
   - **Meta Keywords**: Kata kunci untuk SEO (opsional)
   - **Is Published**: Centang untuk mempublish halaman, atau biarkan tidak tercentang untuk draft
   - **Menu**: Pilih menu yang akan menampilkan halaman ini (opsional)
4. Klik **"Simpan"** atau **"Save"**

**Catatan:**
- Setelah halaman dibuat, Anda dapat menambahkan Hero dan Section pada halaman tersebut
- Halaman yang belum dipublish tidak akan tampil di website publik

### Mengelola Halaman

Di halaman daftar halaman, Anda dapat:

1. **Mencari Halaman:**
   - Gunakan kotak pencarian untuk mencari berdasarkan judul, slug, atau penulis

2. **Mengedit Halaman:**
   - Klik ikon **Edit** pada halaman yang ingin diedit
   - Ubah informasi yang diperlukan
   - Klik **"Simpan"**

3. **Mengelola Hero Halaman:**
   - Klik tombol **"Hero"** pada halaman yang ingin dikelola
   - Hero adalah banner/header khusus untuk halaman tersebut
   - Prosesnya sama seperti mengelola Hero Slider

4. **Mengelola Section Halaman:**
   - Klik tombol **"Section"** pada halaman yang ingin dikelola
   - Lihat penjelasan lengkap di bagian [Mengelola Section pada Halaman](#mengelola-section-pada-halaman)

5. **Melihat Halaman:**
   - Klik ikon **Eye** untuk membuka halaman di tab baru (preview)

6. **Menghapus Halaman:**
   - Klik ikon **Delete** pada halaman yang ingin dihapus
   - Konfirmasi penghapusan

### Mengelola Section pada Halaman

Section adalah blok konten yang dapat ditambahkan pada halaman untuk membuat layout yang lebih menarik dan terstruktur.

**Cara Menambahkan Section:**

1. Buka halaman yang ingin ditambahkan section (klik tombol **"Section"** pada halaman)
2. Klik tombol **"Tambah Section"**
3. Pilih **Tipe Section** dari dropdown
4. Isi form sesuai dengan tipe section yang dipilih (lihat penjelasan di bagian [Tipe-Tipe Section](#tipe-tipe-section))
5. Set **Order** (urutan tampil, angka lebih kecil tampil lebih dulu)
6. Aktifkan/nonaktifkan section dengan toggle **Is Active**
7. Klik **"Simpan"**

**Cara Mengedit Section:**

1. Di halaman daftar section, klik ikon **Edit** pada section yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik **"Simpan"**

**Cara Mengatur Urutan Section:**

- Gunakan field **Order** saat membuat atau mengedit section
- Section dengan order lebih kecil akan tampil lebih dulu
- Contoh: Section dengan order 0 akan tampil sebelum section dengan order 1

**Cara Mengaktifkan/Nonaktifkan Section:**

- Gunakan toggle **Is Active** pada daftar section
- Atau ubah status saat mengedit section
- Section yang tidak aktif tidak akan tampil di website publik

**Cara Menghapus Section:**

1. Klik ikon **Delete** pada section yang ingin dihapus
2. Konfirmasi penghapusan

### Tipe-Tipe Section

Berikut adalah daftar lengkap tipe section yang tersedia beserta penjelasan dan cara penggunaannya:

#### 1. Motto
Section untuk menampilkan motto sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Content (ID)**: Teks motto dalam bahasa Indonesia
- **Content (EN)**: Teks motto dalam bahasa Inggris (opsional)
- **Image**: Gambar pendukung (opsional)

#### 2. Video Profile
Section untuk menampilkan video profil sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Subtitle (EN)**: Subjudul section bahasa Inggris (opsional)
- **Video URL**: URL video (YouTube, Vimeo, dll) - wajib
- **Image**: Thumbnail video (opsional)

#### 3. Admission (Penerimaan)
Section untuk informasi penerimaan siswa baru.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Content (ID)**: Konten informasi penerimaan
- **Content (EN)**: Konten informasi penerimaan bahasa Inggris (opsional)
- **Button Text (ID)**: Teks tombol (contoh: "Daftar Sekarang")
- **Button Text (EN)**: Teks tombol bahasa Inggris (opsional)
- **Button URL**: URL tujuan tombol (contoh: `/pendaftaran`)
- **Image**: Gambar pendukung (opsional)

#### 4. Feature
Section untuk menampilkan fitur-fitur unggulan.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Content (ID)**: Deskripsi fitur
- **Content (EN)**: Deskripsi fitur bahasa Inggris (opsional)
- **Image**: Gambar fitur (opsional)
- **Button Text (ID)**: Teks tombol (opsional)
- **Button URL**: URL tujuan tombol (opsional)

#### 5. Split Screen (Yellow Background)
Section dengan layout split screen (dua kolom) dengan background kuning.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Content (ID)**: Konten kolom kiri
- **Content (EN)**: Konten kolom kiri bahasa Inggris (opsional)
- **Image Left**: Gambar untuk kolom kiri (opsional)
- **Image Right**: Gambar untuk kolom kanan (opsional)

#### 6. Masjid AL FATIH
Section khusus untuk informasi Masjid AL FATIH.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section - **WAJIB**
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Content (ID)**: Konten informasi masjid
- **Content (EN)**: Konten informasi masjid bahasa Inggris (opsional)
- **Image**: Gambar masjid (opsional)

#### 7. University Map (Peta Universitas)
Section untuk menampilkan peta lokasi universitas/sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Content (ID)**: Deskripsi peta
- **Content (EN)**: Deskripsi peta bahasa Inggris (opsional)
- **Image**: Gambar peta (opsional)
- **Map Embed URL**: URL embed peta (Google Maps, dll) (opsional)

#### 8. Global Stage (International Program)
Section untuk menampilkan program internasional.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Content (ID)**: Deskripsi program internasional
- **Content (EN)**: Deskripsi program internasional bahasa Inggris (opsional)
- **Image**: Gambar program (opsional)
- **Button Text (ID)**: Teks tombol (opsional)
- **Button URL**: URL tujuan tombol (opsional)

#### 9. News Section (Berita)
Section untuk menampilkan daftar berita terbaru.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (contoh: "Berita Terkini")
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)

**Catatan:** Section ini akan otomatis menampilkan berita terbaru dari menu Berita.

#### 10. FAQ Section
Section untuk menampilkan Frequently Asked Questions (Pertanyaan yang Sering Diajukan).

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (contoh: "Pertanyaan Umum")
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **FAQ Items**: Daftar pertanyaan dan jawaban
  - Klik **"Tambah FAQ Item"** untuk menambahkan item
  - Isi **Question (ID)**: Pertanyaan dalam bahasa Indonesia
  - Isi **Question (EN)**: Pertanyaan dalam bahasa Inggris (opsional)
  - Isi **Answer (ID)**: Jawaban dalam bahasa Indonesia
  - Isi **Answer (EN)**: Jawaban dalam bahasa Inggris (opsional)
  - Atur **Order** untuk urutan tampil

#### 11. Accreditation (Akreditasi)
Section untuk menampilkan informasi akreditasi sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Content (ID)**: Informasi akreditasi
- **Content (EN)**: Informasi akreditasi bahasa Inggris (opsional)
- **Badge Image**: Gambar badge akreditasi (opsional)
- **Accreditation Number**: Nomor akreditasi (opsional)
- **Accreditation Body**: Badan akreditasi (opsional)
- **Image**: Gambar pendukung (opsional)

#### 12. Navigation Grid (Grid Navigasi)
Section untuk menampilkan grid navigasi dengan ikon dan link.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Navigation Items**: Daftar item navigasi
  - Klik **"Tambah Navigation Item"** untuk menambahkan item
  - Isi **Label**: Teks label navigasi
  - Isi **URL**: URL tujuan (contoh: `/program`)
  - Isi **Icon**: Nama ikon (opsional)

#### 13. Program Cards (Kartu Program)
Section untuk menampilkan kartu-kartu program dalam bentuk grid.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Program Items**: Daftar program
  - Klik **"Tambah Program Item"** untuk menambahkan item
  - Isi **Icon**: Nama ikon atau upload gambar ikon
  - Isi **Title**: Judul program
  - Isi **Description**: Deskripsi program
  - Isi **URL**: URL tujuan (opsional)

#### 14. Facility Gallery (Galeri Fasilitas)
Section untuk menampilkan galeri foto fasilitas sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Facility Items**: Daftar fasilitas
  - Klik **"Tambah Facility Item"** untuk menambahkan item
  - Upload **Image**: Gambar fasilitas
  - Isi **Caption**: Keterangan gambar (opsional)
  - Isi **URL**: URL tujuan jika diklik (opsional)

#### 15. Extracurricular Detail (Detail Ekstrakurikuler)
Section untuk menampilkan detail ekstrakurikuler.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Subtitle (ID)**: Subjudul section (opsional)
- **Content (ID)**: Deskripsi ekstrakurikuler
- **Content (EN)**: Deskripsi ekstrakurikuler bahasa Inggris (opsional)
- **Extracurricular Items**: Daftar ekstrakurikuler
  - Klik **"Tambah Extracurricular Item"** untuk menambahkan item
  - Upload **Image**: Gambar ekstrakurikuler
  - Isi **Title**: Nama ekstrakurikuler
  - Isi **Description**: Deskripsi ekstrakurikuler

#### 16. Organization Structure (Struktur Organisasi)
Section untuk menampilkan struktur organisasi sekolah.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Organization Items**: Daftar anggota organisasi
  - Klik **"Tambah Organization Item"** untuk menambahkan item
  - Isi **Name**: Nama anggota
  - Isi **Position**: Jabatan (dalam bahasa Indonesia)
  - Isi **Position (EN)**: Jabatan (dalam bahasa Inggris) (opsional)
  - Upload **Image**: Foto anggota (opsional)
  - Pilih **Parent**: Atasan/jabatan di atasnya (untuk membuat hierarki)
  - Atur **Level**: Level dalam struktur (0 untuk level tertinggi)
  - Atur **Order**: Urutan tampil

**Tips:** Gunakan Parent dan Level untuk membuat struktur hierarki yang benar.

#### 17. Student Achievements (Prestasi Siswa)
Section untuk menampilkan prestasi siswa.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Achievement Items**: Daftar prestasi
  - Klik **"Tambah Achievement Item"** untuk menambahkan item
  - Isi **Title (ID)**: Judul prestasi
  - Isi **Title (EN)**: Judul prestasi bahasa Inggris (opsional)
  - Isi **Subtitle (ID)**: Subjudul (opsional)
  - Isi **Description (ID)**: Deskripsi prestasi
  - Isi **Description (EN)**: Deskripsi prestasi bahasa Inggris (opsional)
  - Isi **Competition Name (ID)**: Nama kompetisi (opsional)
  - Isi **Competition Name (EN)**: Nama kompetisi bahasa Inggris (opsional)
  - **Students**: Daftar siswa yang meraih prestasi
    - Klik **"Tambah Student"** untuk menambahkan siswa
    - Isi **Name**: Nama siswa
    - Upload **Image**: Foto siswa (opsional)
    - Isi **Position**: Posisi/prestasi (contoh: "Juara 1") (opsional)
  - Pilih **Background Type**: Tipe background (gradient, gold, blue)
  - Upload **Left Logo**: Logo kiri (opsional)
  - Upload **Right Logo**: Logo kanan (opsional)
  - Atur **Order**: Urutan tampil

#### 18. Curriculum Table (Tabel Kurikulum)
Section untuk menampilkan tabel kurikulum.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Curriculum Items**: Daftar mata pelajaran
  - Klik **"Tambah Curriculum Item"** untuk menambahkan item
  - Isi **Mata Pelajaran**: Nama mata pelajaran
  - Isi **JP TM**: Jumlah jam pelajaran tatap muka
  - Isi **JP Proyek**: Jumlah jam pelajaran proyek (opsional)
  - Atur **Order**: Urutan tampil

#### 19. Academic Calendar (Kalender Pendidikan)
Section untuk menampilkan kalender akademik.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Calendar Items**: Daftar kegiatan akademik
  - Klik **"Tambah Calendar Item"** untuk menambahkan item
  - Isi **Bulan**: Nama bulan
  - Isi **Kegiatan**: Nama kegiatan
  - Isi **Keterangan**: Keterangan tambahan (opsional)
  - Isi **Tanggal Mulai**: Tanggal mulai kegiatan (opsional)
  - Isi **Tanggal Selesai**: Tanggal selesai kegiatan (opsional)
  - Atur **Order**: Urutan tampil

#### 20. BOS Report (Laporan Realisasi BOS)
Section untuk menampilkan laporan realisasi BOS (Bantuan Operasional Sekolah).

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Document Items**: Daftar dokumen laporan
  - Klik **"Tambah Document Item"** untuk menambahkan item
  - Isi **Nama**: Nama dokumen (contoh: "Laporan BOS 2024")
  - Upload **File**: File PDF atau dokumen lainnya
  - Atur **Order**: Urutan tampil

#### 21. Contact (Kontak)
Section untuk menampilkan informasi kontak.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Address (ID)**: Alamat dalam bahasa Indonesia
- **Address (EN)**: Alamat dalam bahasa Inggris (opsional)
- **Email**: Alamat email
- **Phone**: Nomor telepon
- **Image**: Gambar pendukung (opsional)

#### 22. Maps (Peta)
Section untuk menampilkan peta lokasi.

**Field yang perlu diisi:**
- **Title (ID)**: Judul section (opsional)
- **Title (EN)**: Judul section bahasa Inggris (opsional)
- **Map Embed URL**: URL embed peta dari Google Maps atau layanan peta lainnya
  - Cara mendapatkan embed URL:
    1. Buka Google Maps
    2. Cari lokasi sekolah
    3. Klik "Share" → "Embed a map"
    4. Salin kode iframe, ambil bagian src="..." 
    5. Paste URL tersebut ke field Map Embed URL
- **Address (ID)**: Alamat dalam bahasa Indonesia (opsional)
- **Address (EN)**: Alamat dalam bahasa Inggris (opsional)

---

## Menu Berita

Menu Berita digunakan untuk mengelola artikel/berita yang ditampilkan di website.

**Cara Mengelola Berita:**

1. Klik menu **Berita** di sidebar
2. **Menambah Berita Baru:**
   - Klik tombol **"Tambah Berita"** atau **"New"**
   - Isi form dengan informasi:
     - **Title (ID)**: Judul berita dalam bahasa Indonesia (wajib)
     - **Title (EN)**: Judul berita dalam bahasa Inggris (opsional)
     - **Slug**: URL berita (otomatis dibuat dari judul, bisa diubah) (wajib)
     - **Content (ID)**: Isi berita dalam bahasa Indonesia
     - **Content (EN)**: Isi berita dalam bahasa Inggris (opsional)
     - **Excerpt (ID)**: Ringkasan berita (akan tampil di daftar berita)
     - **Excerpt (EN)**: Ringkasan berita bahasa Inggris (opsional)
     - **Featured Image**: Gambar utama berita
     - **Category**: Kategori berita (opsional)
     - **Meta Description**: Deskripsi untuk SEO (opsional)
     - **Meta Keywords**: Kata kunci untuk SEO (opsional)
     - **Is Published**: Centang untuk mempublish berita
   - Klik **"Simpan"**

3. **Mengedit Berita:**
   - Klik ikon **Edit** pada berita yang ingin diedit
   - Ubah informasi yang diperlukan
   - Klik **"Simpan"**

4. **Menghapus Berita:**
   - Klik ikon **Delete** pada berita yang ingin dihapus
   - Konfirmasi penghapusan

5. **Melihat Berita:**
   - Klik ikon **Eye** untuk melihat berita di website publik

**Tips:**
- Gunakan Featured Image yang menarik untuk meningkatkan engagement
- Isi Excerpt dengan ringkasan yang menarik (50-150 kata)
- Publish berita secara berkala untuk menjaga website tetap update

---

## Menu Kontak

Menu Kontak digunakan untuk melihat dan mengelola pesan yang masuk melalui formulir kontak di website.

**Cara Mengelola Kontak:**

1. Klik menu **Kontak** di sidebar
2. Anda akan melihat daftar semua pesan kontak yang masuk
3. **Melihat Detail Pesan:**
   - Klik pada pesan untuk melihat detail lengkap
   - Informasi yang ditampilkan: Nama, Email, Subject, Message, dan Tanggal

4. **Menghapus Pesan:**
   - Klik ikon **Delete** pada pesan yang ingin dihapus
   - Konfirmasi penghapusan

**Catatan:**
- Pesan kontak dikirim oleh pengunjung website melalui formulir kontak
- Pastikan untuk merespons pesan secara berkala

---

## Menu Menu

Menu Menu digunakan untuk mengelola menu navigasi yang ditampilkan di website (header navigation).

**Cara Mengelola Menu:**

1. Klik menu **Menu** di sidebar
2. **Menambah Menu Baru:**
   - Klik tombol **"Tambah Menu"** atau **"New"**
   - Isi form dengan informasi:
     - **Title (ID)**: Label menu dalam bahasa Indonesia (wajib)
     - **Title (EN)**: Label menu dalam bahasa Inggris (opsional)
     - **Slug**: URL/identifikasi menu (wajib)
       - Untuk menu yang mengarah ke halaman, gunakan slug yang sama dengan halaman
       - Contoh: Jika halaman memiliki slug `tentang-kami`, menu juga gunakan `tentang-kami`
     - **Menu Type**: Tipe menu
       - **Page**: Menu yang mengarah ke halaman (pilih halaman dari dropdown)
       - **External**: Menu yang mengarah ke URL eksternal (isi External URL)
       - **Category**: Menu yang mengarah ke kategori (opsional)
       - **Post List**: Menu yang menampilkan daftar berita (opsional)
     - **Parent Menu**: Pilih menu parent jika ingin membuat submenu (opsional)
     - **Order**: Urutan tampil menu (angka lebih kecil tampil lebih dulu)
     - **Is Active**: Aktifkan/nonaktifkan menu
     - **Icon**: Nama ikon (opsional)
     - **Description**: Deskripsi menu (opsional)
   - Klik **"Simpan"**

3. **Membuat Submenu:**
   - Saat membuat menu baru, pilih **Parent Menu** untuk membuat submenu
   - Submenu dapat dibuat hingga 3 level (Menu → Submenu → Sub-submenu)

4. **Mengedit Menu:**
   - Klik ikon **Edit** pada menu yang ingin diedit
   - Ubah informasi yang diperlukan
   - Klik **"Simpan"**

5. **Mengaktifkan/Nonaktifkan Menu:**
   - Gunakan toggle switch pada daftar menu
   - Menu yang tidak aktif tidak akan tampil di website

6. **Menghapus Menu:**
   - Klik ikon **Delete** pada menu yang ingin dihapus
   - Konfirmasi penghapusan
   - **Peringatan:** Menghapus menu parent akan menghapus semua submenu di bawahnya

**Tips:**
- Urutkan menu sesuai dengan prioritas tampil
- Gunakan struktur menu yang jelas dan mudah dipahami
- Pastikan slug menu sesuai dengan halaman yang dituju (jika Menu Type = Page)

---

## Menu SEO

Menu SEO digunakan untuk mengelola pengaturan SEO (Search Engine Optimization) website secara global.

**Cara Mengelola SEO:**

1. Klik menu **SEO** di sidebar
2. Isi form dengan informasi:
   - **Site Title**: Judul website (akan digunakan sebagai default title)
   - **Meta Description**: Deskripsi default website untuk SEO
   - **Meta Keywords**: Kata kunci default website
   - **OG Image**: Gambar yang ditampilkan saat website di-share di media sosial
   - **Favicon**: Ikon website (akan tampil di tab browser)
3. Klik **"Simpan"**

**Tips:**
- Gunakan Meta Description yang menarik dan informatif (150-160 karakter)
- Pilih OG Image yang menarik dan representatif untuk website
- Favicon sebaiknya berukuran 32x32 atau 64x64 pixel

---

## Menu Pengaturan

Menu Pengaturan digunakan untuk mengelola pengaturan umum website.

**Cara Mengelola Pengaturan:**

1. Klik menu **Pengaturan** di sidebar
2. Isi form dengan informasi:
   - **Site Name**: Nama website
   - **Site Description**: Deskripsi website
   - **Contact Email**: Email kontak website
   - **Contact Phone**: Nomor telepon kontak
   - **Address**: Alamat sekolah
   - **Social Media Links**: Link media sosial (Facebook, Instagram, Twitter, YouTube, dll)
   - **Logo**: Logo website
   - **Favicon**: Ikon website
   - Dan pengaturan lainnya sesuai kebutuhan
3. Klik **"Simpan"**

**Catatan:** Pengaturan ini akan mempengaruhi tampilan dan informasi yang ditampilkan di seluruh website.

---

## Tips dan Trik

### Upload Gambar
- **Ukuran File:** Disarankan maksimal 2MB per gambar
- **Format:** Gunakan format JPG, PNG, atau WebP
- **Dimensi:** 
  - Hero Slider: 1920x800px (atau rasio 16:9)
  - Featured Image Berita: 1200x630px (rasio 1.91:1)
  - Gambar Section: Sesuai kebutuhan, disarankan minimal 800px lebar
- **Optimasi:** Kompres gambar sebelum upload untuk loading yang lebih cepat

### Slug dan URL
- Slug harus unik dan tidak boleh mengandung spasi
- Gunakan huruf kecil dan tanda hubung (-) untuk memisahkan kata
- Contoh slug yang baik: `tentang-kami`, `program-unggulan`, `prestasi-siswa`
- Contoh slug yang buruk: `Tentang Kami`, `program_unggulan`, `prestasi siswa`

### Konten Multibahasa
- Selalu isi konten dalam bahasa Indonesia (ID) terlebih dahulu
- Konten bahasa Inggris (EN) bersifat opsional
- Jika website mendukung multibahasa, pastikan semua konten diisi dalam kedua bahasa

### Publishing dan Draft
- Gunakan status **Draft** untuk menyimpan konten yang belum selesai
- Setelah konten selesai, ubah status menjadi **Published** agar tampil di website
- Halaman/Berita yang masih Draft tidak akan tampil di website publik

### Urutan Tampil (Order)
- Gunakan angka kecil (0, 1, 2, ...) untuk item yang ingin tampil lebih dulu
- Item dengan order lebih kecil akan tampil sebelum item dengan order lebih besar
- Contoh: Section dengan order 0 akan tampil sebelum section dengan order 1

### Backup dan Keamanan
- Lakukan backup data secara berkala
- Jangan share kredensial login dengan orang yang tidak berwenang
- Gunakan password yang kuat dan ganti secara berkala

### Troubleshooting
- **Gambar tidak tampil:** Pastikan format file didukung dan ukuran tidak terlalu besar
- **Section tidak tampil:** Pastikan section sudah diaktifkan (Is Active = true) dan sudah dipublish
- **Menu tidak tampil:** Pastikan menu sudah diaktifkan dan sudah dipublish
- **Halaman error 404:** Pastikan slug halaman sudah benar dan halaman sudah dipublish

---

## Kesimpulan

Manual book ini telah menjelaskan cara penggunaan CMS Sekolah  untuk Admin. Dengan mengikuti panduan ini, Anda dapat:

- Mengelola halaman website dengan berbagai tipe section
- Mengelola berita dan konten lainnya
- Mengelola menu navigasi
- Mengelola pengaturan website
- Dan berbagai fitur lainnya

Jika ada pertanyaan atau mengalami kesulitan, jangan ragu untuk menghubungi administrator sistem.

**Selamat menggunakan CMS Sekolah!**

---

*Dokumen ini dibuat untuk CMS Sekolah by @hasanarofid - Versi 1.0*  
*Terakhir diperbarui: 2025*

