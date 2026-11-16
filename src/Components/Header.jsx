export default function Header({ total, done }) {
  return (
    <header className="animate-fade-up border-b border-line/80 pb-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Görev Yöneticisi
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Planla, güncelle, tamamla
      </h1>
      <p className="mt-2 max-w-2xl text-base text-ink-muted">
        React + Vite + Tailwind ile CRUD örneği. Veriler LocalStorage’da kalır; Netlify’ye deploy
        edilebilir.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
        <span>
          Toplam: <strong className="text-ink">{total}</strong>
        </span>
        <span>
          Tamamlanan: <strong className="text-ink">{done}</strong>
        </span>
      </div>
    </header>
  )
}
