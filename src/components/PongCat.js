import React, { useState, useEffect, useRef } from 'react';
import './PongCat.css';
import PongCatBackground from './PongCatBackground';
import PongCatCount from './PongCatCount';
import PongCatFloat from './PongCatFloat';
import PongCatImage from './PongCatImage';
import Hardmode from "./Hardmode";
import HardmodePongCat from "./HardmodePongCat";
import SkinShop from './SkinShop';
import SkinInventory from './SkinInventory';
import SKIN_CATALOG from './skinCatalog';
import popSound from '../assets/pop.mp3';

const STORAGE_KEY = 'pong-cat-count';
const OWNED_SKINS_STORAGE_KEY = 'pong-cat-owned-skins';
const EQUIPPED_SKIN_STORAGE_KEY = 'pong-cat-equipped-skin';
const DEFAULT_OWNED_SKINS = ['default'];
const DEFAULT_EQUIPPED_SKIN = 'default';
const MIN_OPEN_MS = 100;

const getStoredCount = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const parsed = saved ? parseInt(saved, 10) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getStoredOwnedSkinIds = () => {
  const storedSkinIds = localStorage.getItem(OWNED_SKINS_STORAGE_KEY);
  if (!storedSkinIds) return DEFAULT_OWNED_SKINS;

  try {
    const knownSkinIds = new Set(SKIN_CATALOG.map((skin) => skin.id));
    const parsedSkinIds = JSON.parse(storedSkinIds);
    if (!Array.isArray(parsedSkinIds)) return DEFAULT_OWNED_SKINS;

    return Array.from(
      new Set([
        ...DEFAULT_OWNED_SKINS,
        ...parsedSkinIds.filter((skinId) => knownSkinIds.has(skinId)),
      ])
    );
  } catch {
    return DEFAULT_OWNED_SKINS;
  }
};

const getStoredEquippedSkinId = (ownedSkinIds) => {
  const storedSkinId = localStorage.getItem(EQUIPPED_SKIN_STORAGE_KEY);
  if (storedSkinId && ownedSkinIds.includes(storedSkinId)) return storedSkinId;
  return DEFAULT_EQUIPPED_SKIN;
};

function PongCat() {
  const [shopState, setShopState] = useState(() => {
    const ownedSkinIds = getStoredOwnedSkinIds();
    return {
      count: getStoredCount(),
      ownedSkinIds,
      equippedSkinId: getStoredEquippedSkinId(ownedSkinIds),
    };
  });
  const { count, ownedSkinIds, equippedSkinId } = shopState;
  const equippedSkin =
    SKIN_CATALOG.find((skin) => skin.id === equippedSkinId) || SKIN_CATALOG[0];
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [floats, setFloats] = useState([]);

  const isPressedRef = useRef(false);
  const floatIdRef = useRef(0);
  const closeTimerRef = useRef(null);
  const openTimeRef = useRef(0);
  const catImageRef = useRef(null);
  const [isHardmode, setHardmode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem(OWNED_SKINS_STORAGE_KEY, JSON.stringify(ownedSkinIds));
  }, [ownedSkinIds]);

  useEffect(() => {
    localStorage.setItem(EQUIPPED_SKIN_STORAGE_KEY, equippedSkinId);
  }, [equippedSkinId]);

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    const elapsed = Date.now() - openTimeRef.current;
    const delay = Math.max(0, MIN_OPEN_MS - elapsed);
    closeTimerRef.current = setTimeout(() => {
      if (!isPressedRef.current) setIsOpen(false);
    }, delay);
  };

  const getFloatPosition = (e) => {
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      return { x: e.clientX, y: e.clientY };
    }

    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const getCatCenterPosition = () => {
    if (!catImageRef.current) return { x: 0, y: 0 };

    const rect = catImageRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const addFloat = (position) => {
    const id = floatIdRef.current++;
    setFloats((prev) => [...prev, { id, ...position }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 900);
  };

  const activatePongCat = (position) => {
    new Audio(popSound).play().catch(() => {});
    openTimeRef.current = Date.now();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setShopState((prev) => ({ ...prev, count: prev.count + 1 }));
    addFloat(position);
  };

  const handlePurchaseSkin = (skinId) => {
    setShopState((prev) => {
      const skin = SKIN_CATALOG.find((item) => item.id === skinId);
      if (!skin || prev.ownedSkinIds.includes(skinId) || prev.count < skin.price) {
        return prev;
      }

      return {
        ...prev,
        count: prev.count - skin.price,
        ownedSkinIds: [...prev.ownedSkinIds, skinId],
      };
    });
  };

  const handleEquipSkin = (skinId) => {
    setShopState((prev) => {
      if (!prev.ownedSkinIds.includes(skinId)) return prev;
      return { ...prev, equippedSkinId: skinId };
    });
  };

  const handleMouseDown = (e) => {
    isPressedRef.current = true;
    activatePongCat(getFloatPosition(e));
  };

  const handleMouseUp = () => {
    isPressedRef.current = false;
    scheduleClose();
  };

  useEffect(() => {
    if (isHardmode || isShopOpen || isInventoryOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.repeat) return;
      if (e.target?.closest?.('button, a, input, textarea, select')) return;

      e.preventDefault();
      isPressedRef.current = false;
      activatePongCat(getCatCenterPosition());
      scheduleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <PongCatBackground>
      <Hardmode isHardmode={isHardmode} setHardmode={setHardmode} />
      <div className="pong-cat-menu">
        <button
          className="pong-cat-menu-button"
          type="button"
          onClick={() => setIsShopOpen(true)}
        >
          상점
        </button>
        <button
          className="pong-cat-menu-button"
          type="button"
          onClick={() => setIsInventoryOpen(true)}
        >
          인벤토리
        </button>
      </div>
      <PongCatCount count={count} />
      {isHardmode ? (
        <HardmodePongCat
          isOpen={isOpen}
          closedImage={equippedSkin.closedImage}
          openImage={equippedSkin.openImage}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      ) : (
        <PongCatImage
          ref={catImageRef}
          isOpen={isOpen}
          closedImage={equippedSkin.closedImage}
          openImage={equippedSkin.openImage}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      )}
      {floats.map((f) => (
        <PongCatFloat key={f.id} x={f.x} y={f.y} />
      ))}
      <SkinShop
        count={count}
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onPurchase={handlePurchaseSkin}
        ownedSkinIds={ownedSkinIds}
        skins={SKIN_CATALOG}
      />
      <SkinInventory
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        onEquip={handleEquipSkin}
        ownedSkinIds={ownedSkinIds}
        equippedSkinId={equippedSkinId}
        skins={SKIN_CATALOG}
      />
    </PongCatBackground>
  );
}

export default PongCat;
