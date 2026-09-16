import useSystemClock from "../../hooks/useSystemClock";

function SystemClock() {
  const { date, time, timeZone } = useSystemClock();

  return (
    <div
      aria-label={`System date ${date}, system time ${time}, time zone ${timeZone}`}
      className="flex min-w-28 flex-col border-l border-cyan-200/35 pl-3 text-right text-[0.61rem] leading-4 text-cyan-50/85"
      title={`Device time zone: ${timeZone}`}
    >
      <span>{time}</span>
      <span className="text-emerald-200/70">{date}</span>
    </div>
  );
}

export default SystemClock;