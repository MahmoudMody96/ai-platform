// Barrel for the tool-detail subcomponents.
// Keeps the orchestrator (ToolDetailClient) imports short and stable.
export { ToolHeader, ToolBreadcrumb } from './ToolHeader';
export { ToolHero } from './ToolHero';
export { ToolAbout, ToolFeatures } from './ToolContent';
export { ToolReviews } from './ToolReviews';
export { ToolAlternatives } from './ToolAlternatives';
export { ToolSidebar } from './ToolSidebar';
export { ToolFooter } from './ToolFooter';

export type {
  ToolDetail,
  ToolReview,
  ToolAlternative,
  ToolCategory,
  ToolFeature,
  ToolStats,
  ToolAuthor,
  PricingType,
} from './types';

export { getPricingLabel, formatDate, getInitials, getShareUrl } from './utils';
export type { PricingBadge } from './utils';
