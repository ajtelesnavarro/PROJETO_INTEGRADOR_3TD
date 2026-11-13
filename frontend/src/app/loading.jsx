import Image from "next/image";
import "./Loading.css";

export default function Loading() {
  return (
    <main className="route-loading" aria-label="Carregando página">
      <div className="loading-logo">
        <Image
          src="/images/logo.png"
          alt="Lumora SmartBuilding"
          width={100}
          height={85}
          priority
        />
      </div>

      <p>Preparando sua experiência Lumora...</p>

      <div className="loading-progress">
        <span />
      </div>
    </main>
  );
}