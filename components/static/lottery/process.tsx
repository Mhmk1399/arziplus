"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera, CheckCircle, FileText } from "lucide-react";
import Modal from "./modal";
import { modalContents } from "./modalContent";

const COLORS = {
  primary: "#0A1D37",
  secondary: "#FF7A00",
  accent: "#4DBFF0",
  white: "#FFFFFF",
  gray: "#A0A0A0",
};

const ProcessSteps = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalContent, setSelectedModalContent] = useState<
    keyof typeof modalContents | null
  >(null);

  const handleOpenModal = (modalKey: keyof typeof modalContents) => {
    setSelectedModalContent(modalKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedModalContent(null);
  };

  const steps = [
    {
      number: "1️⃣",
      title: "تکمیل فرم مشخصات فردی",
      description:
        "در این مرحله، اطلاعات هویتی و شخصی شما شامل نام، تاریخ تولد، وضعیت تاهل، تعداد فرزندان، آدرس و مشخصات خانواده وارد می‌شود. تیم ارزی پلاس فرم شما را بررسی کرده و در صورت وجود خطا، اصلاحات لازم را انجام می‌دهد.",
      link: "شرایط ثبت‌نام لاتاری",
      icon: <FileText className="w-8 h-8" />,
      modalKey: "step1" as const,
    },
    {
      number: "2️⃣",
      title: "عکس مخصوص لاتاری",
      description:
        "عکس یکی از مهم‌ترین بخش‌های ثبت‌نام لاتاری است و باید دقیقاً مطابق با استانداردهای سفارت آمریکا باشد. ارزی پلاس عکس شما را بررسی، اصلاح و در صورت نیاز بازطراحی می‌کند تا با شرایط رسمی کاملاً منطبق باشد.",
      link: "شرایط عکس لاتاری",
      icon: <Camera className="w-8 h-8" />,
      modalKey: "step2" as const,
    },
    {
      number: "3️⃣",
      title: "پرداخت هزینه ثبت‌نام",
      description:
        "تمامی خدمات ثبت‌نام لاتاری توسط ارزی پلاس انجام می‌شود و پرداخت هزینه از طریق سیستم پرداخت امن ارزی پلاس صورت می‌گیرد. پس از پرداخت، رسید و فایل تأییدیه ثبت‌نام به‌صورت خودکار برای شما صادر می‌شود.",
      link: "خدمات پرداخت ارزی پلاس",
      icon: <CheckCircle className="w-8 h-8" />,
      modalKey: "step3" as const,
    },
  ];

  return (
    <>
      <section className="py-20 px-4" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLORS.primary }}
            >
              مراحل و مدارک مورد نیاز برای ثبت‌نام لاتاری آمریکا
            </h2>
            <p
              className="text-lg max-w-4xl mx-auto leading-relaxed mt-6"
              style={{ color: COLORS.gray }}
            >
              برنامه لاتاری گرین‌کارت آمریکا هر سال توسط اداره مهاجرت ایالات
              متحده با هدف افزایش تنوع فرهنگی مهاجران برگزار می‌شود. در این
              برنامه، افرادی که در قرعه‌کشی برنده شوند، مجوز اقامت دائم آمریکا
              (گرین‌کارت) را دریافت می‌کنند. کشور ایران به دلیل سهمیه بالا،
              هرساله درصد قابل‌توجهی از برندگان را به خود اختصاص می‌دهد. ثبت‌نام
              در لاتاری از طریق ارزی پلاس به‌صورت مرحله‌به‌مرحله و با رعایت
              تمامی قوانین رسمی انجام می‌شود.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-2xl  p-8 shadow-lg hover:shadow-2xl transition-all"
                style={{
                  backgroundColor: COLORS.white,
                  border: `2px solid ${
                    index === 0
                      ? COLORS.primary
                      : index === 1
                      ? COLORS.secondary
                      : COLORS.primary
                  }`,
                }}
              >
                <div className="text-center mb-6">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{
                      backgroundColor: `${
                        index === 0
                          ? COLORS.primary
                          : index === 1
                          ? COLORS.secondary
                          : COLORS.primary
                      }20`,
                      color:
                        index === 0
                          ? COLORS.primary
                          : index === 1
                          ? COLORS.secondary
                          : COLORS.primary,
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {step.title}
                  </h3>
                </div>

                <p
                  className="leading-relaxed text-center mb-6"
                  style={{ color: COLORS.gray }}
                >
                  {step.description}
                </p>

                <button
                  onClick={() => handleOpenModal(step.modalKey)}
                  className="flex items-center justify-center p-2 rounded-xl gap-2 font-medium hover:gap-3 transition-all cursor-pointer border-0"
                  style={{
                    color:
                      index === 0
                        ? COLORS.primary
                        : index === 1
                        ? COLORS.secondary
                        : COLORS.primary,
                    backgroundColor: `${
                      index === 0
                        ? COLORS.primary
                        : index === 1
                        ? COLORS.secondary
                        : COLORS.primary
                    }20`,
                  }}
                >
                  {step.link}
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedModalContent && modalContents[selectedModalContent].content}
      </Modal>
    </>
  );
};

export default ProcessSteps;
