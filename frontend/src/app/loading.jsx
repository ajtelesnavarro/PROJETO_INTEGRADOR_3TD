export default function Loading() {
<<<<<<< HEAD
  return <main className="route-loading" aria-label="Carregando página">
    <span className="loading-mark">L</span>
    <p>Preparando sua experiência Lumora...</p>
    </main>;
=======
  return (
    <main className="route-loading" aria-label="Carregando página">
      <section className="loading-card">
        <img className="loading-logo" src="/images/logotipo.png" alt="Lumora Smartbuilding" />
        <span className="loading-progress" aria-hidden="true"><i /></span>
        <p>Preparando sua experiência Lumora...</p>
      </section>
    </main>
  );
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
}
