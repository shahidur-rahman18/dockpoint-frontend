import React from 'react';
import { useNavigate } from 'react-router';
import { Construction, ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Construction className="w-6 h-6 text-indigo-500" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            <p className="text-xs font-medium text-slate-400 max-w-md mx-auto">{description}</p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};