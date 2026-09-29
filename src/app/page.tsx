import Loader from '@/components/sections/Loader'
import Nav from '@/components/sections/Nav'
import Hero from '@/components/sections/Hero'
import Intro from '@/components/sections/Intro'
import Services from '@/components/sections/Services'
import Pillars from '@/components/sections/Pillars'
import BeforeAfter from '@/components/sections/BeforeAfter'
import Process from '@/components/sections/Process'
import Portfolio from '@/components/sections/Portfolio'
import Sectors from '@/components/sections/Sectors'
import Craft from '@/components/sections/Craft'
import Trust from '@/components/sections/Trust'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

// Story: empty space → vision → blueprint → build → transformation → finished space → next project
export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Intro />
        <Services />
        <Pillars />
        <BeforeAfter />
        <Process />
        <Portfolio />
        <Sectors />
        <Craft />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
