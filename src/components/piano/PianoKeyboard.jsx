import React from 'react';
import PianoKey from './PianoKey';
import { getAllNotes } from '../../utils/noteMapping';

export default function PianoKeyboard({ pressedNotes, aiPressedNotes = new Set(), ghostNotes = new Set(), onPlay, onStop }) {
  const allNotes = getAllNotes(3, 2); // 2 octaves starting from C3

  return (
    <div className="flex justify-center items-start w-full overflow-x-auto py-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl px-12 no-scrollbar">
      <div className="flex min-w-max">
        {allNotes.map((noteObj) => (
          <PianoKey
            key={noteObj.id}
            note={noteObj.fullNote}
            type={noteObj.type}
            isPressed={pressedNotes.has(noteObj.fullNote)}
            isAiPressed={aiPressedNotes.has(noteObj.fullNote)}
            isGhost={ghostNotes.has(noteObj.fullNote)}
            onPlay={onPlay}
            onStop={onStop}
          />
        ))}
      </div>
    </div>
  );
}
