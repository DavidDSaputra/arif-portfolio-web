import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import EventProject from "@/components/EventProject";
import Insight from "@/components/Insight";
import Skills from "@/components/Skills";
import Brief from "@/components/Brief";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <SelectedWork />
        <EventProject />
        <Insight />
        <Skills />
        <Brief />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
