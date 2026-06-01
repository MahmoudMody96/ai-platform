'use client';

// =============================================
// ToolDetailClient - Orchestrator
// =============================================
// This is the entry point used by /tools/[slug]/page.tsx.
// It is intentionally small: it owns the page-level state (copied link,
// optimistic review list, submit-in-flight) and composes the smaller
// pieces under src/components/tools/*.
//
// If you need to add a new section to the page, create a new component
// in src/components/tools/ and slot it in here — do not add more JSX
// directly to this file.
// =============================================

import * as React from 'react';
import { useParams } from 'next/navigation';

import { ToolHeader, ToolBreadcrumb } from '@/components/tools/ToolHeader';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolAbout, ToolFeatures } from '@/components/tools/ToolContent';
import { ToolReviews } from '@/components/tools/ToolReviews';
import { ToolAlternatives } from '@/components/tools/ToolAlternatives';
import { ToolSidebar } from '@/components/tools/ToolSidebar';
import { ToolFooter } from '@/components/tools/ToolFooter';
import type { ToolDetail, ToolReview } from '@/components/tools/types';

interface ToolDetailClientProps {
  tool: ToolDetail;
}

export function ToolDetailClient({ tool }: ToolDetailClientProps) {
  // useParams is kept here for future per-tool client routing needs.
  // Right now the page is server-rendered, but having access to the
  // slug lets us add view-tracking / per-tool analytics later.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const slug = params.slug as string;

  const [copied, setCopied] = React.useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [localReviews, setLocalReviews] = React.useState<ToolReview[]>(tool.recent_reviews);

  const handleCopyLink = React.useCallback(() => {
    if (typeof navigator === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleSubmitReview = React.useCallback(
    async (rating: number, content: string) => {
      setIsSubmittingReview(true);
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool_id: tool.id,
            rating,
            content,
          }),
        });

        const data = await response.json();
        if (data.success && data.data?.review) {
          setLocalReviews((prev) => [data.data.review, ...prev]);
        }
      } catch (error) {
        console.error('Error submitting review:', error);
      } finally {
        setIsSubmittingReview(false);
      }
    },
    [tool.id],
  );

  return (
    <div className="min-h-screen">
      <ToolHeader />
      <ToolBreadcrumb toolName={tool.name} category={tool.category} />

      <main className="container-custom py-8">
        <ToolHero
          tool={tool}
          localReviewCount={localReviews.length}
          onCopyLink={handleCopyLink}
          copied={copied}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ToolAbout description={tool.description} />
            <ToolFeatures features={tool.features} />
            <ToolReviews
              reviews={localReviews}
              onSubmit={handleSubmitReview}
              isSubmitting={isSubmittingReview}
            />
            <ToolAlternatives alternatives={tool.alternatives} />
          </div>

          <ToolSidebar tool={tool} onCopyLink={handleCopyLink} copied={copied} />
        </div>
      </main>

      <ToolFooter />
    </div>
  );
}
