import { FaWhatsapp, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Contact.css';

const CHANNELS = [
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin },
  { key: 'github', label: 'GitHub', Icon: FaGithub },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
];

export function Contact({ socials }) {
  return (
    <AnimatedSection id="contato" className="contact">
      <div className="contact__cta">
        <p className="section-label">Vamos conversar</p>
        <h2 className="section-title">Vamos transformar sua ideia em realidade</h2>
        <p className="contact__cta-text">
          Me chama no WhatsApp e vamos tirar sua ideia do papel e tranforma-la em um projeto real, que gera resultado de verdade!
        </p>
        <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
          <FaWhatsapp aria-hidden="true" />
          Chamar no WhatsApp
        </a>
      </div>

      <p className="contact__subheading">Conheça minhas redes</p>
      <div className="contact__grid">
        {CHANNELS.map(({ key, label, Icon }) => (
          <a key={key} href={socials[key]} target="_blank" rel="noopener noreferrer" className="contact__card">
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </AnimatedSection>
  );
}
