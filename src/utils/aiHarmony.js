/**
 * AI Harmony Logic
 * Maps a single note to a harmonic companion to create lush, professional sound.
 */

const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNoteParts(fullNote) {
  const match = fullNote.match(/^([A-G]#?)(\d)$/);
  if (!match) return null;
  return { note: match[1], octave: parseInt(match[2]) };
}

export function getHarmonicCompanion(fullNote) {
  const parts = getNoteParts(fullNote);
  if (!parts) return null;

  const { note, octave } = parts;
  const index = SEMITONES.indexOf(note);

  // AI Rule 1: Add a perfect 5th (7 semitones up)
  // AI Rule 2: If perfect 5th is too high, add a 4th or stay in octave
  let companionIndex = (index + 7) % 12;
  let companionOctave = octave + Math.floor((index + 7) / 12);

  // If the companion octave is getting too high, drop it back down
  if (companionOctave > 6) {
    companionOctave -= 1;
  }

  return `${SEMITONES[companionIndex]}${companionOctave}`;
}

export function getSubBassCompanion(fullNote) {
  const parts = getNoteParts(fullNote);
  if (!parts) return null;
  
  // Add a bass note 1 or 2 octaves below
  return `${parts.note}${Math.max(1, parts.octave - 2)}`;
}
