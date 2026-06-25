import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SofiChat from '../components/SofiChat';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <SofiChat />
    </div>
  );
}
