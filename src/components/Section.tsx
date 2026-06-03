import { memo, useId, type ReactNode } from 'react';

interface SectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const Section = memo(function Section({ eyebrow, title, subtitle, children }: SectionProps) {
  const headingId = useId();

  return (
    <section className="section-card" aria-labelledby={headingId}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <div className="section-heading">
        <h2 id={headingId}>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
});

export default Section;