export const NOTES = [
  { note: "C", type: "white" },
  { note: "C#", type: "black" },
  { note: "D", type: "white" },
  { note: "D#", type: "black" },
  { note: "E", type: "white" },
  { note: "F", type: "white" },
  { note: "F#", type: "black" },
  { note: "G", type: "white" },
  { note: "G#", type: "black" },
  { note: "A", type: "white" },
  { note: "A#", type: "black" },
  { note: "B", type: "white" }
];

export function getOctaveNotes(octave) {
  return NOTES.map(n => ({
    ...n,
    fullNote: `${n.note}${octave}`,
    id: `${n.note}${octave}`
  }));
}

export function getAllNotes(startOctave = 3, numOctaves = 2) {
  let all = [];
  for (let i = 0; i < numOctaves; i++) {
    all = [...all, ...getOctaveNotes(startOctave + i)];
  }

  // Pre-calculate xRange for each note for tap detection
  const totalNotes = all.length;
  return all.map((note, index) => ({
    ...note,
    xRange: [index / totalNotes, (index + 1) / totalNotes]
  }));
}
