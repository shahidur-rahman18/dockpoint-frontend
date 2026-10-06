import { Sparkles } from 'lucide-react';
import { doctorUpgradeCardData } from '../../data/doctorMockData';

export const UpgradeProCard = () => (
  <div className="mx-3 mb-4 rounded-xl bg-indigo-950 p-4 text-white">
    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
      <Sparkles className="h-4 w-4" />
    </div>
    <h2 className="text-sm font-semibold">{doctorUpgradeCardData.title}</h2>
    <p className="mt-1 text-xs leading-relaxed text-indigo-100/80">
      {doctorUpgradeCardData.description}
    </p>
    <button
      type="button"
      className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-950 transition-colors hover:bg-indigo-50"
    >
      {doctorUpgradeCardData.buttonText}
    </button>
  </div>
);
