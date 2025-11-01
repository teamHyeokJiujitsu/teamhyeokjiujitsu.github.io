export interface ServiceSummary {
  slug: string;
  name: string;
  description: string;
  status: 'beta' | 'launch' | 'prototype';
  statusLabel: string;
  href: string;
}

export interface ServiceDetail extends ServiceSummary {
  hero: {
    title: string;
    description: string;
    tagline: string;
    actions: { label: string; href: string; external?: boolean }[];
  };
  features: { icon: string; title: string; description: string }[];
  useCases: { title: string; description: string }[];
  nextSteps: string[];
}
