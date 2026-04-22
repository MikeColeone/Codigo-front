import type { TemplatePreset } from '@codigo/schema';
import { adminAnalyticsScreenTemplate } from 'src/modules/template/data/admin-analytics-screen';
import { adminConsoleStandardTemplate } from 'src/modules/template/data/admin-console-standard';
import { adminSystemBasicTemplate } from 'src/modules/template/data/admin-system-basic';

export const DEFAULT_TEMPLATE_PRESETS: TemplatePreset[] = [
  adminAnalyticsScreenTemplate,
  adminConsoleStandardTemplate,
  adminSystemBasicTemplate,
];
