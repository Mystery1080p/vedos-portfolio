const WELCOME_SOUND_URL = "/audio/oxygenos-welcome.mp3";

let welcomeAudio = null;

export function preloadWelcomeSound() {
  if (welcomeAudio) {
    return welcomeAudio;
  }

  welcomeAudio = new Audio(WELCOME_SOUND_URL);
  welcomeAudio.preload = "auto";
  welcomeAudio.volume = 0.55;

  return welcomeAudio;
}

export function playWelcomeSound() {
  const audio = preloadWelcomeSound();

  audio.pause();
  audio.currentTime = 0;

  const playAttempt = audio.play();

  if (playAttempt?.catch) {
    playAttempt.catch(() => {
      // Login continues if a browser blocks or cannot decode audio.
    });
  }
}