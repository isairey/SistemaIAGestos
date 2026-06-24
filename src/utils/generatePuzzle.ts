export type PuzzlePiece = {
  id: string;
  row: number;
  col: number;
};

export function generatePuzzle(image: string, size = 3): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      pieces.push({
        id: `${row}-${col}`,
        row,
        col,
      });
    }
  }

  return shuffle(pieces);
}

function shuffle<T>(array: T[]): T[] {
  return array
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}