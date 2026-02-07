import type { ReactElement, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps): ReactElement {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
        {description && <p className="text-[var(--text-secondary)]">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps): ReactElement {
  return <div className="p-8">{children}</div>;
}

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Section({ title, description, children }: SectionProps): ReactElement {
  return (
    <section className="mb-8">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
          {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
