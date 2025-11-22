import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#227ac24c] hidden sm:block px-10 w-full text-white pt-2 md:pt-10 pb-5">
      <div className="w-full mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">

        {/* Logo + Mô tả */}
        <div className="space-y-3 hidden md:block">
          <img src="/Logo.webp" alt="Iruka Kids Logo" className="w-24" />
        </div>

        {/* Links nhanh */}
        <div>
          <h3 className="font-semibold text-white mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm flex justify-start gap-3 md:block">
            <li><Link href="/" className="hover:text-pink-500 transition">Trang chủ</Link></li>
            <li><Link href="/introduce" className="hover:text-pink-500 transition">Giới thiệu</Link></li>
            <li><Link href="/courses" className="hover:text-pink-500 transition">Khóa học</Link></li>
            <li><Link href="/contact" className="hover:text-pink-500 transition">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="font-semibold text-white mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm flex justify-start gap-3 md:block">
            <li><Link href="/faq" className="hover:text-pink-500 transition">Câu hỏi thường gặp</Link></li>
            <li><Link href="/help" className="hover:text-pink-500 transition">Trợ giúp</Link></li>
            <li><Link href="/policy" className="hover:text-pink-500 transition">Chính sách</Link></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="font-semibold text-white mb-3">Kết nối với chúng tôi</h3>
          <div className="flex gap-3">
            <Link href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-500 hover:text-blue-500 hover:bg-[#ddd] transition">
              <FaFacebookF />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-pink-500 hover:text-pink-500 hover:bg-[#ddd] transition">
              <FaInstagram />
            </Link>
            <Link href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-red-500 hover:text-red-500 hover:bg-[#ddd] transition">
              <FaYoutube />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-400 hover:text-blue-400 hover:bg-[#ddd] transition">
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-1 md:mt-8 border-t border-gray-200 pt-4">
        © 2025 IruKa Edu. All rights reserved.
      </div>
    </footer>
  );
}
