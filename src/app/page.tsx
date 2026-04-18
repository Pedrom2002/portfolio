import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import { ProjectsHeader, ProjectDetail } from "@/components/sections/Projects";
import ProjectSnapZone from "@/components/sections/ProjectSnapZone";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import GalaxyBackground from "@/components/three/GalaxyBackground";

export default function Home() {
  return (
    <>
      <GalaxyBackground />

      <main className="relative z-10">
        <Navigation />

        <section id="hero" aria-label="Introduction" className="h-screen">
          <Hero />
        </section>

        <section id="about" aria-label="About me" className="flex h-screen items-center overflow-hidden">
          <div className="w-full rounded-3xl bg-galaxy-darker/70 py-4 backdrop-blur-sm">
            <About />
          </div>
        </section>

        {/* Solar system overview */}
        <section id="projects" aria-label="Featured projects" className="flex h-screen items-center overflow-hidden">
          <div className="w-full">
            <ProjectsHeader />
          </div>
        </section>

        {/* Individual planet/project sections — planet on the left, info on the right */}
        <ProjectSnapZone>
          <section id="project-0" aria-label="Project: Dueit" className="h-screen">
            <ProjectDetail index={0} />
          </section>

          <section id="project-1" aria-label="Project: Energy Forecast PT" className="h-screen">
            <ProjectDetail index={1} />
          </section>

          <section id="project-2" aria-label="Project: RushTalk" className="h-screen">
            <ProjectDetail index={2} />
          </section>

          <section id="project-3" aria-label="Project: Clutch Labs" className="h-screen">
            <ProjectDetail index={3} />
          </section>
        </ProjectSnapZone>

        <section id="skills" aria-label="Technical skills" className="flex h-screen items-center overflow-hidden">
          <div className="w-full rounded-3xl bg-galaxy-darker/70 py-4 backdrop-blur-sm">
            <Skills />
          </div>
        </section>

        <section id="contact" aria-label="Contact">
          <Contact />
          <Footer />
        </section>
      </main>

      <CustomCursor />
    </>
  );
}
