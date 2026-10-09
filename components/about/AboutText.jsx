'use client';

import ScrubRevealText from '@/components/shared/ScrubRevealText';

export default function AboutText() {
  return (
    <div>
      <ScrubRevealText
        text="Hey, I'm Tabsheerul. I build scalable end-to-end applications, microservices, and event-driven architectures. From crafting responsive React frontends to engineering robust Spring Boot backends, from Kafka message queues to AI-powered vector search — I connect every layer of the modern stack."
        as="p"
        className="text-[20px] md:text-[24px] lg:text-[28px] leading-[1.6] max-w-[700px]"
        dimColor="rgba(255,255,255,0.12)"
        brightColor="rgba(255,255,255,0.9)"
        start="top 80%"
        end="bottom 30%"
        scrub={2}
      />
    </div>
  );
}
