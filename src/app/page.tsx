import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import About from "@/components/About";
import ImageBand from "@/components/ImageBand";
import Programs from "@/components/Programs";
import Coaches from "@/components/Coaches";
import ProgressChart from "@/components/ProgressChart";
import Tournaments from "@/components/Tournaments";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <About />

        {/* Tek tam sayfa derslik geçişi */}
        <ImageBand
          src="/derslik.jpeg"
          alt="Lüleburgaz Satranç derslik salonu"
          caption="Derslik · turnuva salonu"
          objectPosition="center"
        />

        <Programs />
        <Coaches />
        <ProgressChart />
        <Tournaments />
        <Testimonials />
        <Blog />
        <FAQ />

        <ImageBand
          src="/bina2.jpeg"
          alt="Lüleburgaz Satranç Spor Kulübü dış görünüm"
          caption="Merkez · Lüleburgaz"
          objectPosition="center 70%"
        />

        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
