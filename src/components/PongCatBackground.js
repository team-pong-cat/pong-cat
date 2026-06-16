import background from '../assets/background.png';

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
