// src/components/Header.jsx
import { Heart, Shield, Users } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border shadow-sm border-[#E0E7FF]">
        <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-[#111827]">Manas Veda</h1>
          <p className="text-[#6B7280] text-sm">Your calm mental wellness companion</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#6B7280]">
          <Shield className="w-4 h-4 text-[#6366F1]" />
          <span>100% Anonymous</span>
        </div>
      </div>
    </div>
  );
}
