import React from "react";
import { X } from "lucide-react";
import { COLORS } from "../lottery";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-4 float-left ml-4 mt-4 p-2 rounded-full hover:bg-gray-100 transition-all"
          style={{ color: COLORS.primary }}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-8 pt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
