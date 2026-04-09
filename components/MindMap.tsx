'use client';

import { MindMapData } from '@/lib/types';

interface MindMapProps {
  data: MindMapData;
}

const branchColors = [
  { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', line: '#3b82f6' },
  { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', line: '#8b5cf6' },
  { bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', line: '#22c55e' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', line: '#f97316' },
  { bg: 'bg-pink-500', light: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', line: '#ec4899' },
];

export default function MindMap({ data }: MindMapProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] p-4">
        {/* Center node */}
        <div className="flex flex-col items-center">
          <div className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-base shadow-lg mb-2">
            {data.center}
          </div>

          {/* Branches grid */}
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.branches.map((branch, branchIdx) => {
                const color = branchColors[branchIdx % branchColors.length];
                return (
                  <div key={branch.label} className={`rounded-xl border-2 ${color.border} ${color.light} p-3`}>
                    {/* Branch header */}
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${color.bg} text-white text-sm font-semibold mb-3`}>
                      <span className="mr-1.5">◆</span>
                      {branch.label}
                    </div>
                    {/* Children */}
                    <div className="flex flex-wrap gap-1.5">
                      {branch.children.map((child) => (
                        <span
                          key={child}
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${color.text} bg-white border ${color.border} shadow-sm`}
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
