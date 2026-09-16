import { useEffect, useMemo, useState } from "react";
import { useSystemStore } from "../store/useSystemStore";

function getVedosDate(offsetMs) {
  return new Date(Date.now() + offsetMs);
}

function useSystemClock() {
  const systemTimeOffsetMs = useSystemStore(
    (state) => state.systemTimeOffsetMs
  );

  const [now, setNow] = useState(() => getVedosDate(systemTimeOffsetMs));

  useEffect(() => {
    const updateClock = () => {
      setNow(getVedosDate(systemTimeOffsetMs));
    };

    updateClock();

    const intervalId = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(intervalId);
  }, [systemTimeOffsetMs]);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(now),
    [now]
  );

  const date = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(now),
    [now]
  );

  const timeZone = useMemo(
    () =>
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone.replaceAll("_", " "),
    []
  );

  return {
    now,
    time,
    date,
    timeZone,
  };
}

export default useSystemClock;