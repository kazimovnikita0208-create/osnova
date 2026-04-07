export function PromoCard() {
  return (
    <section className="mx-4 mt-8 mb-6 rounded-2xl overflow-hidden bg-primary p-6">
      <h3 className="text-xl font-bold text-primary-foreground leading-tight">
        Gourmet<br />Selection
      </h3>
      <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">
        Imported artisanal cheeses
        and fine oils from the
        Mediterranean coast.
      </p>
      <button className="mt-4 bg-accent text-accent-foreground text-xs font-semibold px-5 py-2.5 rounded-full tracking-wider hover:bg-accent/90 transition-colors">
        EXPLORE
      </button>
    </section>
  )
}
