import { X } from "lucide-react";
import { useEffect } from "react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm'>
      <div
        className={`relative w-full max-w-lg bg-card border border-border rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-6'>{children}</div>

        {footer && (
          <div className='flex justify-end gap-3 p-6 pt-0'>{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
