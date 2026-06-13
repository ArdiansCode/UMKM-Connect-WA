import './globals.css';

export const metadata = {
  title: 'UMKM Connect WA',
  description: 'Aplikasi UMKM WhatsApp terintegrasi - Daftarkan bisnis UMKM Anda',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
