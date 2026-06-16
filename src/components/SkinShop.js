import { useEffect } from 'react';

function SkinShop({ count, isOpen, onClose, onPurchase, ownedSkinIds, skins }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="skin-shop-backdrop" onMouseDown={onClose}>
      <section
        className="skin-shop-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skin-shop-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="skin-shop-header">
          <div>
            <h2 id="skin-shop-title">스킨 상점</h2>
            <span className="skin-shop-balance">
              보유 클릭: {count.toLocaleString()}
            </span>
          </div>
          <button className="skin-shop-close" type="button" onClick={onClose}>
            X
          </button>
        </header>

        <div className="skin-shop-grid">
          {skins.map((skin) => {
            const isOwned = ownedSkinIds.includes(skin.id);
            const canBuy = count >= skin.price;
            const isLocked = !isOwned && !canBuy;
            const isFree = skin.price === 0;
            const missingClicks = Math.max(0, skin.price - count);
            const cardStatus = isOwned
              ? '보유중'
              : isLocked
                ? `${missingClicks.toLocaleString()} 클릭 부족`
                : '구매 가능';
            const buttonText = isOwned
              ? '구매 완료'
              : isLocked
                ? '클릭 부족'
                : '구매';
            const cardClassName = [
              'skin-card',
              isOwned ? 'skin-card-owned' : '',
              isLocked ? 'skin-card-locked' : '',
            ].filter(Boolean).join(' ');
            const buttonClassName = [
              'skin-buy-button',
              isOwned ? 'skin-buy-button-owned' : '',
              isLocked ? 'skin-buy-button-locked' : '',
            ].filter(Boolean).join(' ');

            return (
              <article className={cardClassName} key={skin.id}>
                <div className="skin-preview">
                  <img
                    className="skin-preview-img skin-preview-closed"
                    src={skin.closedImage}
                    alt={`${skin.name} closed`}
                    draggable={false}
                  />
                  <img
                    className="skin-preview-img skin-preview-open"
                    src={skin.openImage}
                    alt={`${skin.name} open`}
                    draggable={false}
                  />
                </div>

                <div className="skin-card-info">
                  <h3>{skin.name}</h3>
                  <span>{isFree ? '무료' : `${skin.price.toLocaleString()} 클릭`}</span>
                </div>

                <p className="skin-card-status">{cardStatus}</p>

                <button
                  className={buttonClassName}
                  type="button"
                  disabled={isOwned || !canBuy}
                  onClick={() => onPurchase(skin.id)}
                >
                  {buttonText}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SkinShop;
