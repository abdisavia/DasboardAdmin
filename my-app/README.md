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
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID = 
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 
NEXT_PUBLIC_FIREBASE_APP_ID = 
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID =
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

demikian aplikasi yang saya buat sebagai test junior Frontend developer di PT.Summit Global Teknologi apabila banyak kekurangan saya ucapkan terimakasih 