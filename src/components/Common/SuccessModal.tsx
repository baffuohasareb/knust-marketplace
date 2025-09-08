import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  durationMs?: number; // auto-dismiss duration
}

// Lightweight success modal with a check animation. Uses Tailwind for styling and basic animations.
export default function SuccessModal({ isOpen, onClose, message = 'Added to cart', durationMs = 1600 }: SuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, durationMs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Modal Card */}
      <div className="relative z-[1001] w-[90%] max-w-sm rounded-2xl bg-white shadow-xl border border-gray-200 p-6 text-center animate-fade-in">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center relative">
          {/* Pulse halo */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75 animate-ping" />
          {/* Check icon */}
          <Check className="h-10 w-10 text-green-600 animate-scale-in" strokeWidth={3} />
        </div>
        <p className="text-lg font-semibold text-gray-900">{message}</p>
        <p className="mt-1 text-sm text-gray-500">Your item has been added successfully.</p>
      </div>

      {/* Local styles for simple keyframe animations without touching global Tailwind config */}
      <style>
        {`
          @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 220ms ease-out; }
          @keyframes scale-in { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
          .animate-scale-in { animation: scale-in 220ms ease-out; }
        `}
      </style>
    </div>
  );
}
