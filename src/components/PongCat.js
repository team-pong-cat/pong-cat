import React, { useState, useEffect, useRef } from 'react';
import './PongCat.css';
import PongCatBackground from './PongCatBackground';
import PongCatCount from './PongCatCount';
import PongCatFloat from './PongCatFloat';
import PongCatImage from './PongCatImage';
import Hardmode from "./Hardmode";
import HardmodePongCat from "./HardmodePongCat";

const STORAGE_KEY = 'pong-cat-count';
const MIN_OPEN_MS = 100;

function PongCat() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
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
    openTimeRef.current = Date.now();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setCount((prev) => prev + 1);
    addFloat(position);
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
    if (isHardmode) return undefined;

    const handleKeyDown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.repeat) return;

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
      <PongCatCount count={count} />
      {isHardmode ? (
        <HardmodePongCat
          isOpen={isOpen}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      ) : (
        <PongCatImage
          ref={catImageRef}
          isOpen={isOpen}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      )}
      {floats.map((f) => (
        <PongCatFloat key={f.id} x={f.x} y={f.y} />
      ))}
    </PongCatBackground>
  );
}

export default PongCat;
