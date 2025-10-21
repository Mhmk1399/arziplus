"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import {
  FaArrowRight,
  FaSpinner,
  FaWallet,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
// Remove ServiceRenderer import as we'll implement the form directly
import { showToast } from "@/utilities/toast";
import FileUploaderModal from "@/components/FileUploaderModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import CardPaymentModal from "@/components/payment/CardPaymentModal";

// Service Field interface matching ServiceRenderer
interface ServiceField {
  name: string;
  label?: string;
  type: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: Array<{
    key: string;
    value: string;
  }>;
  items?: Array<{
    key: string;
    value: string;
  }>;
  showIf?: {
    field: string;
    value: string;
  };
}

// Service interface
interface Service {
  _id: string;
  title: string;
  slug: string;
  fee: number;
  wallet: boolean;
  description?: string;
  helper?: string;
  category?: string;
  icon?: string;
  image?: string;
  status: string;
  fields: ServiceField[];
}

// API Response interface
interface ServiceResponse {
  success: boolean;
  data: Service;
  message?: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<Service> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch service");
  }
  const data: ServiceResponse = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Service not found");
  }
  return data.data;
};

// Service Helper Modal Component
const ServiceHelperModal = ({
  helper,
  isOpen,
  onClose,
}: {
  helper: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-white text-2xl" />
            <h2
              className={`text-2xl font-bold text-white ${estedadBold.className}`}
            >
              راهنمای خدمات
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="prose prose-lg max-w-none text-[#0A1D37] leading-relaxed">
            <div className="whitespace-break-spaces">{helper}</div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaCheckCircle />
              با دقت مطالعه کردم، ادامه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Summary Component
const ServiceSummary = ({ service }: { service: Service }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const LOGO_PLACEHOLDER = "/assets/images/loggo.png";

  return (
    <div className="sticky top-8">
      {/* Service Image/Icon */}
      <div className="mb-6 relative overflow-hidden rounded-2xl shadow-lg">
        {!imageError && service.image ? (
          <div className="relative h-48 w-full">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className={`object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              unoptimized={true}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <Image
                src={LOGO_PLACEHOLDER}
                alt="لوگوی placeholder"
                fill
                className="object-contain opacity-50"
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : service.image ? (
          <div className="relative h-48 w-full">
            <img
              src={imageError ? LOGO_PLACEHOLDER : service.image}
              alt={service.title}
              className="w-full h-full object-contain opacity-70"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-[#0A1D37] to-[#4DBFF0] flex items-center justify-center">
            {service.icon ? (
              <div className="text-6xl text-white">{service.icon}</div>
            ) : (
              <div className="text-4xl text-white font-bold">
                {service.title.charAt(0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Details Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#4DBFF0]/20">
        <h1
          className={`text-2xl font-bold text-[#0A1D37] mb-4 ${estedadBold.className}`}
        >
          {service.title}
        </h1>

        {service.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#0A1D37] mb-2">
              توضیحات خدمت:
            </h3>
            <p className="text-[#0A1D37]/80 leading-relaxed">
              {service.description}
            </p>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#0A1D37] mb-3">
            هزینه خدمت:
          </h3>
          <div className="bg-gradient-to-l from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-xl p-4 border border-[#4DBFF0]/30">
            <div className="flex items-center justify-between">
              <span className="text-[#0A1D37]/70">مبلغ:</span>
              <span className="text-2xl font-bold text-[#0A1D37]">
                {service.fee.toLocaleString()} تومان
              </span>
            </div>

            {service.wallet && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <FaWallet />
                <span className="text-sm font-medium">
                  قابل پرداخت با کیف پول
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        {service.category && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#0A1D37] mb-2">
              دسته‌بندی:
            </h3>
            <span className="inline-block bg-[#4DBFF0]/20 text-[#0A1D37] px-3 py-1 rounded-full text-sm font-medium">
              {service.category}
            </span>
          </div>
        )}

        {/* Required Fields Info */}
        {service.fields && service.fields.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#0A1D37] mb-2">
              اطلاعات مورد نیاز:
            </h3>
            <ul className="space-y-1 text-[#0A1D37]/70 text-sm">
              {service.fields
                .filter((field) => field.required)
                .map((field, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#4DBFF0] rounded-full" />
                    {field.label || field.name}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Back Button */}
        <Link href="/services">
          <button className="w-full flex items-center justify-center gap-2 bg-[#0A1D37]/10 text-[#0A1D37] font-medium py-3 px-6 rounded-xl hover:bg-[#0A1D37]/20 transition-all duration-300">
            <FaArrowRight />
            بازگشت به لیست خدمات
          </button>
        </Link>
      </div>
    </div>
  );
};

// Form field value types
type FormFieldValue = string | number | boolean | string[] | null | undefined;
type FormData = Record<string, FormFieldValue>;

// Main Service Detail Page Component
export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [helperRead, setHelperRead] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentFileField, setCurrentFileField] = useState<string | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPaymentModal, setShowCardPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user: currentUser } = useCurrentUser();

  // Fetch service using SWR
  const {
    data: service,
    error,
    isLoading,
  } = useSWR<Service>(
    slug ? `/api/dynamicServices?slug=${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || 0);
      }
    } catch (error) {
      console.log("Error fetching wallet balance:", error);
    }
  };

  // Show helper modal when service loads and has helper text
  useEffect(() => {
    if (service && service.helper && !helperRead) {
      setShowHelperModal(true);
    }
  }, [service, helperRead]);

  // Fetch wallet balance when user loads
  useEffect(() => {
    if (currentUser) {
      fetchWalletBalance();
    }
  }, [currentUser]);

  const handleHelperClose = () => {
    setShowHelperModal(false);
    setHelperRead(true);
  };

  // Form field helper functions
  const handleInputChange = (fieldName: string, value: FormFieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFileUploadClick = (fieldName: string) => {
    setCurrentFileField(fieldName);
    setIsFileModalOpen(true);
  };

  const handleFileUploaded = (fileUrl: string) => {
    if (currentFileField) {
      handleInputChange(currentFileField, fileUrl);
      setCurrentFileField(null);
    }
    setIsFileModalOpen(false);
    showToast.success("فایل با موفقیت آپلود شد!");
  };

  const shouldShowField = (field: ServiceField): boolean => {
    if (!field.showIf) return true;

    const conditionValue = formData[field.showIf.field];
    return conditionValue === field.showIf.value;
  };

  const validateForm = (): boolean => {
    if (!service) return false;

    const visibleFields = service.fields.filter(shouldShowField);
    const requiredFields = visibleFields.filter((field) => field.required);

    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name] === "") {
        showToast.error(`فیلد ${field.label || field.name} الزامی است`);
        return false;
      }
    }

    return true;
  };

  // Render individual form fields
  const renderField = (field: ServiceField) => {
    if (!shouldShowField(field)) return null;

    const value = formData[field.name] || "";

    const baseInputClasses = `
      w-full px-4 py-3 
      bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm 
      border border-[#4DBFF0] rounded-xl
      text-[#0A1D37] placeholder-[#0A1D37]/50
      focus:outline-none focus:ring-2 focus:ring-[#4DBFF0]/50 focus:border-[#4DBFF0]/50
      transition-all duration-300
    `;

    const renderInput = () => {
      switch (field.type) {
        case "string":
        case "email":
        case "password":
        case "tel":
          return (
            <input
              type={field.type === "string" ? "text" : field.type}
              value={String(value || "")}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "number":
          return (
            <input
              type="number"
              value={typeof value === "number" ? value : ""}
              onChange={(e) =>
                handleInputChange(field.name, parseFloat(e.target.value) || "")
              }
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "textarea":
          return (
            <textarea
              value={String(value || "")}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`${baseInputClasses} resize-none`}
              required={field.required}
            />
          );

        case "select":
          return (
            <select
              value={String(value || "")}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">انتخاب کنید</option>
              {[...(field.options || []), ...(field.items || [])].map(
                (option, index) => (
                  <option
                    key={index}
                    value={option.key}
                    className="bg-white text-[#0A1D37]"
                  >
                    {option.key}
                  </option>
                )
              )}
            </select>
          );

        case "multiselect":
          return (
            <div className="space-y-2">
              {[...(field.options || []), ...(field.items || [])].map(
                (option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-reverse space-x-2 text-[#0A1D37]/90"
                  >
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(value) && value.includes(option.key)
                      }
                      onChange={(e) => {
                        const currentArray = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          handleInputChange(field.name, [
                            ...currentArray,
                            option.key,
                          ]);
                        } else {
                          handleInputChange(
                            field.name,
                            currentArray.filter((v) => v !== option.key)
                          );
                        }
                      }}
                      className="rounded text-[#4DBFF0] focus:ring-[#4DBFF0]"
                    />
                    <span>{option.value}</span>
                  </label>
                )
              )}
            </div>
          );

        case "boolean":
          return (
            <label className="flex items-center space-x-reverse space-x-2 text-[#0A1D37]/90">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) =>
                  handleInputChange(field.name, e.target.checked)
                }
                className="rounded text-[#4DBFF0] focus:ring-[#4DBFF0]"
                required={field.required}
              />
              <span>{field.placeholder || field.label}</span>
            </label>
          );

        case "date":
          return (
            <input
              type="date"
              value={String(value || "")}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "file":
          return (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={String(value || "")}
                  placeholder="فایل انتخاب نشده - از دکمه آپلود استفاده کنید"
                  className={`${baseInputClasses} flex-1`}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleFileUploadClick(field.name)}
                  className="px-6 py-3 hover:bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-[#0A1D37] hover:text-white border border-[#4DBFF0] rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#0A1D37]/80 transition-all duration-300 whitespace-nowrap"
                >
                  📁 آپلود فایل
                </button>
              </div>

              {/* File Preview */}
              {value && (
                <div className="p-3 bg-white/5 rounded-lg border border-[#4DBFF0]/30">
                  <p className="text-[#0A1D37]/70 text-sm mb-2">
                    فایل آپلود شده:
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <a
                        href={typeof value === "string" ? value : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A1D37] border border-[#4DBFF0] p-2 rounded-md hover:text-[#4DBFF0]/80 text-sm "
                      >
                        مشاهده فایل
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.name, "")}
                      className="text-[#0A1D37] border border-[#0A1D37] p-2 rounded-md hover:text-[#0A1D37]/80 text-sm"
                    >
                      حذف
                    </button>
                  </div>

                  {/* Image Preview if it's an image */}
                  {value &&
                    typeof value === "string" &&
                    (value.includes("image") ||
                      value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
                      <div className="mt-2">
                        <img
                          src={value}
                          alt="پیش‌نمایش"
                          className="w-32 h-32 object-cover rounded-lg border border-[#4DBFF0]/50"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          );

        default:
          return (
            <input
              type="text"
              value={String(value || "")}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );
      }
    };

    return (
      <div key={field.name} className="space-y-2">
        <label className="block text-[#0A1D37] font-medium">
          {field.label || field.name}
          {field.required && <span className="text-[#0A1D37] ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-[#0A1D37]/60 text-sm">{field.description}</p>
        )}
        {renderInput()}
      </div>
    );
  };

  // Handle form submission - now shows payment selection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service || !currentUser?.id) {
      showToast.error("ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    if (!validateForm()) return;

    // Show payment method selection
    setShowPaymentSelector(true);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = async (
    paymentMethod: "wallet" | "direct" | "card"
  ) => {
    setShowPaymentSelector(false);
    setSubmitting(true);

    try {
      if (paymentMethod === "wallet") {
        await handleWalletPayment();
      } else if (paymentMethod === "direct") {
        await handleDirectPayment();
      } else if (paymentMethod === "card") {
        handleCardPayment();
      }
    } catch (error) {
      console.log("Payment error:", error);
      showToast.error("خطا در پردازش پرداخت");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle wallet payment
  const handleWalletPayment = async () => {
    try {
      // Check wallet balance
      if (walletBalance < service!.fee) {
        showToast.error("موجودی کیف پول کافی نیست");
        // Redirect to wallet page
        window.location.href = "/dashboard?tab=wallet";
        return;
      }

      // Create request with wallet payment
      await createServiceRequest("wallet", service!.fee);

      showToast.success(
        `درخواست با پرداخت کیف پول ثبت شد. مبلغ ${service!.fee.toLocaleString()} تومان از کیف پول کسر گردید.`
      );

      // Update wallet balance
      setWalletBalance((prev) => prev - service!.fee);
      setFormData({});
    } catch (error) {
      throw error;
    }
  };

  // Handle direct payment
  const handleDirectPayment = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Prepare payment data similar to addamount.tsx
      const paymentData = {
        amount: service!.fee, // Send in Toman directly
        description: `پرداخت خدمت: ${service!.title}`,
        serviceId: service!._id,
        orderId: `SERVICE-${Date.now()}`, // Generate unique order ID
        currency: "IRT",
        // Store service request data in metadata for processing after payment
        metadata: {
          mobile: currentUser!.phone,
          order_id: `SERVICE-${Date.now()}`,
          serviceData: JSON.stringify(formData), // Service form data
          customerName:
            currentUser!.firstName && currentUser!.lastName
              ? `${currentUser!.firstName} ${currentUser!.lastName}`
              : currentUser!.firstName || "کاربر",
          customerPhone: currentUser!.phone,
          serviceTitle: service!.title,
          serviceSlug: service!.slug,
          type: "service_payment", // Mark as service payment
        },
      };

      // Call payment request API like addamount.tsx does
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if this is a duplicate payment
        if (data.data.duplicate) {
          if (data.data.redirectTo) {
            // Already verified payment, redirect to success page
            showToast.info("پرداخت قبلاً انجام شده است");
            return;
          } else {
            // Pending duplicate, show warning and redirect to existing payment
            showToast.warning(
              "درخواست پرداخت تکراری - به درگاه موجود منتقل می‌شوید"
            );
          }
        } else {
          showToast.success("درخواست پرداخت با موفقیت ایجاد شد");
        }

        // Redirect to ZarinPal payment portal
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl;
        }
      } else {
        showToast.error(data.error || "خطا در ایجاد درخواست پرداخت");
      }
    } catch (error) {
      console.log("Payment request error:", error);
      showToast.error("خطا در اتصال به سرور");
      throw error;
    }
  };

  // Handle card payment
  const handleCardPayment = () => {
    setShowCardPaymentModal(true);
  };

  // Handle card payment completion

  // Create service request
  const createServiceRequest = async (
    paymentMethod: string,
    amount: number,
    isPaid: boolean = true,
    receiptUrl?: string
  ) => {
    const customerName =
      currentUser!.firstName && currentUser!.lastName
        ? `${currentUser!.firstName} ${currentUser!.lastName}`
        : currentUser!.firstName || "نام مشتری";

    const requestData = {
      service: service!._id,
      data: formData,
      customer: currentUser!.id,
      customerName,
      customerPhone: currentUser!.phone,
      paymentMethod,
      paymentAmount: amount,
      isPaid,
      receiptUrl, // For card payments
    };

    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/service-requests", {
      method: "POST",
      headers,
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "خطا در ثبت درخواست");
    }

    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#000]">
          <FaSpinner className="animate-spin text-3xl" />
          <span className="text-xl font-medium">در حال بارگذاری خدمت</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div
        className="min-h-screen   flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-red-100">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0A1D37] mb-3">
              خدمت یافت نشد
            </h2>
            <p className="text-[#0A1D37]/60 mb-6 leading-relaxed">
              خدمت مورد نظر شما وجود ندارد یا در حال حاضر فعال نیست
            </p>
            <Link href="/services">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform w-full">
                <FaArrowRight />
                بازگشت به خدمات
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] py-32"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Summary */}
            <div className="lg:col-span-1">
              <ServiceSummary service={service} />
            </div>

            {/* Right Column - Service Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#4DBFF0]/20 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] p-6">
                  <h2
                    className={`text-2xl font-bold text-white ${estedadBold.className}`}
                  >
                    فرم درخواست خدمت
                  </h2>
                  <p className="text-white/90 mt-1">
                    لطفاً اطلاعات مورد نیاز را با دقت تکمیل کنید
                  </p>
                </div>

                {/* Service Form */}
                <div className="p-6">
                  {/* User Info Display */}
                  {currentUser && (
                    <div className="mb-6 p-4 bg-gradient-to-l from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-xl border border-[#4DBFF0]/30">
                      <p className="text-[#0A1D37]/70 text-sm mb-1">
                        درخواست توسط:
                      </p>
                      <p className="font-medium text-[#0A1D37]">
                        {currentUser.firstName && currentUser.lastName
                          ? `${currentUser.firstName} ${currentUser.lastName}`
                          : currentUser.firstName || "کاربر"}
                      </p>
                    </div>
                  )}

                  {/* Login Required Message */}
                  {!currentUser && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-yellow-800 font-medium text-center">
                        برای ثبت درخواست لطفاً ابتدا وارد حساب کاربری خود شوید
                      </p>
                    </div>
                  )}

                  {/* Service Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Render Fields */}
                    {service.fields && service.fields.length > 0 ? (
                      service.fields.map((field) => renderField(field))
                    ) : (
                      <div className="text-center py-8 text-[#0A1D37]/60">
                        این خدمت نیازی به اطلاعات اضافی ندارد
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <button
                        type="submit"
                        disabled={submitting || !currentUser}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          submitting || !currentUser
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] text-white hover:opacity-90 transform hover:scale-105 shadow-lg"
                        }`}
                      >
                        {submitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            در حال ثبت درخواست...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle />
                            ثبت درخواست خدمت
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Modal */}
      {service && service.helper && (
        <ServiceHelperModal
          helper={service.helper}
          isOpen={showHelperModal}
          onClose={handleHelperClose}
        />
      )}

      {/* File Upload Modal */}
      <FileUploaderModal
        isOpen={isFileModalOpen}
        onClose={() => {
          setIsFileModalOpen(false);
          setCurrentFileField(null);
        }}
        onFileUploaded={handleFileUploaded}
        acceptedTypes={[
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".pdf",
          ".doc",
          ".docx",
          ".txt",
        ]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        title="آپلود فایل"
      />

      {/* Payment Method Selection Modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm   flex items-center justify-center z-80 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <PaymentMethodSelector
              amount={service?.fee || 0}
              walletBalance={walletBalance}
              onPaymentMethodSelect={(method) => {
                setShowPaymentSelector(false);
                if (method === "wallet") {
                  handleWalletPayment();
                } else if (method === "direct") {
                  handleDirectPayment();
                } else if (method === "card") {
                  handleCardPayment();
                }
              }}
              isWalletEnabled={walletBalance >= (service?.fee || 0)}
            />
            <button
              onClick={() => setShowPaymentSelector(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={showCardPaymentModal}
        onClose={() => setShowCardPaymentModal(false)}
        amount={service?.fee || 0}
        serviceName={service?.title || ""}
        onPaymentComplete={async (receiptUrl: string) => {
          await createServiceRequest(
            "card",
            service?.fee || 0,
            true,
            receiptUrl
          );
          setShowCardPaymentModal(false);
        }}
      />
    </>
  );
}
