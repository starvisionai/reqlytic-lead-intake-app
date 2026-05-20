const LOGO_URL = 'https://media.base44.com/images/public/6a03a70d507e5b17ace04d21/ac2cff078_Main_App_Logo.png';

/**
 * Renders the Reqlytic logo image.
 * className: additional classes for sizing/spacing
 */
export default function AppLogo({ className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Reqlytic"
      style={{ mixBlendMode: 'multiply' }}
      className={`object-contain ${className}`}
    />
  );
}