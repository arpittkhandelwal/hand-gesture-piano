/**
 * Simple MIDI Exporter (Format 0)
 * Allows users to download their session as a standard MIDI file.
 */

export function createMidiFile(events) {
  const header = [
    0x4D, 0x54, 0x68, 0x64, // MThd
    0x00, 0x00, 0x00, 0x06, // Size 6
    0x00, 0x00,             // Format 0
    0x00, 0x01,             // 1 track
    0x00, 0x80              // 128 ticks per quarter note
  ];

  const trackHeader = [0x4D, 0x54, 0x72, 0x6B]; // MTrk
  const trackEvents = [];
  
  let lastTime = events[0]?.time || 0;

  events.forEach(event => {
    const deltaTime = Math.max(0, Math.floor((event.time - lastTime) / 10)); // Simple conversion
    lastTime = event.time;

    // Delta Time (Variable Length Quantity - simplified for small values)
    trackEvents.push(deltaTime & 0x7F); 

    if (event.type === 'on') {
      trackEvents.push(0x90, event.noteNumber, 0x64); // Note On, Note, Velocity 100
    } else {
      trackEvents.push(0x80, event.noteNumber, 0x00); // Note Off, Note, Velocity 0
    }
  });

  // End of track meta-event
  trackEvents.push(0x00, 0xFF, 0x2F, 0x00);

  const trackSize = trackEvents.length;
  const trackSizeBuffer = [
    (trackSize >> 24) & 0xFF,
    (trackSize >> 16) & 0xFF,
    (trackSize >> 8) & 0xFF,
    trackSize & 0xFF
  ];

  const fullFile = new Uint8Array([...header, ...trackHeader, ...trackSizeBuffer, ...trackEvents]);
  return new Blob([fullFile], { type: 'audio/midi' });
}

export function downloadMidi(blob, filename = 'airpiano-session.mid') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Map note name (e.g. C3) to MIDI number
export function noteToMidi(fullNote) {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const match = fullNote.match(/^([A-G]#?)(\d)$/);
  if (!match) return 60;
  const semitone = notes.indexOf(match[1]);
  const octave = parseInt(match[2]);
  return (octave + 1) * 12 + semitone;
}
