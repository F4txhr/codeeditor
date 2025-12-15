# codeEditor-x Roadmap

Dokumen ini jadi sumber kebenaran (single source of truth) untuk pengembangan **web IDE** kita.  
Gunakan checklist ini untuk melacak progres. Tanda yang dipakai:

- `[ ]` = belum dikerjakan
- `[x]` = sudah selesai
- `[~]` = sebagian/masih WIP
- Bisa beri komentar di bawah tiap bagian untuk catatan / revisi

---

## 0. Pondasi Proyek

- [x] Setup project frontend
  - [x] Inisialisasi Vite + React
  - [x] Install Monaco Editor
  - [x] Struktur folder dasar (`src/`, `components/`, `features/`, dll.)
- [~] Model data dasar
  - [~] Struktur `WorkspaceState` (files, tabs, layout) — sementara: files map + activePath
  - [ ] Persist workspace ke `localStorage` / IndexedDB
- [x] Layout utama
  - [x] Frame 3-bagian: Sidebar (Explorer) · Editor · Bottom/Status

---

## 1. Penjelajah Berkas/Proyek (Explorer + Git visual + Sort/Filter)

### 1.1 Tree & operasi dasar

- [x] Tree file/folder
  - [x] Representasi struktur folder dari path string (mis. `src/components/Button.jsx`)
  - [x] Expand/collapse folder
- [x] Operasi file/folder
  - [x] New file
  - [x] New folder
  - [x] Rename
  - [x] Delete (dengan konfirmasi)
- [x] Ikon tipe berkas
  - [x] Ikon berbeda untuk folder vs file
  - [x] Ikon khusus per ekstensi (JS/TS/CSS/JSON/MD, dll.)

### 1.2 Mode tampilan & UX

- [~] Mode tampilan
  - [x] List compact
  - [ ] List detail (nama + last modified + size)
  - [ ] (opsional) Grid visual
- [x] Sort & filter
  - [x] Sort by nama (A–Z)
  - [x] Sort by last modified
  - [x] Sort by type (berdasarkan ekstensi)
  - [x] Filter by ekstensi (mis. hanya `.js`, `.ts`, dst.)
- [x] Integrasi Git (visual dulu)
  - [x] Field `gitStatus` per file (`modified`, `added`, `untracked`, `conflict`, dll.)
  - [x] Badge/warna ikon sesuai status git
  - [x] Panel ringkasan status (jumlah modified, added, dst.)

---

## 2. Editor Kode (Monaco + Workspace + Linting + Preview)

### 2.1 Editor utama

- [ ] Integrasi Monaco Editor
  - [ ] Syntax highlight multi-bahasa (JS, TS, CSS, HTML, JSON, MD)
  - [ ] Auto-complete default Monaco
  - [ ] Opsi editor (font, minimap, wrapping, dsb.)
- [ ] Toolbar editor
  - [ ] Undo / Redo
  - [ ] Save
  - [ ] Toggle word wrap
  - [ ] Format document (placeholder dulu)

### 2.2 Tab & workspace

- [ ] Tabs
  - [ ] Tab untuk tiap file terbuka
  - [ ] Close tab
  - [ ] Indikator unsaved di tab (`●`)
- [ ] Split view
  - [ ] Split horizontal (atas/bawah)
  - [ ] Split vertikal (kiri/kanan)
  - [ ] Simpan layout per workspace

### 2.3 Linting, debug, preview, history, AI

- [~] Linting / static analysis
  - [x] Integrasi marker Monaco (`setModelMarkers`)
  - [x] Dummy rule sederhana (mis. larang `console.log`, tandai TODO, eval)
  - [x] Panel daftar error/warning per file
- [ ] Debugger (layout & hook awal)
  - [ ] Panel breakpoint, stack, variables
  - [ ] Tombol run / step (wire ke mock engine dulu)
- [ ] Preview terintegrasi
  - [ ] Markdown → HTML preview
  - [ ] HTML/CSS → iframe preview
- [ ] History / revision
  - [ ] Snapshot konten tiap save (timestamp)
  - [ ] Panel daftar revisi
  - [ ] Diff view dasar dan tombol restore
- [ ] AI assistant (hook)
  - [ ] UI tombol/overlay AI di editor
  - [ ] API hook (belum perlu backend dulu, bisa dummy response)

---

## 3. Terminal & Konsol + Integrasi Database

### 3.1 Terminal

- [ ] UI terminal
  - [ ] Output scrollable, background gelap, font monospaced
  - [ ] Input bar bawah, riwayat command
- [ ] Mesin command (mock)
  - [ ] Perintah dasar: `help`, `clear`, `echo`
  - [ ] Eksekusi script sederhana (simulasi run file)

### 3.2 Integrasi DB

- [ ] DB Explorer
  - [ ] Tree database → schema → table/view
  - [ ] Klik table → tampil data dalam grid
- [ ] SQL console
  - [ ] Input query SQL
  - [ ] Hasil kueri di area output (tabular)
- [ ] Integrasi dengan terminal
  - [ ] Command `db` atau `sql` dari terminal membuka kueri di panel DB

---

## 4. Pengaturan Aplikasi (Settings, Theme, Keybindings, Languages)

- [ ] Layout Settings
  - [ ] Sidebar kategori (General, Editor, Theme, Keybindings, Languages, dsb.)
  - [ ] Konten kanan dinamis
- [ ] Keybindings
  - [ ] Daftar aksi + shortcut
  - [ ] Remap shortcut (deteksi key combo)
- [ ] Theme customization
  - [ ] Pilih warna aksen, background, text, font
  - [ ] Preview live
  - [ ] Export / import theme (file JSON)
- [ ] Manajemen bahasa & runtime
  - [ ] List bahasa (JS, TS, Python, dll.)
  - [ ] Konfigurasi path runtime/kompiler (dummy dulu)
  - [ ] Pilih versi runtime per proyek

---

## 5. Git Management

- [ ] Panel Git
  - [ ] Status repo (branch, ahead/behind, dsb.)
  - [ ] Staged / unstaged changes
  - [ ] Commit message + tombol Commit
- [ ] Aksi Git
  - [ ] Stage / unstage file
  - [ ] Commit
  - [ ] Fetch / pull / push (mock dulu)
- [ ] Integrasi dengan Explorer
  - [ ] Klik file di panel Git membuka file di editor
  - [ ] Diff view terhadap HEAD

---

## 6. Marketplace Ekstensi

- [ ] UI Marketplace
  - [ ] List ekstensi (nama, deskripsi, rating, tombol Install)
  - [ ] Search & filter by kategori
- [ ] Manajemen ekstensi lokal
  - [ ] List ekstensi terinstal
  - [ ] Enable/disable, uninstall
- [ ] Hook plugin
  - [ ] API dasar untuk ekstensi (register command, contribute panel, dsb.)

---

## 7. Manajemen Proyek & EditorConfig

- [ ] Multi-folder workspace
  - [ ] Buka beberapa folder dalam satu workspace
  - [ ] Panel untuk switch workspace
- [ ] Pengaturan lingkungan per proyek
  - [ ] Versi bahasa, runtime path, env var, build scripts
- [ ] EditorConfig
  - [ ] Buat file `.editorconfig` dari UI
  - [ ] Edit properti (indent size, line endings, charset, dsb.)

---

## 8. Manajer Dependensi

- [ ] UI dependensi
  - [ ] List dependensi terinstal (nama, versi, type: npm/pip/gradle)
  - [ ] Search & add dependency
  - [ ] Update / remove
- [ ] Integrasi dengan terminal
  - [ ] Tampilkan command yang dijalankan (mis. `npm install xxx`)

---

## 9. Plugin Manager & Visual Plugin Editor

- [ ] Manajemen plugin
  - [ ] List plugin (nama, versi, status)
  - [ ] Create, edit, enable/disable
  - [ ] Search dan filter
- [ ] Detail plugin
  - [ ] Deskripsi, kompatibilitas, log/keluaran plugin
  - [ ] Import/export plugin
- [ ] Visual Plugin Editor
  - [ ] Canvas / builder drag-and-drop
  - [ ] Definisi trigger, action, UI modifications
  - [ ] Preview realtime + validasi konfigurasi

---

## 10. Cloud Sync & CI/CD

### 10.1 Cloud Sync

- [ ] Pilih provider (Google Drive, OneDrive, dll.)
- [ ] Toggle sync on/off
- [ ] Pilih apa yang disinkronkan (proyek, settings, theme)
- [ ] Status sync terakhir & penanganan konflik (UI)

### 10.2 CI/CD Integration

- [ ] Konfigurasi koneksi CI/CD (GitHub Actions, GitLab CI, dsb.)
- [ ] Panel status build
  - [ ] List pipeline
  - [ ] Status (success, failed, running)
  - [ ] Log build (tail & detail)

---

## 11. DB Explorer (lanjutan), Search Global, Credentials, Log Viewer

- [ ] DB Explorer lanjutan
  - [ ] Sorting/filtering di grid data
  - [ ] `Open in Terminal` untuk table/DB terpilih
- [ ] Global Search & Replace
  - [ ] Search di seluruh proyek (peka huruf besar/kecil, regex)
  - [ ] Replace per-file atau global
  - [ ] Export hasil ke TXT/CSV/JSON
- [ ] Credential & API Manager
  - [ ] Simpan credential & API key terenkripsi
  - [ ] UI untuk tambah/edit/hapus, dukungan proteksi (PIN/biometrik di app nanti)
- [ ] Log Viewer
  - [ ] Panel log aplikasi
  - [ ] Filter per level (info/warn/error) dan source
  - [ ] Search di log

---

## 12. Fitur Tambahan & Aksesibilitas

- [ ] Dukungan hardware eksternal
  - [ ] Keyboard fisik (shortcut penuh)
  - [ ] Mouse/trackpad
- [ ] Alat dev web/UI
  - [ ] Inspector elemen web (semacam mini DevTools)
  - [ ] Konsol JavaScript terintegrasi dengan preview
- [ ] Produktivitas lanjutan
  - [ ] Todo list internal
  - [ ] Penjadwal skrip otomatis
- [ ] Offline & sync konflik
  - [ ] Offline-first untuk fungsi inti
  - [ ] Resolusi konflik sync
- [ ] Integrasi komunitas
  - [ ] Forum/dukungan dalam aplikasi
  - [ ] Berbagi snippet/proyek
- [ ] Aksesibilitas
  - [ ] Dukungan screen reader
  - [ ] Ukuran font dinamis & mode kontras tinggi

---

## Catatan Progres

Tuliskan progres di sini, contoh:

- 2025-12-14 — [ ] Tahap 0 dimulai, setup Vite + React belum dibuat
- 2025-12-15 — [x] Setup Vite + React + Monaco; [ ] Layout utama belum lengkap