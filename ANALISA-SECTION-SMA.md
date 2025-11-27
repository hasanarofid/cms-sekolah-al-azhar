# Analisa Section untuk Halaman SMA
## Berdasarkan Referensi: https://alazhariibs.sch.id/sma/

### Section yang Ada Setelah Video:

#### 1. **Section Akreditasi A** (Badge dengan Teks)
- **Deskripsi**: Badge emas dengan huruf "A" di tengah, teks akreditasi di samping
- **Layout**: Horizontal - Badge di kiri, teks di kanan
- **Tipe Section yang Diperlukan**: `accreditation` (BARU - perlu ditambahkan)
- **Field yang Diperlukan**:
  - `badgeImage` (gambar badge emas)
  - `title` (judul: "Akreditasi A")
  - `content` (teks akreditasi lengkap dengan nomor)
  - `accreditationNumber` (opsional - nomor akreditasi: "267/BAN-PDM/SK/2024")
  - `accreditationBody` (opsional - badan akreditasi: "BAN-PDM")

#### 2. **Section Ekstrakurikuler (Grid Navigation Buttons)**
- **Deskripsi**: Grid 8 tombol navigasi dengan gradient biru-teal, rounded corners
- **Layout**: Grid 4 kolom x 2 baris (responsive)
- **Tipe Section yang Diperlukan**: `navigation-grid` (BARU - perlu ditambahkan)
- **Field yang Diperlukan**:
  - `title` (judul section: "Ekstrakurikuler" - opsional, bisa di header)
  - `items` (array of navigation items - JSON):
    - `id` (unique ID)
    - `label` (teks tombol)
    - `url` (link tujuan - relative atau absolute)
    - `icon` (opsional - gambar icon)
  - `gridColumns` (jumlah kolom: 4 untuk desktop, 2 untuk mobile)

#### 3. **Section Program (Cards)**
- **Deskripsi**: 4 kartu program vertikal dengan icon square, judul, separator merah, dan deskripsi
- **Layout**: Grid 4 kolom (responsive menjadi 2 atau 1 kolom)
- **Tipe Section yang Diperlukan**: `program-cards` (BARU - perlu ditambahkan)
- **Field yang Diperlukan**:
  - `title` (judul section: "Program" - opsional)
  - `items` (array of program cards - JSON):
    - `id` (unique ID)
    - `icon` (gambar icon square dengan warna berbeda)
    - `title` (judul program)
    - `description` (deskripsi program)
    - `url` (opsional - link ke halaman detail)

#### 4. **Section Fasilitas (Photo Gallery)**
- **Deskripsi**: Grid 9 foto fasilitas dengan rounded corners
- **Layout**: Grid 3 kolom x 3 baris (responsive)
- **Tipe Section yang Diperlukan**: `facility-gallery` (BARU - perlu ditambahkan)
- **Field yang Diperlukan**:
  - `title` (judul section: "Fasilitas" - opsional)
  - `images` (array of images - JSON):
    - `id` (unique ID)
    - `image` (gambar fasilitas)
    - `caption` (opsional - caption untuk gambar)
    - `url` (opsional - link ke detail)
  - `gridColumns` (jumlah kolom: 3 untuk desktop)

#### 5. **Section Ekstrakurikuler Detail (Split Screen dengan Carousel)**
- **Deskripsi**: Split screen - gambar siswa di kiri, carousel 3 kartu ekstrakurikuler di kanan
- **Layout**: 50% kiri (gambar) + 50% kanan (carousel dengan navigation arrows)
- **Tipe Section yang Diperlukan**: `extracurricular-detail` (BARU - perlu ditambahkan)
- **Field yang Diperlukan**:
  - `imageLeft` (gambar siswa dengan speech bubble)
  - `title` (judul section: "Ekstrakurikuler")
  - `items` (array of extracurricular cards untuk carousel - JSON):
    - `id` (unique ID)
    - `image` (gambar ekstrakurikuler)
    - `title` (nama ekstrakurikuler)
    - `description` (deskripsi)

#### 6. **Section Alumni (University Logos)**
- **Deskripsi**: Banner dengan judul dan logo universitas dalam carousel horizontal
- **Layout**: Judul di atas, carousel logo di bawah dengan navigation dots
- **Tipe Section yang Diperlukan**: `alumni-universities` (BARU) atau gunakan `partnerships` dengan modifikasi
- **Field yang Diperlukan**:
  - `title` (judul: "Alumni Berhasil Diterima di Universitas Terkemuka")
  - `universities` (array of university logos - JSON):
    - `id` (unique ID)
    - `logo` (gambar logo universitas)
    - `name` (nama universitas)
    - `url` (opsional - link ke website universitas)

---

## Rekomendasi Implementasi

### Opsi 1: Tambahkan Tipe Section Baru (Recommended untuk Long-term)
Tambahkan tipe section baru untuk setiap kebutuhan spesifik:
1. ✅ `accreditation` - Section akreditasi dengan badge
2. ✅ `navigation-grid` - Grid tombol navigasi (8 tombol)
3. ✅ `program-cards` - Kartu program dengan icon (4 kartu)
4. ✅ `facility-gallery` - Gallery fasilitas (grid 3x3)
5. ✅ `extracurricular-detail` - Detail ekstrakurikuler dengan carousel
6. ✅ `alumni-universities` - Logo universitas alumni (carousel)

**Keuntungan**: Setiap section punya field yang spesifik dan mudah di-maintain
**Kekurangan**: Perlu membuat 6 komponen baru

### Opsi 2: Gunakan Section yang Sudah Ada dengan Modifikasi (Quick Implementation)
1. **Akreditasi**: Gunakan `feature` dengan custom styling (badge sebagai image)
2. **Navigation Grid**: Gunakan `feature` dengan multiple items (perlu modifikasi untuk grid layout)
3. **Program Cards**: Gunakan `feature` (sudah ada, tapi perlu modifikasi untuk icon square)
4. **Facility Gallery**: Tambahkan support `images` array ke PageSection (perlu migration)
5. **Extracurricular Detail**: Gunakan `split-screen` dengan modifikasi untuk carousel di kanan
6. **Alumni**: Gunakan `partnerships` (sudah ada di HomeSection, perlu ditambahkan ke PageSection)

**Keuntungan**: Cepat implementasi, menggunakan komponen yang sudah ada
**Kekurangan**: Beberapa section mungkin kurang fleksibel

### Opsi 3: Hybrid (Recommended untuk Quick Implementation)
Gunakan kombinasi section yang sudah ada + tambahkan yang spesifik:

**Gunakan Section yang Sudah Ada:**
- ✅ `partnerships` untuk Alumni (sudah ada, perlu ditambahkan ke PageSection)
- ✅ `split-screen` untuk Ekstrakurikuler Detail (dengan modifikasi carousel)

**Tambahkan Section Baru:**
- ✅ `accreditation` - Section akreditasi (spesifik, tidak bisa diganti)
- ✅ `navigation-grid` - Grid tombol navigasi (layout spesifik)
- ✅ `program-cards` - Kartu program (layout dengan icon square spesifik)
- ✅ `facility-gallery` - Gallery fasilitas (grid 3x3 dengan caption)

**Keuntungan**: Balance antara cepat implementasi dan fleksibilitas
**Kekurangan**: Perlu membuat 4 komponen baru

---

## Urutan Section di Halaman SMA (berdasarkan referensi):
1. Video Profile ✅ (sudah ada - `video-profile`)
2. Akreditasi A ❌ (perlu ditambahkan - `accreditation`)
3. Ekstrakurikuler (Grid Navigation) ❌ (perlu ditambahkan - `navigation-grid`)
4. Program (Cards) ❌ (perlu ditambahkan - `program-cards`)
5. Fasilitas (Gallery) ❌ (perlu ditambahkan - `facility-gallery`)
6. Ekstrakurikuler Detail (Split Screen + Carousel) ⚠️ (bisa modifikasi `split-screen` atau tambah baru)
7. Alumni (University Logos) ⚠️ (bisa gunakan `partnerships` dengan modifikasi)

---

## Detail Field untuk Setiap Section Baru

### 1. Accreditation Section
```typescript
{
  type: 'accreditation',
  badgeImage: string,        // URL gambar badge emas
  title: string,             // "Akreditasi A"
  content: string,           // Teks lengkap akreditasi
  accreditationNumber?: string, // "267/BAN-PDM/SK/2024"
  accreditationBody?: string   // "BAN-PDM"
}
```

### 2. Navigation Grid Section
```typescript
{
  type: 'navigation-grid',
  title?: string,            // Judul section (opsional)
  items: Array<{
    id: string,
    label: string,           // Teks tombol
    url: string,            // Link tujuan
    icon?: string           // URL icon (opsional)
  }>,
  gridColumns?: number      // Default: 4
}
```

### 3. Program Cards Section
```typescript
{
  type: 'program-cards',
  title?: string,           // Judul section (opsional)
  items: Array<{
    id: string,
    icon: string,           // URL icon square
    title: string,          // Judul program
    description: string,    // Deskripsi program
    url?: string           // Link ke detail (opsional)
  }>
}
```

### 4. Facility Gallery Section
```typescript
{
  type: 'facility-gallery',
  title?: string,           // Judul section (opsional)
  images: Array<{
    id: string,
    image: string,          // URL gambar
    caption?: string,      // Caption gambar (opsional)
    url?: string           // Link ke detail (opsional)
  }>,
  gridColumns?: number      // Default: 3
}
```

### 5. Extracurricular Detail Section
```typescript
{
  type: 'extracurricular-detail',
  imageLeft: string,        // URL gambar siswa di kiri
  title: string,            // Judul section
  items: Array<{
    id: string,
    image: string,          // URL gambar ekstrakurikuler
    title: string,          // Nama ekstrakurikuler
    description: string     // Deskripsi
  }>
}
```

### 6. Alumni Universities Section
```typescript
{
  type: 'alumni-universities',
  title: string,            // "Alumni Berhasil Diterima di Universitas Terkemuka"
  universities: Array<{
    id: string,
    logo: string,          // URL logo universitas
    name: string,          // Nama universitas
    url?: string           // Link ke website (opsional)
  }>
}
// ATAU gunakan partnerships dengan category: 'alumni'
```

