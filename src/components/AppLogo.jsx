const LOGO_URL = 'https://media.base44.com/images/public/6a03a70d507e5b17ace04d21/238e0cb5e_IntakeIQ_Logo_v2.png';

/**
 * Renders the IntakeIQ logo image.
 * className: additional classes for sizing/spacing
 */
export default function AppLogo({ className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="IntakeIQ"
      className={`object-contain ${className}`}
    />
  );
}