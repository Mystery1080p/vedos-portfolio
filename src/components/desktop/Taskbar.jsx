import { Grid2X2 } from "lucide-react";
import { useSystemStore } from "../../store/useSystemStore";
import SystemClock from "../ui/SystemClock";
import MinimizedWindows from "./MinimizedWindows";
import StartMenu from "./StartMenu";
import TaskbarSearch from "./TaskbarSearch";

function Taskbar() {
  const toggleStartMenu = useSystemStore((state) => state.toggleStartMenu);

  const handleStartClick = (event) => {
    event.stopPropagation();
    toggleStartMenu();
  };

  return (
    <>
      <StartMenu />

      <footer
        className="oxygen-taskbar fixed bottom-2 left-1/2 z-[190] flex h-14 w-[min(96vw,760px)] -translate-x-1/2 items-center gap-2 overflow-visible rounded-[1.35rem] border border-white/85 bg-[linear-gradient(180deg,rgba(240,254,255,0.82),rgba(38,163,211,0.68))] px-2 shadow-[inset_0_1px_rgba(255,255,255,0.96),0_0.7rem_1.6rem_rgba(0,70,110,0.42)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Open OxygenOS Start menu"
          className="relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-xl border border-white/85 bg-[linear-gradient(180deg,#d5ffad_0%,#76da5d_43%,#299246_50%,#49bf50_100%)] px-3 text-xs font-extrabold tracking-[0.04em] text-white shadow-[inset_0_1px_rgba(255,255,255,0.9),inset_0_-1px_rgba(0,77,27,0.35),0_0.18rem_0.45rem_rgba(0,96,52,0.28)] [text-shadow:0_1px_1px_rgba(0,81,43,0.76)] transition hover:brightness-110"
          onClick={handleStartClick}
          type="button"
        >
          <span className="absolute left-[8%] top-[6%] h-[38%] w-[84%] rounded-full bg-white/30" />
          <Grid2X2 className="relative z-10" size={16} strokeWidth={2.8} />
          <span className="relative z-10 hidden sm:inline">Oxygen</span>
        </button>

        <div className="relative min-w-0 w-[clamp(180px,34vw,360px)] shrink overflow-visible">
          <TaskbarSearch />
        </div>

        <MinimizedWindows />

        <div className="ml-auto shrink-0">
          <SystemClock />
        </div>
      </footer>
    </>
  );
}

export default Taskbar;