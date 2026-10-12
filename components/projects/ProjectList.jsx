'use client';

import { projects } from '@/lib/projectsData';
import ProjectCard from './ProjectCard';

export default function ProjectList() {
  return (
    <section
      id="projects-list"
      className="pb-[160px]"
      style={{ background: '#140d27' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isReversed={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
