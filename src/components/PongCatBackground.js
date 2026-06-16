import background from '../assets/background.webp';

function PongCatBackground({ children }) {
  return (
    <div
      className="pong-cat-bg"
      style={{ backgroundImage: `url(${background})` }}
    >
      {children}
    </div>
  );
}

export default PongCatBackground;
