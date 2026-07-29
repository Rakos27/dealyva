export function PromotionSkeleton() {
  return (
    <div className="promotion-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--media" />
      <div className="promotion-card__body">
        <div className="skeleton skeleton--tiny" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--title-short" />
        <div className="skeleton skeleton--price" />
        <div className="skeleton skeleton--button" />
      </div>
    </div>
  );
}
