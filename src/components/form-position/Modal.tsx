import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  onClose: () => void;
}

export function Modal({ isOpen, title, message, type, onClose }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-[#3b82f6]';
      case 'warning':
        return 'text-[#ffd600]';
      default:
        return 'text-[#0a0e27]';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-600';
      case 'success':
        return 'border-[#3b82f6]';
      case 'warning':
        return 'border-[#ffd600]';
      default:
        return 'border-[#0a0e27]';
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/10 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-[fadeInUp_0.3s_ease_forwards] border-2"
        style={{ borderColor: getBorderColor().replace('border-', '') }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e0e7ef]">
          <div className="flex items-center gap-3">
            <span className={`text-4xl ${getIconColor()}`}>{getIcon()}</span>
            <h3 className="text-2xl font-bold text-[#0a0e27] font-['Space_Grotesk']">
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-lg text-[#0a0e27] leading-relaxed font-['Space_Grotesk']">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e0e7ef] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#3b82f6] text-white rounded font-['Space_Grotesk'] text-sm font-semibold tracking-wider uppercase transition-all hover:bg-[#2563eb] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

