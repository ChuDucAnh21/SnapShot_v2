'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';
// ... import nội bộ khác ở dưới
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaFacebookSquare, FaGithub, FaGoogle, FaPhoneAlt, FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeOutline, IoKey } from 'react-icons/io5';
import { OnboardSvg } from '@/assets';

import { useToast } from '@/components/toast/ToastMessage';

type RegisterPayload = {
  phone: string;
  password: string;
};

export default function LoginClient(): JSX.Element {
  const [phone, setPhone] = useState<string>('');
  const [password, setPassWord] = useState<string>('');
  const [show, setShow] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: RegisterPayload = {
      phone,
      password,
    };
    console.warn('register payload', payload);
    router.push('/listChild');
    showToast('Đăng ký tạm thời chưa liên kết API', 'info');
  };

  return (
    <div className="min-h-screen bg-[url('/bgLogin.svg')] bg-cover bg-center bg-no-repeat px-5 py-10 text-black">
      <div className="sm:hidden">

        <Image
          src="/Logo.webp"
          alt="Logo"
          width={120} // hoặc width bạn muốn
          height={120}
          className="relative top-6 z-10 m-auto"
          // Các props khác nếu cần
        />
      </div>
      <div className="relative mx-auto flex  min-h-[600px] max-w-5xl flex-col-reverse items-center justify-center rounded-md bg-white p-6 shadow-lg backdrop-blur sm:gap-8 lg:flex-row-reverse lg:items-stretch">

        <aside className=" hidden w-full flex-1 flex-col gap-6 bg-white/10  p-6  md:p-8 lg:flex">

          <Image
            src={OnboardSvg}
            alt="Iruka logo"
            width={420}
            height={368}
            className="relative top-6 z-10 m-auto"

          />
        </aside>

        <div className="flex w-full flex-2 flex-col justify-center ">

          <h2 className="mb-4 text-center text-[32px] font-bold text-blue-500">Đăng nhập</h2>

          <form onSubmit={handleLogin} className=" flex flex-col gap-3">

            <label className="flex flex-col gap-1 text-[16px]  text-black">
              <p className="flex items-center font-medium gap-2">
                <FaPhoneAlt />
                Số điện thoại
              </p>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
                autoComplete="off"
                placeholder="Nhập số điện thoại"
                required
                className="h-[56px] rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="relative mt-[24px] flex flex-col gap-1 text-[16px] text-black">
              <p className="flex items-center font-medium gap-2">
                <IoKey />
                Mật khẩu
              </p>

              <div className="relative w-full">
                <input
                  value={password}
                  onChange={e => setPassWord(e.target.value)}
                  type={show ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  autoComplete="new-password"
                  required
                  className="h-[56px] w-full rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 pr-12 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                />

                {/* Icon con mắt */}
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600"
                >
                  {show
                    ? (
                      <IoEyeOutline size={20} />

                    )
                    : (
                      <FaRegEyeSlash size={20} />
                    )}
                </button>
              </div>
            </label>

            <div className="flex font-medium  cursor-pointer justify-end text-[16px] hover:underline">Quên mật khẩu ?</div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"

              className="lg:h-[56px] mt-3 cursor-pointer rounded-lg bg-[#FF6FAE] px-4 py-3 text-[18px] font-bold text-white shadow-lg shadow-pink-900/30 transition hover:opacity-90 md:col-span-2"
            >
              Đăng nhập
            </motion.button>
          </form>

          <div className="flex flex-col items-center">
            <div className="mt-4 font-medium text-[16px]">Tiếp tục với</div>
            <ul className="mt-3 flex gap-3">
              <li className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-white shadow-lg hover:bg-[#cccccc65]">
                <FaGoogle className="text-[20px] text-black" />
              </li>
              <li className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-white shadow-lg hover:bg-[#cccccc65]">
                <FaFacebookSquare className="text-[20px] text-blue-500" />
              </li>
              <li className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-white shadow-lg hover:bg-[#cccccc65]">
                <FaGithub className="text-[20px] text-black" />
              </li>

            </ul>
          </div>

          <p className="mt-4 flex justify-center font-medium text-[16px]  text-black">
            Bạn chưa có tài khoản ?
            {' '}
            <Link href="/register" className="ml-2 font-bold text-blue-500 underline-offset-2 hover:underline">
              Đăng kí ngay

            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
