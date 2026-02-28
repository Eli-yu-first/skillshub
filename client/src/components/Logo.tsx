const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/skillshub-logo-jvqKdRTAaGhKVNvcaysStw.webp';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 28, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={LOGO_URL}
        alt="SkillsHub"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className="font-display font-bold text-lg tracking-tight">
          Skills<span className="text-coral">Hub</span>
        </span>
      )}
    </div>
  );
}

export { LOGO_URL };
