import { nyangnyangTuner } from './nyangnyang-tuner';
import type { ServiceSummary, ServiceDetail } from './types';

export const services: ServiceSummary[] = [nyangnyangTuner];

export const serviceDetails: Record<string, ServiceDetail> = {
  [nyangnyangTuner.slug]: nyangnyangTuner,
};
