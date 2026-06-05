import { forwardRef } from 'react';
import catClosed from '../assets/cat-closed.png';
import catOpen from '../assets/cat-open.png';

const PongCatImage = forwardRef(function PongCatImage(
  { isOpen, onMouseDown, onMouseUp },
  ref
) {
  return (
    <img
      ref={ref}
      className={`outline-none pong-cat-img${isOpen ? ' open' : ''}`}
      src={isOpen ? catOpen : catClosed}
      alt="pong cat"
      role="button"
      tabIndex={0}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      draggable={false}
    />
  );
});

export default PongCatImage;
