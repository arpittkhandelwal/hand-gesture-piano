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

/**
 * Generates a mapping of all notes to their precise visual boundaries.
 * Accounts for 2-layer layout (White keys base, Black keys overlapping).
 */
export function getAllNotes(startOctave = 3, numOctaves = 2) {
  let notes = [];
  for (let i = 0; i < numOctaves; i++) {
    notes = [...notes, ...getOctaveNotes(startOctave + i)];
  }

  const whiteNotes = notes.filter(n => n.type === 'white');
  const whiteKeyWidth = 1 / whiteNotes.length;

  let whiteCount = 0;
  return notes.map((note) => {
    let xRange;
    if (note.type === 'white') {
      const start = whiteCount * whiteKeyWidth;
      const end = (whiteCount + 1) * whiteKeyWidth;
      xRange = [start, end];
      whiteCount++;
    } else {
      // Black keys are centered on the border between two white keys
      // They typically occupy ~60-70% of the relative width
      const center = whiteCount * whiteKeyWidth;
      const width = whiteKeyWidth * 0.6;
      xRange = [center - width / 2, center + width / 2];
    }

    return { ...note, xRange };
  });
}
