import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

export function WhatsAppButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Conversar no WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  );
}
