import { site, telHref } from '@/content/site'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-char pt-24 text-bone">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="display text-5xl md:text-6xl">Ambrocio</p>
            <p className="display-wide mt-3 text-sm tracking-[0.3em] text-bone/70">Construction &amp; Remodeling</p>
            <p className="mono-tag mt-8 text-gold">
              General Construction
              <br />
              Residential &amp; Commercial
            </p>
          </div>
          <div>
            <p className="mono-tag text-bone/40">Services</p>
            <ul className="display mt-4 space-y-1 text-3xl">
              <li>Build</li>
              <li>Remodel</li>
              <li>Improve</li>
            </ul>
          </div>
          <div>
            <p className="mono-tag text-bone/40">Contact</p>
            <a href={telHref} className="display-wide mt-4 block text-xl text-bone hover:text-gold">
              {site.contact.phoneDisplay}
            </a>
            <p className="mono-tag mt-3 text-bone/70">{site.contact.name} · English / Español</p>
          </div>
          <div>
            <p className="mono-tag text-bone/40">Service area</p>
            <p className="display-wide mt-4 text-sm leading-relaxed text-bone/80">
              DFW Metroplex
              <br />
              &amp; Surrounding Areas
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-gold/25 pt-10">
          <p className="display text-[12vw] leading-[0.85] text-bone/90 md:text-[8.5vw]">
            Stronger spaces.
            <span className="cine block normal-case tracking-normal text-gold">Brighter tomorrows.</span>
          </p>
        </div>

        <div className="mono-tag mt-16 flex flex-col gap-4 border-t border-bone/10 py-8 text-bone/45 md:flex-row md:items-center md:justify-between">
          <p>Homes | Remodels | Businesses | Better Communities</p>
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
