function Hardmode({isHardmode, setHardmode}) {
  return (
    <button className={`hardmodeButton ${isHardmode ? "hard" : "normal"}`} onClick={() => setHardmode((prev) => !prev)}>{isHardmode ? "Hard" : "Normal"}</button>
  )
}

export default Hardmode;