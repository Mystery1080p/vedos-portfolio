function CrtShell({ children, className = "" }) {
  return (
    <div className={`oxygen-display ${className}`}>
      <div className="oxygen-bubble oxygen-bubble-one" />
      <div className="oxygen-bubble oxygen-bubble-two" />
      <div className="oxygen-bubble oxygen-bubble-three" />

      <div className="oxygen-display-content">{children}</div>
    </div>
  );
}

export default CrtShell;