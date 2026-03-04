import Tooth from "./Tooth";

const topRow = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];

const bottomRow = [
  38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48,
];

export default function DentalChart({ onToothClick }) {
  return (
    <div className="relative flex justify-center min-w-[700px]">
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300" />

      <div className="flex gap-3">
        {topRow.map((top, index) => (
          <div key={top} className="flex flex-col gap-4 items-center">
            <Tooth number={top} onClick={() => onToothClick(top)} />
            <Tooth
              number={bottomRow[index]}
              onClick={() => onToothClick(bottomRow[index])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
