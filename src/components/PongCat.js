import React, { useState, useEffect, useRef } from 'react';
import './PongCat.css';
import catClosed from '../assets/cat-closed.png';
import catOpen from '../assets/cat-open.png';
import background from '../assets/background.png';

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

  const handleMouseDown = (e) => {
    isPressedRef.current = true;
    openTimeRef.current = Date.now();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
    setCount((prev) => prev + 1);

    const id = floatIdRef.current++;
    setFloats((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 900);
  };

  const handleMouseUp = () => {
    isPressedRef.current = false;
    scheduleClose();
  };

  return (
    <div
      className="pong-cat-bg"
      style={{ backgroundImage: `url(${background})` }}
    >
      <p className="pong-cat-count">{count.toLocaleString()}</p>
      <img
        className={`pong-cat-img${isOpen ? ' open' : ''}`}
        src={isOpen ? catOpen : catClosed}
        alt="pong cat"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        draggable={false}
      />
      {floats.map((f) => (
        <span
          key={f.id}
          className="pong-cat-float"
          style={{ left: f.x, top: f.y }}
        >
          +1
        </span>
      ))}
    </div>
  );
}

export default PongCat;
