export default function Loading() {
  return (
    <main className="route-loading" aria-label="Carregando página">
      <section className="loading-card">
        <img className="loading-logo" src="/images/logotipo.png" alt="Lumora Smartbuilding" />
        <span className="loading-progress" aria-hidden="true"><i /></span>
        <p>Preparando sua experiência Lumora...</p>
      </section>
    </main>
  );
}
