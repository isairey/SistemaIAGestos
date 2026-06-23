interface Props {
  visible: boolean;
}

export default function DancingCat({ visible }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        left: 100,
        zIndex: 99999,
        background: "white",
        padding: 20,
        border: "2px solid red",
      }}
    >
      <h2>GATO TEST</h2>

      <img
        src="200.gif"
        alt="cat"
        style={{
          width: 250,
        }}
      />
    </div>
  );
}