import { FaWhatsapp, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './Contact.css';

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin },
  { key: 'github', label: 'GitHub', Icon: FaGithub },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
];

export function Contact({ socials }) {
  return (
    <AnimatedSection id="contato" className="contact">
      <p className="section-label">Vamos conversar</p>
      <h2 className="section-title">Contato</h2>
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
