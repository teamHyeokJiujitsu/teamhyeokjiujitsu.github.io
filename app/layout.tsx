import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'BJJ 소식 • 대회 정보',
  description: '주짓수 뉴스와 대회 일정을 한 곳에서!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link href="/">홈</Link>
              <Link href="/news/">뉴스</Link>
              <Link href="/events/">대회</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="small">© {new Date().getFullYear()} BJJ 커뮤니티 소식</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
