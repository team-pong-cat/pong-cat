import whipSound from "../assets/whip.mp3";
import { useEffect, useRef, useState } from "react";

const CAT_SIZE = 260;
const MOVE_INTERVAL_MS = 40;
const MOVE_STEP = 35;
const EVADE_DELAY_MS = 100;
const EVADE_MS = 180;

const getBounds = () => ({
  maxX: Math.max(0, window.innerWidth - CAT_SIZE),
  maxY: Math.max(0, window.innerHeight - CAT_SIZE),
});

const getRandomPosition = () => {
  const { maxX, maxY } = getBounds();
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  };
};

function HardmodePongCat({ isOpen, closedImage, openImage, onMouseDown, onMouseUp }) {
  const [position, setPosition] = useState(() => ({
    x: Math.max(0, window.innerWidth / 2 - CAT_SIZE / 2),
    y: Math.max(0, window.innerHeight / 2 - CAT_SIZE / 2),
  }));
  const [isEvading, setIsEvading] = useState(false);
  const directionRef = useRef({ x: 1, y: 1 });
  const evadeDelayTimerRef = useRef(null);
  const evadeTimerRef = useRef(null);
  const isEvadingRef = useRef(false);
  const mousePositionRef = useRef(null);

  const evade = () => {
    if (isEvadingRef.current || evadeDelayTimerRef.current) return;

    evadeDelayTimerRef.current = setTimeout(() => {
      evadeDelayTimerRef.current = null;
      isEvadingRef.current = true;
      new Audio(whipSound).play().catch(() => {});
      setIsEvading(true);
      setPosition(getRandomPosition());

      if (evadeTimerRef.current) clearTimeout(evadeTimerRef.current);
      evadeTimerRef.current = setTimeout(() => {
        isEvadingRef.current = false;
        setIsEvading(false);
      }, EVADE_MS);
    }, EVADE_DELAY_MS);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    document.addEventListener('mousemove', handleMouseMove);

    const moveTimer = setInterval(() => {
      setPosition((prev) => {
        const mousePosition = mousePositionRef.current;
        if (
          mousePosition &&
          mousePosition.x >= prev.x &&
          mousePosition.x <= prev.x + CAT_SIZE &&
          mousePosition.y >= prev.y &&
          mousePosition.y <= prev.y + CAT_SIZE
        ) {
          evade();
          return prev;
        }

        if (isEvadingRef.current) return prev;

        const { maxX, maxY } = getBounds();
        const direction = directionRef.current;

        let nextX = prev.x + direction.x * MOVE_STEP;
        let nextY = prev.y + direction.y * MOVE_STEP;

        if (nextX <= 0 || nextX >= maxX) {
          direction.x *= -1;
          nextX = Math.min(Math.max(nextX, 0), maxX);
        }

        if (nextY <= 0 || nextY >= maxY) {
          direction.y *= -1;
          nextY = Math.min(Math.max(nextY, 0), maxY);
        }

        return { x: nextX, y: nextY };
      });
    }, MOVE_INTERVAL_MS);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(moveTimer);
      if (evadeDelayTimerRef.current) clearTimeout(evadeDelayTimerRef.current);
      if (evadeTimerRef.current) clearTimeout(evadeTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    evade();
  };

  return (
    <img
      className={`pong-cat-img hardmode-pong-cat${isEvading ? ' evading' : ''}${isOpen ? ' open' : ''}`}
      style={{ left: position.x, top: position.y }}
      src={isOpen ? openImage : closedImage}
      alt="pong cat"
      role="button"
      tabIndex={0}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseEnter={handleMouseEnter}
      draggable={false}
    />
  )
}

export default HardmodePongCat;
