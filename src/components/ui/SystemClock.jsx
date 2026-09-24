import useSystemClock from "../../hooks/useSystemClock";

function SystemClock() {
  const { date, time, timeZone } = useSystemClock();

  return (
    <div
      aria-label={`System date ${date}, system time ${time}, time zone ${timeZone}`}
      className="flex min-w-28 shrink-0 flex-col rounded-xl border border-white/75 bg-[#063f60]/74 px-3 py-1 text-right text-[0.68rem] font-bold leading-4 text-white shadow-[inset_0_1px_rgba(255,255,255,0.22)]"
      title={`Device time zone: ${timeZone}`}
    >
      <span>{time}</span>
      <span className="text-cyan-100">{date}</span>
    </div>
  );
}

export default SystemClock;