import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BJJ 대회 일정',
  description: '주짓수 대회 일정을 한 곳에서!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link href="/" className="logo">
                BJJ 대회 캘린더
              </Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="small">© {new Date().getFullYear()} BJJ 대회 정보</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
