import catClosed from '../assets/cat-closed.png';
import catOpen from '../assets/cat-open.png';

function PongCatImage({ isOpen, onMouseDown, onMouseUp }) {
  return (
    <img
      className={`pong-cat-img${isOpen ? ' open' : ''}`}
      src={isOpen ? catOpen : catClosed}
      alt="pong cat"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      draggable={false}
    />
  );
}

export default PongCatImage;
