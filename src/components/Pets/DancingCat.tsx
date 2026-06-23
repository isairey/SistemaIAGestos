interface Props {
  visible: boolean;
}

export default function DancingCat({ visible }: Props) {
  if (!visible) return null;

  return (
    <img
       src="https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif"
      alt="cat"
      style={{
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 180,
        zIndex: 999,
      }}
    />
  );
}