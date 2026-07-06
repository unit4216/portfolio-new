import { ThemeProvider } from './theme/ThemeContext'
import { useRoute } from './router'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { SelectedWork } from './components/SelectedWork'
import { Experience } from './components/Experience'
import { Toolkit } from './components/Toolkit'
import { Contact } from './components/Contact'
import { SynthPage } from './synth/SynthPage'

function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-[1080px] bg-bg text-text">
      <Header />
      <Hero />
      <About />
      <SelectedWork />
      <Experience />
      <Toolkit />
      <Contact />
    </div>
  )
}

function App() {
  const route = useRoute()

  return <ThemeProvider>{route === '/synth' ? <SynthPage /> : <Home />}</ThemeProvider>
}

export default App
