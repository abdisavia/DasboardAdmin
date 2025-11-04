# Technical Test Junior FE Support Be

Frontend apps untuk aplikasi Technical Test Junior FE Support Be yang dibangun dengan framework NextJS dengan beberapa library tambahan seperti zod, ant-design, firebase (authentikasi) dll.

## Persyaratan Sistem

- Node.js (versi 20 atau lebih tinggi)
- npm atau yarn

## Instalasi

### Install dependencies
Gunakan salah satu perintah berikut:

```bash
# Menggunakan yarn (disarankan)
yarn install

# Atau menggunakan npm
npm install
```

## Konfigurasi Environment

Konfigurasi Environment hanya berlaku jika menjalankan be dengan Mode Development (Dengan Firebase Authentication).

Buat file `.env` di root direktori project dan isi dengan konfigurasi Firebase yang diperlukan:

```env
WEB_FIREBASE_WEB_TYPE=""
WEB_FIREBASE_WEB_PROJECT_ID=""
WEB_FIREBASE_WEB_PRIVATE_KEY_ID=""
WEB_FIREBASE_WEB_PRIVATE_KEY=""
WEB_FIREBASE_WEB_CLIENT_EMAIL=""
WEB_FIREBASE_WEB_CLIENT_ID=""
WEB_FIREBASE_WEB_AUTH_URI=""
WEB_FIREBASE_WEB_TOKEN_URI=""
WEB_FIREBASE_WEB_AUTH_PROVIDER_X509_CERT_URL=""
WEB_FIREBASE_WEB_CLIENT_X509_CERT_URL=""
```

## Menjalankan Aplikasi

### Mode Development (Tanpa Firebase Authentication)
```bash
# Menggunakan yarn
yarn dev

# Atau menggunakan npm
npm run dev
```

Server akan berjalan di `http://localhost:3000`


### Penutup
hasil dari aplikasi yang saya buat ini masih memiliki banyak bug dan banyak sekali hal - hal yang masih bisa diimprove. saya merasa sedikit puas walaupun dari segi visual maupun beberapa fungsi seperti protected page, konfirmasi modal, validasi form belum sempat saya tambahkan. 

namun secara keseluruhan saya tetap senang karena sudah bisa mengimplementasikan update, read, delete, serta membuat search dengan debounce yang baru pertama kali saya buat. 

demikian hasil karya saya apabila banyak kekurangan saya ucapkan terimakasih 