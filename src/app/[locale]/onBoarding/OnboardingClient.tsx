'use client';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Onboard1Svg, Onboard2Svg, Onboard3Svg, Onboard4Svg, Onboard5Svg, OnboardSvg } from '@/assets';
import Footer from '@/components/footer/Footer';

import 'swiper/css';
import 'swiper/css/pagination';

/* ---------------- ANIMATION VARIANTS ---------------- */
const fadeStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      duration: 0.4,
    },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function OnBoardingClient() {
  const router = useRouter();
  const [isStart, setIsStart] = useState(false);

  // State to control header visibility based on scroll direction
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollTop = useRef(0);

  const handleStart = () => {
    router.push('/login-v2');
  };

  // Splash screen → 2s → vào onboarding
  useEffect(() => {
    const timer = setTimeout(() => setIsStart(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener to hide header on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop.current && scrollTop > 50) {
        // Scrolling down and past 50px → hide header
        setShowHeader(false);
      } else if (scrollTop < lastScrollTop.current) {
        // Scrolling up → show header
        setShowHeader(true);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* --------------------------------------------- */
  /* SPLASH SCREEN WITH FADE-IN                     */
  /* --------------------------------------------- */
  if (!isStart) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="flex min-h-screen flex-col items-center justify-center
                   bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: 'url(\'/bgOnboarding.svg\')' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image src="/Logo_text.webp" alt="Iruka logo" width={180} height={70} />
        </motion.div>
      </motion.div>
    );
  }

  /* ------------------------------------------------ */
  /* MAIN ONBOARDING PAGE - FADE IN ALL SCREEN       */
  /* ------------------------------------------------ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex pt-20 sm:pt-0 min-h-screen flex-col items-center
                 bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: 'url(\'/bgOnboarding.svg\')' }}
    >
      {/* HEADER */}
      {showHeader && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="fixed z-50 hidden w-full h-[100px] items-center justify-between
                     bg-[#3e9be343] px-[30px] py-6 sm:flex lg:px-[100px]"
        >
          <Image src="/Logo_text.webp" alt="Iruka logo" width={120} height={70} />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex h-[64px] w-[280px] cursor-pointer items-center
                       justify-center rounded-md bg-[#0090E0] hover:opacity-90"
          >
            <span className="text-[18px] font-medium">Trải nghiệm ngay</span>
            <FaArrowRightLong className="ml-2 text-[20px] relative top-[1px]" />
          </motion.button>
        </motion.header>
      )}

      {/* ----------------------------- */}
      {/* 📱 MOBILE – SWIPER CAROUSEL */}
      {/* ----------------------------- */}
      <div className="block w-full pt-[20px] sm:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <MobileSlide img={OnboardSvg} title="Cùng bé, học mà chơi, chơi mà học" />
          </SwiperSlide>

          <SwiperSlide>
            <MobileSlide
              img={Onboard4Svg}
              title="Miễn phí, vui nhộn, mang lại hiệu quả"
              text="Học cùng Iruka rất vui nhộn, các nghiên cứu đã chứng minh ứng dụng thật sự hiệu quả!"
            />
          </SwiperSlide>

          <SwiperSlide>
            <MobileSlide
              img={Onboard3Svg}
              title="Cá nhân hóa trải nghiệm học tập"
              text="Học cùng Iruka rất vui nhộn, hiệu quả và thú vị!"
            />
          </SwiperSlide>

          <SwiperSlide>
            <MobileSlide
              img={Onboard2Svg}
              title="Dựa trên căn cứ khoa học"
              text="Bài học được tối ưu dựa trên nghiên cứu giáo dục hiện đại!"
            />
          </SwiperSlide>

          <SwiperSlide>
            <MobileSlide
              img={Onboard1Svg}
              title="Giúp bé phát triển toàn diện"
              text="Học vui – hiệu quả – tăng tư duy!"
            />
          </SwiperSlide>
        </Swiper>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleStart}
          className="mx-auto mt-8 flex h-[64px] w-[70%] cursor-pointer
                     items-center justify-center rounded-md bg-[#0090E0]
                     hover:opacity-90"
        >
          <span className="text-[18px] font-medium">Trải nghiệm ngay</span>
          <FaArrowRightLong className="ml-2 text-[20px] relative top-[1px]" />
        </motion.button>
      </div>

      {/* ----------------------------- */}
      {/* 💻 DESKTOP VERSION */}
      {/* ----------------------------- */}
      <main className="mt-40 hidden w-[90%] px-6 pb-12 sm:block">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeStagger}
          className="mt-4 mb-8 text-center"
        >
          <div className="flex flex-wrap items-center justify-between gap-10 lg:flex-nowrap">
            <motion.div variants={fadeItem}>
              <Image
                height={350}
                width={300}
                className="h-[350px] w-[300px] lg:h-[500px] lg:w-[480px]"
                src={OnboardSvg}
                alt=""
              />
            </motion.div>

            <motion.div variants={fadeItem} className="flex flex-col lg:basis-[604px]">
              <h4 className="mb-4 text-left text-[36px] font-semibold lg:text-[48px]">
                Cùng bé, học mà chơi, chơi mà học
              </h4>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="flex h-[64px] w-[280px] cursor-pointer
                           items-center justify-center rounded-md bg-[#0090E0]
                           hover:opacity-90"
              >
                <span className="text-[18px] font-medium">Trải nghiệm ngay</span>
                <FaArrowRightLong className="ml-2 text-[20px] relative top-[1px]" />
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Feature list */}
        <section className="space-y-8">
          <FeatureRow
            title="Miễn phí, vui nhộn, mang lại hiệu quả"
            text="Học tập thú vị, nghiên cứu chứng minh hiệu quả!"
            imgSrc={Onboard4Svg}
            imgOnRight
          />

          <FeatureRow
            title="Cá nhân hóa trải nghiệm học tập"
            text="Lộ trình phù hợp từng bé – không bé nào giống bé nào!"
            imgSrc={Onboard3Svg}
          />

          <FeatureRow
            title="Dựa trên căn cứ khoa học"
            text="Ứng dụng thiết kế dựa trên khoa học giáo dục mới nhất!"
            imgSrc={Onboard2Svg}
            imgOnRight
          />

          <FeatureRow
            title="Giúp bé phát triển toàn diện"
            text="Tư duy, ngôn ngữ, IQ, EQ – phát triển toàn diện!"
            imgSrc={Onboard1Svg}
          />
        </section>

        {/* CTA bottom */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center  flex justify-center relative"
        >
          <Image
            alt="icon"
            src={Onboard5Svg}
            height={482}
            width={528}
            className="sm:w-[300px] sm:h-[244px] lg:w-[522px] lg:h-[482px] mt-0 absolute sm:top-[-10] lg:top-[170] z-0"
          />
          <div className="sm:mt-[160px] lg:mt-[500px] z-1 w-[604px] rounded-2xl bg-white p-6 flex flex-col items-center">

            <h3 className="mb-4 text-[56px] font-bold text-blue-500">Học cùng IruKa</h3>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="flex h-[64px] w-[80%] cursor-pointer items-center
                         justify-center rounded-md bg-[#0090E0] px-6 py-2
                         hover:opacity-90"
            >
              <span className="text-white text-[18px] font-medium">Trải nghiệm ngay</span>
              <FaArrowRightLong className="ml-2 text-[20px] relative top-[1px] text-white" />
            </motion.button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
}

/* ---------------- MOBILE SLIDE ---------------- */
function MobileSlide({
  img,
  title,
  text,
}: {
  img: string | StaticImport;
  title: string;
  text?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex h-[90%] flex-col items-center px-6 pb-20 text-center"
    >
      <Image src={img} alt="logo" width={280} height={300} className="mt-6" />

      <h3 className="mt-8 text-[24px] font-semibold">{title}</h3>

      {text && <p className="mt-3 text-[16px] font-medium text-white/90">{text}</p>}
    </motion.div>
  );
}

/* ---------------- DESKTOP FEATURE ROW ---------------- */
function FeatureRow({
  title,
  text,
  imgSrc,
  imgOnRight = false,
}: {
  title: string;
  text: string;
  imgSrc: string | StaticImport;
  imgOnRight?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeStagger}
      className={`flex items-center ${imgOnRight ? 'flex-row-reverse' : ''} mt-[80px] justify-between gap-6`}
    >
      <motion.div variants={fadeItem}>
        <Image
          src={imgSrc}
          alt="Logo"
          width={250}
          height={300}
          className="h-[300px] w-[250px] lg:h-[450px] lg:w-[420px]"
        />
      </motion.div>

      <motion.div variants={fadeItem} className="lg:basis-[600px]">
        <h4 className="text-[32px] font-semibold lg:text-[48px]">{title}</h4>
        <p className="mt-2 text-[18px] text-white/90">{text}</p>
      </motion.div>
    </motion.div>
  );
}
