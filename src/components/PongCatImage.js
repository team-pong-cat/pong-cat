import { forwardRef } from 'react';

const PongCatImage = forwardRef(function PongCatImage(
  { isOpen, closedImage, openImage, onMouseDown, onMouseUp },
  ref
) {
  return (
    <img
      ref={ref}
      className={`pong-cat-img${isOpen ? ' open' : ''}`}
      src={isOpen ? openImage : closedImage}
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
