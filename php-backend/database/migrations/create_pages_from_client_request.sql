-- Migration: Create Pages and Menus from Client Request
-- Berdasarkan gambar-gambar yang diberikan client, membuat halaman-halaman berikut:
-- 1. Selayang Pandang (About/Overview)
-- 2. Visi & Misi (Vision & Mission)
-- 3. Kurikulum (Curriculum)
-- 4. Program (Programs - Talent Classes & Extracurricular)
-- 5. Beasiswa (Scholarship)
-- 6. Kontak (Contact) - jika belum ada

-- PENTING: Pastikan schema.sql sudah diimport terlebih dahulu!
-- Jika belum, jalankan: mysql -u root -p db_alazhar < database/schema.sql

SET @currentTime = NOW(3);

-- Buat user default jika belum ada user di database
-- Password default: admin123 (HARUS DIUBAH setelah login pertama!)
-- Hash password untuk 'admin123' menggunakan password_hash PHP
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`)
VALUES (
    'user_admin_default_001',
    'admin@alazhar.ac.id',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Administrator',
    'admin',
    @currentTime,
    @currentTime
);

-- Set adminUserId - gunakan user yang sudah ada atau yang baru dibuat
SET @adminUserId = COALESCE(
    (SELECT id FROM User ORDER BY createdAt ASC LIMIT 1),
    'user_admin_default_001'
);

-- ============================================
-- MENU ITEMS
-- ============================================

-- Menu: Beranda (Home)
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_beranda_001', 'Beranda', 'Home', 'beranda', NULL, 1, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Selayang Pandang
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_selayang_002', 'Selayang Pandang', 'About', 'selayang-pandang', NULL, 2, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Visi & Misi
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_visi_misi_003', 'Visi & Misi', 'Vision & Mission', 'visi-misi', NULL, 3, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Kurikulum
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_kurikulum_004', 'Kurikulum', 'Curriculum', 'kurikulum', NULL, 4, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Program
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_program_005', 'Program', 'Programs', 'program', NULL, 5, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Beasiswa
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_beasiswa_006', 'Beasiswa', 'Scholarship', 'beasiswa', NULL, 6, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Menu: Kontak
INSERT INTO `Menu` (`id`, `title`, `titleEn`, `slug`, `parentId`, `order`, `isActive`, `menuType`, `createdAt`, `updatedAt`)
VALUES 
('menu_kontak_007', 'Kontak', 'Contact', 'kontak', NULL, 7, TRUE, 'page', @currentTime, @currentTime)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================
-- PAGES
-- ============================================

-- Page: Selayang Pandang (About/Overview)
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_selayang_001',
    'Selayang Pandang',
    'About',
    'selayang-pandang',
    '<h2>Selayang Pandang</h2>
    <h3>SMA AL AZHAR INSAN CENDEKIA JATIBENING</h3>
    <p>SMA Al Azhar Insan Cendekia Jatibening hadir untuk mempersiapkan generasi yang berkarakter Qur\'ani dan unggul dalam sains dan teknologi. Dengan tagline "Talent, Scholarship, World", sekolah ini mengembangkan potensi siswa (Talent), memberikan kesempatan melanjutkan pendidikan tinggi melalui beasiswa (Scholarship), dan membuka wawasan global yang berlandaskan nilai-nilai Islam dan Al-Qur\'an (World).</p>
    <p>Lingkungan belajar di SMA Al Azhar Insan Cendekia Jatibening mengintegrasikan kecerdasan intelektual dengan keimanan, kreativitas dengan akhlak mulia, serta inovasi dengan tanggung jawab. Berdasarkan Al-Qur\'an dan Sunnah, sekolah ini membimbing siswa untuk tidak hanya kompetitif secara akademik, tetapi juga menjadi individu yang bermanfaat bagi diri sendiri, keluarga, masyarakat, bangsa, dan dunia.</p>',
    '<h2>About</h2>
    <h3>SMA AL AZHAR INSAN CENDEKIA JATIBENING</h3>
    <p>SMA Al Azhar Insan Cendekia Jatibening is here to prepare a generation with Qur\'anic character and excellence in science and technology. With the tagline "Talent, Scholarship, World", this school develops student potential (Talent), provides opportunities to continue higher education through scholarships (Scholarship), and opens global insights based on Islamic values and the Qur\'an (World).</p>
    <p>The learning environment at SMA Al Azhar Insan Cendekia Jatibening integrates intellectual intelligence with faith, creativity with noble character, and innovation with responsibility. Based on the Qur\'an and Sunnah, this school guides students to not only be academically competitive, but also to be beneficial individuals for themselves, their families, the community, the nation, and the world.</p>',
    'SMA Al Azhar Insan Cendekia Jatibening hadir untuk mempersiapkan generasi yang berkarakter Qur\'ani dan unggul dalam sains dan teknologi.',
    'SMA Al Azhar Insan Cendekia Jatibening is here to prepare a generation with Qur\'anic character and excellence in science and technology.',
    NULL,
    'menu_selayang_002',
    'standard',
    NULL,
    'Selayang Pandang - SMA Al Azhar Insan Cendekia Jatibening',
    'SMA Al Azhar Insan Cendekia Jatibening hadir untuk mempersiapkan generasi yang berkarakter Qur\'ani dan unggul dalam sains dan teknologi.',
    'selayang pandang, tentang sekolah, profil sekolah',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Page: Visi & Misi
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_visi_misi_002',
    'Visi & Misi',
    'Vision & Mission',
    'visi-misi',
    '<h2>Visi</h2>
    <p><em>"Menjadi Sekolah Menengah Atas yang unggul dalam membina generasi Qur\'ani, berprestasi, dan berwawasan global, dengan mengintegrasikan nilai-nilai Islam dan Al-Qur\'an dalam pengembangan ilmu pengetahuan, sains, dan teknologi."</em></p>
    
    <h2>Misi</h2>
    <ol>
        <li>Menanamkan nilai-nilai Islam dan akhlak mulia yang bersumber dari Al-Qur\'an dan Sunnah dalam seluruh aspek kehidupan sekolah.</li>
        <li>Menggali, mengembangkan, dan mengarahkan bakat serta potensi siswa agar tumbuh menjadi generasi berkarakter unggul.</li>
        <li>Menyelenggarakan pembelajaran berkualitas yang mendorong prestasi akademik maupun non-akademik.</li>
        <li>Mengintegrasikan penguasaan ilmu pengetahuan, sains, dan teknologi dengan nilai-nilai keislaman.</li>
    </ol>
    
    <h2>Tujuan</h2>
    <ol>
        <li>Memberikan pemahaman kegamaan secara holistik, integratik dan seimbang (Holistic & balanced understanding of religion)</li>
        <li>Mengajarkan kemampuan Tilawah, Tahfidz, Taddabur, Al-Qur\'an dengan baik dan benar dengan capaian hafalan Qur\'an minimal 10 Juz</li>
        <li>Meningkatkan ketrampilan berbahasa asing (foreign language skills), khususnya Bahasa Inggris, Arab dan Mandarin</li>
        <li>Mengembangkan pembelajaran dan lingkungan kampus berbasis IT (IT based currikulum)</li>
        <li>Meningkatkan pemahaman kebangsaan dan budaya jati diri bangsa Indonesia (Civilized & cultured)</li>
        <li>Mewujudkan pendidikan yang melahirkan murid yang qurani, cerdas, berakhlak mulia, dan berwawasan global (Religius & Global mindset)</li>
        <li>Memberikan bekal-bekal keterampilan hidup (Life skill achievement)</li>
    </ol>
    
    <h2>Tagline</h2>
    <p><strong>Talents - Scholarship - World</strong><br>
    <em>(Bakatmu - Beasiswamu - Duniamu)</em></p>',
    '<h2>Vision</h2>
    <p><em>"To become a superior High School in fostering a Qur\'anic, achieving, and globally-minded generation, by integrating Islamic and Qur\'anic values in the development of science and technology."</em></p>
    
    <h2>Mission</h2>
    <ol>
        <li>Instilling Islamic values and noble character sourced from the Qur\'an and Sunnah in all aspects of school life.</li>
        <li>Exploring, developing, and directing students\' talents and potential to grow into a generation of superior character.</li>
        <li>Organizing quality learning that encourages academic and non-academic achievement.</li>
        <li>Integrating mastery of science and technology with Islamic values.</li>
    </ol>
    
    <h2>Objectives</h2>
    <ol>
        <li>Providing a holistic, integrated, and balanced understanding of religion</li>
        <li>Teaching Tilawah, Tahfidz, Taddabur, Al-Qur\'an skills correctly with a minimum Qur\'an memorization of 10 Juz</li>
        <li>Improving foreign language skills, especially English, Arabic, and Mandarin</li>
        <li>Developing IT-based learning and campus environment</li>
        <li>Enhancing understanding of nationalism and Indonesian national identity</li>
        <li>Realizing education that produces Qur\'anic, intelligent, noble-character, and globally-minded students</li>
        <li>Providing life skills</li>
    </ol>
    
    <h2>Tagline</h2>
    <p><strong>Talents - Scholarship - World</strong><br>
    <em>(Your Talent - Your Scholarship - Your World)</em></p>',
    'Visi: Menjadi Sekolah Menengah Atas yang unggul dalam membina generasi Qur\'ani, berprestasi, dan berwawasan global.',
    'Vision: To become a superior High School in fostering a Qur\'anic, achieving, and globally-minded generation.',
    NULL,
    'menu_visi_misi_003',
    'standard',
    NULL,
    'Visi & Misi - SMA Al Azhar Insan Cendekia Jatibening',
    'Visi dan Misi SMA Al Azhar Insan Cendekia Jatibening dalam membina generasi Qur\'ani yang berprestasi dan berwawasan global.',
    'visi, misi, tujuan sekolah, tagline',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Page: Kurikulum
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_kurikulum_003',
    'Kurikulum',
    'Curriculum',
    'kurikulum',
    '<h2>Kurikulum</h2>
    <p>SMA Al Azhar Insan Cendekia Jatibening mengembangkan <strong>Islamic Talent & Global Scholarship Curriculum</strong> (ITGS_Curriculum) yang mengintegrasikan nilai-nilai Islam dan Al-Qur\'an dengan minat siswa dalam sains, teknologi, seni, olahraga, kepemimpinan, literasi digital, dan lainnya. Kurikulum ini dirancang untuk mempersiapkan siswa melanjutkan pendidikan tinggi, baik di dalam maupun luar negeri, melalui beasiswa.</p>
    
    <h3>Komponen Kurikulum:</h3>
    <ol>
        <li><strong>Kurikulum Nasional</strong> - Mengikuti kurikulum nasional yang berlaku</li>
        <li><strong>Kurikulum kekhasan Al-Azhar Insan Cendekia</strong> - Kurikulum khusus yang dikembangkan oleh Al-Azhar Insan Cendekia</li>
        <li><strong>Kurikulum Islam Internasional</strong> - Kurikulum yang mengintegrasikan nilai-nilai Islam dengan standar internasional</li>
    </ol>
    
    <h3>Jam Belajar</h3>
    <ul>
        <li><strong>Senin – Kamis:</strong> Pk. 07.00 – 16.00</li>
        <li><strong>Jum\'at:</strong> Pk. 07.00 – 13.00</li>
        <li><strong>Sabtu:</strong> Opsional
            <ul>
                <li>Pengembangan kelas-kelas talent, ekstrakurikuler</li>
                <li>Remedial & Pengayaan</li>
                <li>Kelas-kelas persiapan lomba, olimpiade, dsb</li>
            </ul>
        </li>
    </ul>',
    '<h2>Curriculum</h2>
    <p>SMA Al Azhar Insan Cendekia Jatibening develops the <strong>Islamic Talent & Global Scholarship Curriculum</strong> (ITGS_Curriculum) that integrates Islamic and Qur\'anic values with student interests in science, technology, arts, sports, leadership, digital literacy, and more. This curriculum is designed to prepare students to continue higher education, both domestically and internationally, through scholarships.</p>
    
    <h3>Curriculum Components:</h3>
    <ol>
        <li><strong>National Curriculum</strong> - Following the applicable national curriculum</li>
        <li><strong>Al-Azhar Insan Cendekia Distinctive Curriculum</strong> - Special curriculum developed by Al-Azhar Insan Cendekia</li>
        <li><strong>International Islamic Curriculum</strong> - Curriculum that integrates Islamic values with international standards</li>
    </ol>
    
    <h3>Study Hours</h3>
    <ul>
        <li><strong>Monday – Thursday:</strong> 07:00 – 16:00</li>
        <li><strong>Friday:</strong> 07:00 – 13:00</li>
        <li><strong>Saturday:</strong> Optional
            <ul>
                <li>Development of talent classes, extracurriculars</li>
                <li>Remedial & Enrichment</li>
                <li>Classes for competition preparation, olympiads, etc.</li>
            </ul>
        </li>
    </ul>',
    'Kurikulum Islamic Talent & Global Scholarship (ITGS) yang mengintegrasikan nilai-nilai Islam dengan sains dan teknologi.',
    'Islamic Talent & Global Scholarship (ITGS) Curriculum that integrates Islamic values with science and technology.',
    NULL,
    'menu_kurikulum_004',
    'academic',
    NULL,
    'Kurikulum - SMA Al Azhar Insan Cendekia Jatibening',
    'Kurikulum Islamic Talent & Global Scholarship (ITGS) SMA Al Azhar Insan Cendekia Jatibening.',
    'kurikulum, kurikulum sekolah, ITGS curriculum',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Page: Program (Talent Classes & Extracurricular)
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_program_004',
    'Program',
    'Programs',
    'program',
    '<h2>Kegiatan Kelas Talent & Ekstrakurikuler</h2>
    
    <h3>1. Penguatan Karakter & Kepemimpinan</h3>
    <ul>
        <li><strong>Leadership Bootcamp</strong> - Pelatihan kepemimpinan berbasis simulasi masalah nyata.</li>
        <li><strong>Studentpreneur Incubator</strong> - Inkubasi bisnis digital untuk siswa.</li>
        <li><strong>Peer Mentoring</strong> - Siswa senior membimbing junior.</li>
    </ul>
    
    <h3>2. Literasi Digital & Teknologi</h3>
    <ul>
        <li><strong>Coding for All</strong> - Dasar pemrograman dan AI untuk semua siswa.</li>
        <li><strong>Virtual Learning Exploration</strong> - Pembelajaran menggunakan VR/AR.</li>
        <li><strong>Cyber Ethics Class</strong> - Edukasi etika digital dan keamanan data.</li>
    </ul>
    
    <h3>3. Kesehatan & Wellbeing</h3>
    <ul>
        <li><strong>Mindfulness Morning</strong> - 10 menit relaksasi sebelum pelajaran.</li>
        <li><strong>Digital Detox Day</strong> - Sehari tanpa gadget di sekolah.</li>
        <li><strong>Smart Health Monitoring</strong> - Pemantauan kesehatan siswa berbasis aplikasi.</li>
    </ul>
    
    <h3>4. Ekspedisi & Pengabdian Masyarakat</h3>
    <ul>
        <li><strong>Green School Project</strong> - Proyek lingkungan berbasis SDGs.</li>
        <li><strong>EduVolunteer</strong> - Siswa mengajar di daerah terpencil.</li>
        <li><strong>Global Cultural Exchange</strong> - Pertukaran budaya virtual dengan sekolah luar negeri.</li>
    </ul>
    
    <h3>5. Seni & Kreativitas</h3>
    <ul>
        <li><strong>Creative Media Lab</strong> - Produksi podcast, film pendek, desain digital.</li>
        <li><strong>Future Art Exhibition</strong> - Pameran karya seni fisik dan digital (termasuk NFT).</li>
        <li><strong>Music & Tech Project</strong> - Menggabungkan musik dengan teknologi AI.</li>
    </ul>
    
    <h2>Program Sukses Tembus Perguruan Tinggi</h2>
    <ul>
        <li>Konsultasi & pendampingan pemilihan program studi</li>
        <li>Seminar & Sosialisasi Program Sukses PTN</li>
        <li>Visiting campus (dalam & luar negeri)</li>
        <li>Jam belajar khusus (Akselerasi Pembelajaran)</li>
        <li>Bimbingan Intensif UTBK, IELTS, SAT</li>
        <li>Pendampingan psikologi, dan spiritual</li>
    </ul>',
    '<h2>Talent Classes & Extracurricular Activities</h2>
    
    <h3>1. Character & Leadership Strengthening</h3>
    <ul>
        <li><strong>Leadership Bootcamp</strong> - Leadership training based on real-world problem simulations.</li>
        <li><strong>Studentpreneur Incubator</strong> - Digital business incubation for students.</li>
        <li><strong>Peer Mentoring</strong> - Senior students mentoring juniors.</li>
    </ul>
    
    <h3>2. Digital Literacy & Technology</h3>
    <ul>
        <li><strong>Coding for All</strong> - Basic programming and AI for all students.</li>
        <li><strong>Virtual Learning Exploration</strong> - Learning using VR/AR.</li>
        <li><strong>Cyber Ethics Class</strong> - Digital ethics and data security education.</li>
    </ul>
    
    <h3>3. Health & Wellbeing</h3>
    <ul>
        <li><strong>Mindfulness Morning</strong> - 10 minutes relaxation before class.</li>
        <li><strong>Digital Detox Day</strong> - A day without gadgets at school.</li>
        <li><strong>Smart Health Monitoring</strong> - App-based student health monitoring.</li>
    </ul>
    
    <h3>4. Expedition & Community Service</h3>
    <ul>
        <li><strong>Green School Project</strong> - SDGs-based environmental project.</li>
        <li><strong>EduVolunteer</strong> - Students teaching in remote areas.</li>
        <li><strong>Global Cultural Exchange</strong> - Virtual cultural exchange with overseas schools.</li>
    </ul>
    
    <h3>5. Arts & Creativity</h3>
    <ul>
        <li><strong>Creative Media Lab</strong> - Podcast production, short films, digital design.</li>
        <li><strong>Future Art Exhibition</strong> - Exhibition of physical and digital art (including NFT).</li>
        <li><strong>Music & Tech Project</strong> - Combining music with AI technology.</li>
    </ul>
    
    <h2>Higher Education Success Program</h2>
    <ul>
        <li>Consultation & guidance for study program selection</li>
        <li>Seminar & Socialization of National University Success Program</li>
        <li>Campus visits (domestic & international)</li>
        <li>Special study hours (Accelerated Learning)</li>
        <li>Intensive guidance for UTBK, IELTS, SAT</li>
        <li>Psychological and spiritual guidance</li>
    </ul>',
    'Program kelas talent dan ekstrakurikuler yang mengembangkan potensi siswa dalam berbagai bidang.',
    'Talent classes and extracurricular programs that develop student potential in various fields.',
    NULL,
    'menu_program_005',
    'program',
    NULL,
    'Program - SMA Al Azhar Insan Cendekia Jatibening',
    'Program kelas talent, ekstrakurikuler, dan program sukses tembus perguruan tinggi.',
    'program sekolah, kelas talent, ekstrakurikuler',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Page: Beasiswa
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_beasiswa_005',
    'Beasiswa',
    'Scholarship',
    'beasiswa',
    '<h2>Program Beasiswa</h2>
    <p>Program beasiswa di SMA Al Azhar Insan Cendekia Jatibening memberikan kesempatan kepada siswa untuk mendapatkan beasiswa dalam melanjutkan pendidikan tinggi, baik di dalam maupun luar negeri. Siswa akan dibimbing sepanjang masa sekolahnya untuk memilih dan mempersiapkan persyaratan administrasi dan akademik untuk program studi pilihan mereka.</p>
    
    <p>Program ini merupakan bagian dari komitmen sekolah untuk mendukung siswa berprestasi dan berpotensi tinggi dalam meraih cita-cita pendidikan mereka, dengan tagline <strong>"Talents - Scholarship - World"</strong> yang mencerminkan bahwa beasiswa adalah jembatan menuju dunia yang lebih luas bagi siswa yang memiliki bakat dan prestasi.</p>',
    '<h2>Scholarship Program</h2>
    <p>The scholarship program at SMA Al Azhar Insan Cendekia Jatibening provides opportunities for students to receive scholarships to continue their higher education, both domestically and internationally. Students will be guided throughout their schooling to select and prepare administrative and academic requirements for their chosen study programs.</p>
    
    <p>This program is part of the school\'s commitment to support high-achieving and high-potential students in achieving their educational aspirations, with the tagline <strong>"Talents - Scholarship - World"</strong> reflecting that scholarships are a bridge to a wider world for students with talent and achievement.</p>',
    'Program beasiswa untuk melanjutkan pendidikan tinggi di dalam dan luar negeri.',
    'Scholarship program to continue higher education domestically and internationally.',
    NULL,
    'menu_beasiswa_006',
    'program',
    NULL,
    'Beasiswa - SMA Al Azhar Insan Cendekia Jatibening',
    'Program beasiswa untuk melanjutkan pendidikan tinggi di dalam dan luar negeri.',
    'beasiswa, program beasiswa, scholarship',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Page: Kontak (Contact) - Update jika sudah ada atau insert jika belum
INSERT INTO `Page` (
    `id`, `title`, `titleEn`, `slug`, `content`, `contentEn`, `excerpt`, `excerptEn`, 
    `featuredImage`, `menuId`, `pageType`, `template`, `seoTitle`, `seoDescription`, 
    `seoKeywords`, `isPublished`, `publishedAt`, `authorId`, `createdAt`, `updatedAt`
)
VALUES (
    'page_kontak_006',
    'Kontak',
    'Contact',
    'kontak',
    '<h2>Kontak Kami</h2>
    <h3>SMA AL AZHAR INSAN CENDEKIA JATIBENING</h3>
    
    <p><strong>Alamat:</strong><br>
    Jl. Jatibening No. 1 Blok 1, RT. 001 RW. 003<br>
    Jatibening Baru, Kec. Pondok Gede<br>
    Kota Bekasi, Jawa Barat 17412</p>
    
    <p><strong>Kontak:</strong><br>
    <strong>PIC:</strong><br>
    Ibu Riry: 0813 9928 3035<br>
    Ibu Retno: 021-8491296</p>
    
    <p><strong>Didirikan dan dikelola oleh:</strong><br>
    YAYASAN AL-AZHAR INSAN CENDEKIA MADANI</p>',
    '<h2>Contact Us</h2>
    <h3>SMA AL AZHAR INSAN CENDEKIA JATIBENING</h3>
    
    <p><strong>Address:</strong><br>
    Jl. Jatibening No. 1 Blok 1, RT. 001 RW. 003<br>
    Jatibening Baru, Kec. Pondok Gede<br>
    Bekasi City, West Java 17412</p>
    
    <p><strong>Contact:</strong><br>
    <strong>PIC:</strong><br>
    Ibu Riry: 0813 9928 3035<br>
    Ibu Retno: 021-8491296</p>
    
    <p><strong>Founded and managed by:</strong><br>
    YAYASAN AL-AZHAR INSAN CENDEKIA MADANI</p>',
    'Hubungi kami di SMA Al Azhar Insan Cendekia Jatibening untuk informasi lebih lanjut.',
    'Contact us at SMA Al Azhar Insan Cendekia Jatibening for more information.',
    NULL,
    'menu_kontak_007',
    'standard',
    NULL,
    'Kontak - SMA Al Azhar Insan Cendekia Jatibening',
    'Hubungi SMA Al Azhar Insan Cendekia Jatibening untuk informasi pendaftaran dan program sekolah.',
    'kontak, alamat sekolah, contact',
    TRUE,
    @currentTime,
    @adminUserId,
    @currentTime,
    @currentTime
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

