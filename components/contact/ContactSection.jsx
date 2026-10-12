import ContactHeading from './ContactHeading';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-32 min-h-[90vh] overflow-hidden flex flex-col justify-center" style={{ background: '#140d27' }}>
      
      {/* Ambient Glow Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 100%, rgba(168, 85, 247, 0.08), transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full relative z-10">
        <ContactHeading />
        <ContactInfo />
        <ContactForm />
        <SocialLinks />
      </div>
    </section>
  );
}
