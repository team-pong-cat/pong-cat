import { useEffect } from 'react';

function SkinInventory({ isOpen, onClose, onEquip, ownedSkinIds, equippedSkinId, skins }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ownedSkins = skins.filter((skin) => ownedSkinIds.includes(skin.id));

  return (
    <div className="skin-shop-backdrop" onMouseDown={onClose}>
      <section
        className="skin-shop-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skin-inventory-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="skin-shop-header">
          <div>
            <h2 id="skin-inventory-title">인벤토리</h2>
            <span className="skin-shop-balance">
              보유 스킨: {ownedSkins.length}개
            </span>
          </div>
          <button className="skin-shop-close" type="button" onClick={onClose}>
            X
          </button>
        </header>

        <div className="skin-shop-grid">
          {ownedSkins.map((skin) => {
            const isEquipped = skin.id === equippedSkinId;
            const cardClassName = [
              'skin-card',
              isEquipped ? 'skin-card-equipped' : '',
            ].filter(Boolean).join(' ');
            const buttonClassName = [
              'skin-buy-button',
              isEquipped ? 'skin-buy-button-owned' : '',
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
                </div>

                <p className="skin-card-status">
                  {isEquipped ? '장착중' : '보유중'}
                </p>

                <button
                  className={buttonClassName}
                  type="button"
                  disabled={isEquipped}
                  onClick={() => onEquip(skin.id)}
                >
                  {isEquipped ? '장착중' : '장착'}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SkinInventory;
