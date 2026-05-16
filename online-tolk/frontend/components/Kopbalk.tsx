"use client";

export function Kopbalk() {
  return (
    <header className="kopbalk">
      <img
        className="merk-logo"
        src="/logo.png"
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="merk">
        <span className="merk-naam">Online Tolk</span>
        <span className="merk-tag">onderdeel van VerzuimTriage</span>
      </div>
    </header>
  );
}
