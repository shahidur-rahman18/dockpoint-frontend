import { doctorAppointmentsChartData } from '../../data/doctorMockData';

const chartWidth = 360;
const chartHeight = 190;
const chartTop = 12;
const chartBottom = 148;
const chartLeft = 14;
const chartRight = 350;
const maxValue = Math.ceil(
  Math.max(...doctorAppointmentsChartData.map((item) => item.appointments)) / 20,
) * 20;
const xForIndex = (index: number) =>
  chartLeft + (index * (chartRight - chartLeft)) / (doctorAppointmentsChartData.length - 1);
const yForValue = (value: number) =>
  chartBottom - (value / maxValue) * (chartBottom - chartTop);
const completedPath = doctorAppointmentsChartData
  .map((item, index) => `${index === 0 ? 'M' : 'L'} ${xForIndex(index)} ${yForValue(item.completed)}`)
  .join(' ');

export const AppointmentsChart = () => (
  <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
    <div className="mb-4">
      <h2 className="text-base font-bold text-slate-900">Appointments Analysis</h2>
      <p className="mt-1 text-xs text-slate-500">Appointments and completed visits this year</p>
    </div>

    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
        role="img"
        aria-label="Monthly appointments and completed appointments chart"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = chartBottom - fraction * (chartBottom - chartTop);
          return (
            <g key={fraction}>
              <line
                x1={chartLeft}
                x2={chartRight}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 4"
              />
              <text x="0" y={y + 3} fill="#94a3b8" fontSize="8">
                {Math.round(maxValue * fraction)}
              </text>
            </g>
          );
        })}

        {doctorAppointmentsChartData.map((item, index) => {
          const x = xForIndex(index);
          const barY = yForValue(item.appointments);
          return (
            <g key={item.month}>
              <title>
                {item.month}: {item.appointments} appointments, {item.completed} completed
              </title>
              <rect
                x={x - 5}
                y={barY}
                width="10"
                height={chartBottom - barY}
                rx="3"
                fill="#c7d2fe"
              />
              <text
                x={x}
                y="168"
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
              >
                {item.month}
              </text>
            </g>
          );
        })}

        <path
          d={completedPath}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {doctorAppointmentsChartData.map((item, index) => (
          <circle
            key={`${item.month}-completed`}
            cx={xForIndex(index)}
            cy={yForValue(item.completed)}
            r="3"
            fill="white"
            stroke="#4f46e5"
            strokeWidth="2"
          >
            <title>{item.month}: {item.completed} completed</title>
          </circle>
        ))}
      </svg>
    </div>

    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
        <span className="h-2.5 w-2.5 rounded-sm bg-indigo-200" />
        Appointments
      </span>
      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
        Completed
      </span>
    </div>
  </section>
);
