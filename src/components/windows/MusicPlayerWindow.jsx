import {
  FastForward,
  ListMusic,
  LoaderCircle,
  Music2,
  Pause,
  Play,
  Repeat2,
  Rewind,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Square,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultTracks } from "../../data/music";
import {
  deleteSavedCustomTrack,
  getSavedCustomTracks,
  saveCustomTrack,
} from "../../lib/musicDatabase";
import { useSystemStore } from "../../store/useSystemStore";

const SPEEDS = [0.75, 1, 1.25, 1.5];
const FALLBACK_COVER = "/wallpapers/wallpaper-3.jpg";
const MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function createObjectUrl(blob, objectUrlsRef) {
  if (!blob) {
    return null;
  }

  const objectUrl = URL.createObjectURL(blob);
  objectUrlsRef.current.add(objectUrl);

  return objectUrl;
}

function revokeObjectUrl(url, objectUrlsRef) {
  if (!url?.startsWith("blob:")) {
    return;
  }

  URL.revokeObjectURL(url);
  objectUrlsRef.current.delete(url);
}

function MusicPlayerWindow() {
  const audioRef = useRef(null);
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const objectUrlsRef = useRef(new Set());

  const soundEnabled = useSystemStore((state) => state.soundEnabled);
  const setSoundEnabled = useSystemStore((state) => state.setSoundEnabled);

  const [tracks, setTracks] = useState(defaultTracks);
  const [activeTrackId, setActiveTrackId] = useState(defaultTracks[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pendingCover, setPendingCover] = useState(null);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(true);
  const [libraryError, setLibraryError] = useState("");

  const activeTrackIndex = tracks.findIndex(
    (track) => track.id === activeTrackId
  );

  const activeTrack =
    tracks[activeTrackIndex] ?? tracks[0] ?? defaultTracks[0];

  const activeBackground = activeTrack?.background ?? FALLBACK_COVER;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const playerStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, rgba(2, 67, 107, 0.78), rgba(0, 156, 204, 0.28)), url("${activeBackground}")`,
    }),
    [activeBackground]
  );

  useEffect(() => {
    let isActive = true;

    async function loadCustomTracks() {
      try {
        const savedTracks = await getSavedCustomTracks();

        if (!isActive) {
          return;
        }

        const restoredTracks = savedTracks.map((savedTrack) => ({
          id: savedTrack.id,
          title: savedTrack.title,
          artist: savedTrack.artist ?? "Visitor Collection",
          album: savedTrack.album ?? "Local Music",
          src: createObjectUrl(savedTrack.audioBlob, objectUrlsRef),
          background:
            createObjectUrl(savedTrack.coverBlob, objectUrlsRef) ??
            FALLBACK_COVER,
          isCustom: true,
          createdAt: savedTrack.createdAt,
        }));

        setTracks((currentTracks) => [
          ...currentTracks,
          ...restoredTracks,
        ]);
      } catch (error) {
        console.error("Unable to restore local music library.", error);

        if (isActive) {
          setLibraryError(
            "Your saved local tracks could not be restored in this browser."
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingLibrary(false);
        }
      }
    }

    loadCustomTracks();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = soundEnabled ? volume : 0;
    audio.playbackRate = playbackRate;
    audio.loop = isLooping;
  }, [soundEnabled, volume, playbackRate, isLooping]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !activeTrack) {
      return;
    }

    audio.load();
    setDuration(0);
    setCurrentTime(0);
  }, [activeTrackId, activeTrack]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const playAttempt = audio.play();

    if (playAttempt?.catch) {
      playAttempt.catch(() => setIsPlaying(false));
    }
  }, [activeTrackId, isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !activeTrack) {
      return;
    }

    const artwork = activeTrack.background
      ? [
          {
            src: activeTrack.background,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork,
    });

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [activeTrack, isPlaying]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
      }

      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const playTrack = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const playAttempt = audio.play();

    if (playAttempt?.then) {
      playAttempt
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseTrack();
      return;
    }

    playTrack();
  };

  const stopTrack = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const selectTrack = (trackId, shouldPlay = true) => {
    setActiveTrackId(trackId);
    setIsPlaying(shouldPlay);
  };

  const selectRelativeTrack = (direction) => {
    if (tracks.length === 0) {
      return;
    }

    const nextIndex =
      (activeTrackIndex + direction + tracks.length) % tracks.length;

    setActiveTrackId(tracks[nextIndex].id);
    setIsPlaying(true);
  };

  const seekBy = (seconds) => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) {
      return;
    }

    const nextTime = Math.max(
      0,
      Math.min(audio.duration, audio.currentTime + seconds)
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const cycleSpeed = () => {
    const currentIndex = SPEEDS.indexOf(playbackRate);
    const nextSpeed = SPEEDS[(currentIndex + 1) % SPEEDS.length];

    setPlaybackRate(nextSpeed);
  };

  const handleVolume = (event) => {
    const nextVolume = Number(event.target.value);

    setVolume(nextVolume);

    if (nextVolume > 0 && !soundEnabled) {
      setSoundEnabled(true);
    }
  };

  const toggleMute = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      window.alert("Please choose an image smaller than 8 MB.");
      event.target.value = "";
      return;
    }

    if (pendingCover?.previewUrl) {
      revokeObjectUrl(pendingCover.previewUrl, objectUrlsRef);
    }

    const previewUrl = createObjectUrl(file, objectUrlsRef);

    setPendingCover({
      blob: file,
      name: file.name,
      previewUrl,
    });

    event.target.value = "";
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("audio/")) {
      window.alert("Please choose a valid audio file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      window.alert("Please choose an audio file smaller than 25 MB.");
      event.target.value = "";
      return;
    }

    const id = `local-${crypto.randomUUID?.() ?? Date.now()}`;
    const sourceUrl = createObjectUrl(file, objectUrlsRef);
    const title = file.name.replace(/\.[^/.]+$/, "");

    const trackRecord = {
      id,
      title,
      artist: "Visitor Collection",
      album: "Local Music",
      audioBlob: file,
      coverBlob: pendingCover?.blob ?? null,
      createdAt: Date.now(),
    };

    const newTrack = {
      id,
      title,
      artist: trackRecord.artist,
      album: trackRecord.album,
      src: sourceUrl,
      background: pendingCover?.previewUrl ?? FALLBACK_COVER,
      isCustom: true,
      createdAt: trackRecord.createdAt,
    };

    try {
      await saveCustomTrack(trackRecord);

      setTracks((currentTracks) => [...currentTracks, newTrack]);
      setActiveTrackId(newTrack.id);
      setIsPlaying(true);

      setPendingCover(null);
    } catch (error) {
      console.error("Unable to save local track.", error);

      revokeObjectUrl(sourceUrl, objectUrlsRef);

      window.alert(
        "OxygenOS could not save this audio file in your browser. Please check available browser storage and try again."
      );
    } finally {
      event.target.value = "";
    }
  };

  const deleteCustomTrack = async (trackId) => {
    const trackToDelete = tracks.find((track) => track.id === trackId);

    if (!trackToDelete?.isCustom) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${trackToDelete.title}" from your local Oxygen Music collection?`
    );

    if (!shouldDelete) {
      return;
    }

    const wasActiveTrack = trackToDelete.id === activeTrackId;

    try {
      await deleteSavedCustomTrack(trackId);

      if (wasActiveTrack) {
        const audio = audioRef.current;

        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }

        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        setActiveTrackId(defaultTracks[0].id);
      }

      revokeObjectUrl(trackToDelete.src, objectUrlsRef);
      revokeObjectUrl(trackToDelete.background, objectUrlsRef);

      setTracks((currentTracks) =>
        currentTracks.filter((track) => track.id !== trackId)
      );
    } catch (error) {
      console.error("Unable to delete local track.", error);

      window.alert(
        "OxygenOS could not delete this local track. Please try again."
      );
    }
  };

  const handleEnded = () => {
    if (isLooping) {
      return;
    }

    selectRelativeTrack(1);
  };

  return (
    <div className="flex min-h-full flex-col gap-4 text-[#075a84]">
      <audio
        onEnded={handleEnded}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
        src={activeTrack?.src}
      />

      <section
        className="relative overflow-hidden rounded-2xl border border-white/80 bg-cover bg-center p-5 shadow-[inset_0_1px_rgba(255,255,255,0.45),0_0.8rem_1.4rem_rgba(0,80,125,0.22)]"
        style={playerStyle}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(90deg,rgba(0,59,103,0.35),transparent_65%)]" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="oxygen-float grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white/70 bg-white/20 shadow-[inset_0_2px_rgba(255,255,255,0.74),0_0.8rem_1.4rem_rgba(0,45,79,0.32)]">
            {activeBackground ? (
              <img
                alt={`${activeTrack.title} artwork`}
                className="h-full w-full object-cover"
                src={activeBackground}
              />
            ) : (
              <Music2 className="text-white" size={42} />
            )}
          </div>

          <div className="min-w-0 flex-1 text-white [text-shadow:0_1px_2px_rgba(0,48,82,0.88)]">
            <p className="mb-1 text-[0.67rem] font-bold tracking-[0.12em] text-cyan-100">
              NOW PLAYING
            </p>

            <h2 className="m-0 truncate text-2xl font-bold">
              {activeTrack?.title}
            </h2>

            <p className="mt-1 truncate text-sm text-cyan-50/90">
              {activeTrack?.artist} — {activeTrack?.album}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                aria-label={isPlaying ? "Pause track" : "Play track"}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/28 text-white shadow-[inset_0_1px_rgba(255,255,255,0.8),0_0.3rem_0.6rem_rgba(0,54,90,0.24)] transition hover:scale-105 hover:bg-white/42"
                onClick={togglePlayback}
                type="button"
              >
                {isPlaying ? (
                  <Pause size={21} fill="currentColor" />
                ) : (
                  <Play size={21} fill="currentColor" />
                )}
              </button>

              <button
                className="rounded-xl border border-white/60 bg-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/35"
                onClick={stopTrack}
                type="button"
              >
                <Square className="mr-1 inline" size={13} fill="currentColor" />
                Stop
              </button>

              <button
                aria-pressed={isLooping}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  isLooping
                    ? "border-[#d9ff87] bg-[#d9ff87]/35 text-[#f4ffdf]"
                    : "border-white/60 bg-white/20 text-white hover:bg-white/35"
                }`}
                onClick={() => setIsLooping((currentValue) => !currentValue)}
                type="button"
              >
                <Repeat2 className="mr-1 inline" size={14} />
                Loop
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="oxygen-glass-deep p-4">
        <div className="flex items-center gap-3">
          <span className="w-10 text-right text-xs font-bold text-[#166f96]">
            {formatTime(currentTime)}
          </span>

          <input
            aria-label="Track progress"
            className="oxygen-range flex-1"
            max={duration || 0}
            min="0"
            onChange={handleSeek}
            step="0.1"
            type="range"
            value={currentTime}
          />

          <span className="w-10 text-xs font-bold text-[#166f96]">
            {formatTime(duration)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            aria-label="Previous track"
            className="oxygen-player-control"
            onClick={() => selectRelativeTrack(-1)}
            type="button"
          >
            <SkipBack size={17} fill="currentColor" />
          </button>

          <button
            aria-label="Rewind 10 seconds"
            className="oxygen-player-control"
            onClick={() => seekBy(-10)}
            type="button"
          >
            <Rewind size={17} fill="currentColor" />
          </button>

          <button
            aria-label={isPlaying ? "Pause" : "Play"}
            className="oxygen-player-control oxygen-player-control-main"
            onClick={togglePlayback}
            type="button"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>

          <button
            aria-label="Fast forward 10 seconds"
            className="oxygen-player-control"
            onClick={() => seekBy(10)}
            type="button"
          >
            <FastForward size={17} fill="currentColor" />
          </button>

          <button
            aria-label="Next track"
            className="oxygen-player-control"
            onClick={() => selectRelativeTrack(1)}
            type="button"
          >
            <SkipForward size={17} fill="currentColor" />
          </button>

          <span className="mx-1 hidden h-7 w-px bg-[#1880aa]/30 sm:block" />

          <button
            aria-label="Change playback speed"
            className="oxygen-player-control min-w-14 px-3 text-xs font-bold"
            onClick={cycleSpeed}
            type="button"
          >
            {playbackRate}x
          </button>

          <button
            aria-label={soundEnabled ? "Mute music" : "Unmute music"}
            className="oxygen-player-control"
            onClick={toggleMute}
            type="button"
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <input
            aria-label="Music volume"
            className="oxygen-range w-24"
            max="1"
            min="0"
            onChange={handleVolume}
            step="0.01"
            type="range"
            value={soundEnabled ? volume : 0}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="oxygen-glass-deep p-4">
          <div className="mb-3 flex items-center gap-2">
            <ListMusic className="text-[#14769d]" size={18} />
            <div>
              <p className="oxygen-label mb-0">Collection</p>
              <h3 className="m-0 text-base font-bold text-[#075a84]">
                Oxygen Music Library
              </h3>
            </div>
          </div>

          {isLoadingLibrary && (
            <div className="flex items-center gap-2 rounded-xl bg-white/30 p-3 text-xs font-semibold text-[#28779e]">
              <LoaderCircle className="animate-spin" size={16} />
              Restoring your local music collection…
            </div>
          )}

          {libraryError && (
            <p className="mb-3 rounded-xl border border-[#d95765]/35 bg-[#fff1f2]/70 p-3 text-xs text-[#ad3445]">
              {libraryError}
            </p>
          )}

          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {tracks.map((track) => {
              const isActive = track.id === activeTrackId;

              return (
                <div
                  className={`flex items-center gap-2 rounded-xl border p-2 transition ${
                    isActive
                      ? "border-[#66cce9] bg-white/58 shadow-[inset_0_1px_rgba(255,255,255,0.9)]"
                      : "border-white/55 bg-white/20 hover:bg-white/45"
                  }`}
                  key={track.id}
                >
                  <button
                    aria-label={`Play ${track.title}`}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => selectTrack(track.id)}
                    type="button"
                  >
                    <img
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      src={track.background}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-[#075a84]">
                        {track.title}
                      </span>

                      <span className="block truncate text-[0.66rem] text-[#28779e]">
                        {track.artist}
                      </span>
                    </span>
                  </button>

                  {isActive && (
                    <span className="rounded-full bg-[#d9ff87] px-2 py-0.5 text-[0.56rem] font-extrabold tracking-[0.07em] text-[#075a48]">
                      ACTIVE
                    </span>
                  )}

                  {track.isCustom && (
                    <button
                      aria-label={`Delete ${track.title}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#d95765]/50 bg-[#fff1f2]/70 text-[#bf3648] transition hover:bg-[#d95765] hover:text-white"
                      onClick={() => deleteCustomTrack(track.id)}
                      title="Delete local track"
                      type="button"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="oxygen-glass-deep p-4">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="text-[#14769d]" size={18} />
            <div>
              <p className="oxygen-label mb-0">Personal collection</p>
              <h3 className="m-0 text-base font-bold text-[#075a84]">
                Add your own music
              </h3>
            </div>
          </div>

          <p className="text-xs leading-5 text-[#28779e]">
            Add one local audio file and an optional cover image. Your files
            are saved only in this browser on this device, and never uploaded
            to a server.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="oxygen-button flex items-center gap-2"
              onClick={() => coverInputRef.current?.click()}
              type="button"
            >
              <Upload size={15} strokeWidth={2} />
              Choose cover
            </button>

            <button
              className="oxygen-button flex items-center gap-2"
              onClick={() => audioInputRef.current?.click()}
              type="button"
            >
              <Music2 size={15} strokeWidth={2} />
              Add audio
            </button>
          </div>

          <input
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
            ref={coverInputRef}
            type="file"
          />

          <input
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
            ref={audioInputRef}
            type="file"
          />

          {pendingCover && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/70 bg-white/32 p-2">
              <img
                alt="Selected cover preview"
                className="h-20 w-full rounded-lg object-cover"
                src={pendingCover.previewUrl}
              />

              <p className="mt-2 truncate text-[0.67rem] font-bold text-[#14739a]">
                Cover ready: {pendingCover.name}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MusicPlayerWindow;