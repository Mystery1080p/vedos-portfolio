function LoginScreen({ onLogin }) {
  return (
    <main className="min-h-screen bg-black text-cyan-300 flex items-center justify-center font-mono">
      <section className="border border-cyan-400 p-8 w-80">
        <h1 className="text-2xl mb-6">VedOS Login</h1>
        <p className="mb-6">USER: Vedanth Mandpe</p>

        <button
          onClick={onLogin}
          className="border border-cyan-300 px-4 py-2 hover:bg-cyan-300 hover:text-black"
        >
          LOGIN
        </button>
      </section>
    </main>
  );
}

export default LoginScreen;