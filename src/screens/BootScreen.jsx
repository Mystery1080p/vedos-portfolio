function BootScreen() {
  return (
    <main className="min-h-screen bg-black text-cyan-300 p-8 font-mono">
      <p>VEDOS BIOS(TM)</p>
      <p>COPYRIGHT VEDANTH MANDPE</p>
      <p>MEMORY TEST: OK</p>
      <p>INITIALIZING MATRIX DISPLAY...</p>
      <p className="mt-6 animate-pulse">PLEASE WAIT...</p>
    </main>
  );
}

export default BootScreen;