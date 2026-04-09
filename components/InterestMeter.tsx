'use client';

interface InterestMeterProps {
  score: number;
}

function getLabel(score: number): { label: string; color: string; description: string } {
  if (score >= 85) return { label: '매우 높음', color: 'text-red-600', description: '폭발적 관심' };
  if (score >= 70) return { label: '높음', color: 'text-orange-600', description: '사회적 화제' };
  if (score >= 50) return { label: '보통', color: 'text-yellow-600', description: '일반적 관심' };
  if (score >= 30) return { label: '낮음', color: 'text-blue-600', description: '소수 관심' };
  return { label: '매우 낮음', color: 'text-gray-500', description: '관심 저조' };
}

function getProgressColor(score: number): string {
  if (score >= 85) return 'bg-red-500';
  if (score >= 70) return 'bg-orange-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-blue-500';
  return 'bg-gray-400';
}

export default function InterestMeter({ score }: InterestMeterProps) {
  const { label, color, description } = getLabel(score);
  const progressColor = getProgressColor(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-sm text-gray-400">/ 100</span>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${color}`}>{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}
