# CMS Sekolah Al Azhar

Sistem Content Management System (CMS) untuk website sekolah Al Azhar International Islamic Boarding School. Dibangun dengan **PHP Backend** dan **React Frontend** menggunakan teknologi modern.

## 👨‍💻 Pengembang

**Hasan Arofid**  
GitHub: [@hasanarofid](https://github.com/hasanarofid)  
Repository: [cms-sekolah-al-azhar](https://github.com/hasanarofid/cms-sekolah-al-azhar)

## 📋 Deskripsi Proyek

CMS ini dirancang khusus untuk mengelola konten website sekolah, termasuk:
- **Manajemen Konten**: Halaman, Postingan, Kategori
- **Manajemen Menu**: Menu navigasi dengan hierarki
- **Slider Hero**: Banner utama website
- **FAQ**: Frequently Asked Questions
- **Figures**: Profil tokoh/pengurus
- **Partnerships**: Mitra kerjasama
- **Home Sections**: Section khusus untuk halaman utama
- **Settings**: Konfigurasi website
- **Contact Form**: Formulir kontak

## 🏗️ Arsitektur Proyek

Proyek ini menggunakan arsitektur **monorepo** dengan pemisahan jelas antara Backend dan Frontend:

```
alazhar/
├── php-backend/      # Backend API (PHP)
└── react-frontend/   # Frontend (React + TypeScript + Vite)
```

---

## 🔧 Backend (PHP)

### Teknologi
- **PHP 8.1+** (Native PHP, tanpa framework)
- **MySQL** (Database)
- **JWT** (Authentication)
- **Composer** (Dependency Management)

### Struktur Folder

```
php-backend/
├── config/              # Konfigurasi aplikasi
│   ├── config.php       # Konfigurasi umum (CORS, JWT, dll)
│   ├── database.php     # Konfigurasi database
│   └── load-env.php     # Load environment variables
│
├── database/            # Database schema
│   └── schema.sql       # SQL schema untuk MySQL
│
├── public/              # Entry point & file publik
│   ├── index.php        # Main router & entry point
│   ├── router.php       # Router untuk PHP built-in server
│   └── uploads/         # File uploads (images, dll)
│
├── scripts/             # Script utilitas
│   ├── migrate-sqlite-to-mysql.php  # Migrasi data SQLite ke MySQL
│   ├── verify-migration.php        # Verifikasi migrasi
│   └── check-sqlite-data.php       # Cek data SQLite
│
├── src/                 # Source code aplikasi
│   ├── Controllers/     # Controller untuk setiap endpoint
│   │   ├── AuthController.php
│   │   ├── CategoryController.php
│   │   ├── ContactController.php
│   │   ├── FAQController.php
│   │   ├── FigureController.php
│   │   ├── HomeSectionController.php
│   │   ├── InfoController.php      # Info database & status
│   │   ├── MenuController.php
│   │   ├── PageController.php
│   │   ├── PageBlockController.php
│   │   ├── PartnershipController.php
│   │   ├── PostController.php
│   │   ├── SettingController.php
│   │   ├── SliderController.php
│   │   └── UploadController.php
│   │
│   ├── Auth.php         # Authentication handler (JWT)
│   ├── Database.php     # Database connection (PDO)
│   ├── Response.php     # Response helper (JSON + CORS)
│   └── Utils.php        # Utility functions
│
├── prisma/              # Prisma schema (untuk referensi)
│   └── schema.prisma    # Database schema definition
│
├── vendor/              # Composer dependencies
├── composer.json        # Composer configuration
├── .htaccess           # Apache configuration
└── index.php           # Root entry point (redirect ke public/)
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session

#### Admin Endpoints (Require Authentication)
- `GET /api/admin/categories` - List categories
- `GET /api/admin/posts` - List posts
- `GET /api/admin/pages` - List pages
- `GET /api/admin/menus` - List menus
- `GET /api/admin/sliders` - List sliders
- `GET /api/admin/faqs` - List FAQs
- `GET /api/admin/figures` - List figures
- `GET /api/admin/home-sections` - List home sections
- `GET /api/admin/partnerships` - List partnerships
- `GET /api/admin/settings` - List settings
- `POST /api/admin/upload` - Upload file
- `GET /api/admin/contacts` - List contacts

#### Public Endpoints
- `POST /api/contact` - Submit contact form
- `GET /` atau `GET /api/info` - Database info & statistics

### Instalasi Backend

1. **Install Dependencies**
   ```bash
   cd php-backend
   composer install
   ```

2. **Setup Database**
   - Buat database MySQL baru
   - Import schema: `mysql -u username -p database_name < database/schema.sql`

3. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   # Edit .env dengan kredensial database Anda
   ```

4. **Jalankan Server**
   ```bash
   cd php-backend/public
   php -S localhost:8000 router.php
   ```

Lihat [php-backend/README.md](./php-backend/README.md) untuk detail lengkap.

---

## ⚛️ Frontend (React)

### Teknologi
- **React 18+** (UI Library)
- **TypeScript** (Type Safety)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router** (Routing)
- **React Hook Form** (Form Handling)
- **Zod** (Schema Validation)

### Struktur Folder

```
react-frontend/
├── public/              # Static files
│   └── vite.svg
│
├── src/
│   ├── components/      # Reusable components
│   │   ├── admin/        # Admin components
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── DeleteButton.tsx
│   │   │   └── SliderForm.tsx
│   │   │
│   │   ├── BlockRenderer.tsx      # Render page blocks
│   │   ├── ContactForm.tsx        # Contact form
│   │   ├── FAQSection.tsx         # FAQ section
│   │   ├── FiguresSection.tsx     # Figures section
│   │   ├── Footer.tsx             # Footer component
│   │   ├── HeroSlider.tsx         # Hero slider
│   │   ├── HomeSections.tsx       # Home sections
│   │   ├── Navigation.tsx         # Navigation menu
│   │   ├── PartnershipsSection.tsx
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   ├── SplitScreenSection.tsx
│   │   └── WhatsAppButton.tsx
│   │
│   ├── lib/              # Utility libraries
│   │   ├── api-client.ts # API client (fetch wrapper)
│   │   ├── auth.ts       # Authentication helpers
│   │   ├── utils.ts      # General utilities
│   │   ├── utils-image-url.ts
│   │   └── utils-images.ts
│   │
│   ├── routes/           # Page components
│   │   ├── admin/        # Admin pages
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── FAQsPage.tsx
│   │   │   ├── FiguresPage.tsx
│   │   │   ├── HomeSectionsPage.tsx
│   │   │   ├── MenusPage.tsx
│   │   │   ├── PagesPage.tsx
│   │   │   ├── PartnershipsPage.tsx
│   │   │   ├── PostsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── SlidersPage.tsx
│   │   │   ├── SliderNewPage.tsx
│   │   │   └── SliderEditPage.tsx
│   │   │
│   │   ├── ContactPage.tsx
│   │   ├── DynamicPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFound.tsx
│   │   └── PostPage.tsx
│   │
│   ├── App.tsx           # Main App component
│   ├── App.css
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
│
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── package.json          # NPM configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

### Fitur Frontend

- ✅ **Responsive Design** - Mobile-first dengan Tailwind CSS
- ✅ **Authentication** - Login & Session Management
- ✅ **Protected Routes** - Admin area dengan auth guard
- ✅ **Dynamic Pages** - Render halaman dinamis dari CMS
- ✅ **Image Optimization** - URL handling untuk images
- ✅ **Form Validation** - React Hook Form + Zod
- ✅ **API Integration** - Centralized API client

### Instalasi Frontend

1. **Install Dependencies**
   ```bash
   cd react-frontend
   npm install
   ```

2. **Konfigurasi Environment**
   ```bash
   # Buat file .env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

4. **Build untuk Production**
   ```bash
   npm run build
   ```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone git@github.com:hasanarofid/cms-sekolah-al-azhar.git
cd cms-sekolah-al-azhar
```

### 2. Setup Backend
```bash
cd php-backend
composer install
cp .env.example .env
# Edit .env dengan kredensial database
php -S localhost:8000 -t public public/router.php
```

### 3. Setup Frontend
```bash
cd react-frontend
npm install
# Buat .env dengan VITE_API_URL=http://localhost:8000/api
npm run dev
```

### 4. Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Info**: http://localhost:8000/api/info

---

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cmssekolah
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-min-32-characters-long
APP_ENV=development
APP_DEBUG=true
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔐 Authentication

Sistem menggunakan **JWT (JSON Web Token)** untuk authentication:
- Token disimpan di `localStorage` dan `cookie`
- Token dikirim via `Authorization: Bearer <token>` header
- Token expire: 30 hari

---

## 📦 Dependencies

### Backend (Composer)
- `firebase/php-jwt` - JWT authentication

### Frontend (NPM)
- `react` & `react-dom` - React library
- `react-router-dom` - Routing
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `tailwindcss` - CSS framework
- `@vitejs/plugin-react` - Vite React plugin

---

## 📄 License

Proyek ini dikembangkan untuk Al Azhar International Islamic Boarding School.

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:
- **GitHub**: [@hasanarofid](https://github.com/hasanarofid)
- **Repository**: [cms-sekolah-al-azhar](https://github.com/hasanarofid/cms-sekolah-al-azhar)

---

**Dikembangkan dengan ❤️ oleh Hasan Arofid**

