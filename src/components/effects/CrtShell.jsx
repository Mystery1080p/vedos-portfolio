function CrtShell({ children, className = "" }) {
  return (
    <div className={`vedos-crt vedos-flicker ${className}`}>
      <div className="vedos-crt-content">{children}</div>
    </div>
  );
}

export default CrtShell;