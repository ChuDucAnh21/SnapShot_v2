'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaBirthdayCake, FaPhoneAlt, FaRegEyeSlash, FaUser } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoEyeOutline, IoKey } from 'react-icons/io5';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { Onboard4Svg } from '@/assets';
import { useToast } from '@/components/toast/ToastMessage';
import { validateForm } from '../validateForm';

type RegisterPayload = {
  phone: string;
  password: string;
  confimPassword: string;
  fullname: string;
  gender: string;
  birthday: string;
};

export default function RegisterClient(): JSX.Element {
  const [phone, setPhone] = useState<string>('');
  const [password, setPassWord] = useState<string>('');
  const [confimPassword, setConfirmPassword] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: RegisterPayload = {
      phone,
      password,
      confimPassword,
      fullname,
      gender,
      birthday,
    };

    const err = validateForm(payload, 'register');

    if (Object.keys(err).length === 0) {
      try {
        // const dataRes = await AuthService.registerApiUser(payload)
        // // console.log(dataRes)
        // showToast(dataRes.message)
        router.push('/login-v2');
        showToast('Đăng ký tạm thời chưa liên kết API', 'info');
      } catch (error) {
        console.error('error register', error);
      }
    } else {
      for (const key in err) {
        if (Object.prototype.hasOwnProperty.call(err, key)) {
          showToast((err as any)[key], 'error');
        }
      }
    }

    // TODO: gọi AuthService => showToast => router.push("/login")
  };

  return (
    <div className="min-h-screen bg-[url('/bgLogin.svg')] bg-cover bg-center bg-no-repeat px-5 py-10 text-black">
      <div className="mx-auto flex min-h-[600px] max-w-5xl flex-col-reverse gap-8 rounded-md bg-white p-5 shadow-2xl backdrop-blur lg:flex-row-reverse lg:items-stretch">

        <aside className=" hidden flex-1 flex-col gap-6 rounded-md bg-white p-6  md:p-8 lg:flex">
          <Image
            src={Onboard4Svg}
            alt="Iruka logo"
            width={420}
            height={368}
            className="mb-4"
          />

        </aside>

        <div className="flex w-full flex-2 flex-col justify-center">
          <h2 className="relative mb-[24px] text-center text-[32px]  font-bold text-blue-500">

            <FaArrowLeftLong onClick={() => router.back()} className=" absolute top-4 block cursor-pointer text-[24px] hover:opacity-50 md:hidden" />
            Đăng ký
          </h2>
          <form onSubmit={handleRegister} className="grid gap-x-[32px] gap-y-[24px] md:grid-cols-2">
            <label className="flex flex-col font-medium gap-1 text-[16px] text-black md:col-start-1  md:col-end-3">
              <p className="flex items-center gap-2">
                <FaUser />
                Họ và tên
              </p>
              <input
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                type="text"
                placeholder="Nhập họ tên"
                required
                className="h-[56px] rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none "
              />
            </label>

            <label className="flex flex-col gap-1 text-[16px] text-black md:col-start-1  md:col-end-3">

              <p className="flex items-center gap-2 font-medium">
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
                className="h-[56px] rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none "
              />
            </label>

            <label className="flex flex-col gap-1 text-[16px]  text-black">

              <p className="flex items-center gap-2 font-medium">
                <FaBirthdayCake />
                Ngày sinh
              </p>
              <input
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                type="date"
                required
                className="custom-date-icon h-[56px] rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 text-black transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none "
              />
            </label>
            {/* Giới tính */}
            <label className="flex flex-col gap-1 text-[16px]  text-black">

              <p className="flex items-center gap-2 font-medium">
                <PiGenderIntersexBold />
                Giới tính
              </p>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className=" h-[56px] rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none

                  "
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </label>

            {/* Mật khẩu */}
            <label className="relative flex  flex-col gap-1 text-[16px] text-black">
              <p className="flex items-center gap-2 font-medium">
                <IoKey />
                Mật khẩu
              </p>

              <div className="relative w-full">
                <input
                  value={password}
                  onChange={e => setPassWord(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  autoComplete="new-password"
                  required
                  className="h-[56px] w-full rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 pr-12 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                />

                {/* Icon con mắt */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600"
                >
                  {showPass
                    ? (
                      <IoEyeOutline size={20} />

                    )
                    : (
                      <FaRegEyeSlash size={20} />
                    )}
                </button>
              </div>
            </label>

            {/* Nhập lại mật khẩu */}
            <label className="relative flex  flex-col gap-1 text-[16px] text-black">

              <p className="flex items-center gap-2 font-medium">
                <IoKey />
                Xác nhận mật khẩu
              </p>
              <div className="relative w-full">
                <input
                  value={confimPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showPassConfirm ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  required
                  className="h-[56px] w-full rounded-lg border border-white/50 bg-[#F4F4F4] px-4 py-3 pr-12 text-gray-900 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                />

                {/* Icon con mắt */}
                <button
                  type="button"
                  onClick={() => setShowPassConfirm(!showPassConfirm)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600"
                >
                  {showPassConfirm
                    ? (
                      <IoEyeOutline size={20} />

                    )
                    : (
                      <FaRegEyeSlash size={20} />
                    )}
                </button>
              </div>
            </label>

            <div className="flex flex-col gap-2 text-[16px] text-black md:col-span-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required

                  className="mt-1 h-4 w-4 cursor-pointer border accent-[#ccc] focus:ring-0 "

                />
                <p className="font-medium">
                  Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Iruka.
                  {/* <span className="font-medium text-black text-[16px]">Điều khoản dịch vụ</span> và{" "}
                  <span className="font-medium text-black">Chính sách bảo mật</span> của Iruka. */}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"

              className="lg:h-[56px] cursor-pointer rounded-lg bg-[#FF6FAE] px-4 py-3 text-[18px] font-bold text-white shadow-lg shadow-pink-900/30 transition hover:opacity-90 md:col-span-2"
            >
              Đăng ký
            </motion.button>
          </form>

          <div className="flex justify-center">
            <p className="mt-4 font-medium text-[16px] text-black/80">
              Đã có tài khoản?
              {' '}
              <Link href="/login-v2" className="font-bold text-blue-500 underline-offset-2 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
