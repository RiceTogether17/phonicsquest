# Phoneme audio QA

Closes VALIDITY_ROADMAP.md 1.5 (schwa intrusion) for the recordings in
`public/audio/phonemes/`. Every clip was decoded and measured frame by frame
(10 ms hop): loudness, zero-crossing rate, voicing (autocorrelation), and the
first three formants of voiced frames (LPC). The method is in
`scripts/audio/fix-phoneme-clips.sh`'s header; the numbers are below so the
next person can check them.

## Why it matters

An isolated consonant recorded as "buh" teaches a child to blend b‑a‑t as
"buh‑a‑t", which is not "bat". The giveaway in the signal is the first
formant (F1, how open the mouth is) rising after the consonant into an open
vowel — roughly 300–470 Hz for the consonant, 750–930 Hz for the "uh".

## What the measurements found

| Clip                            | Finding                                         | Action         |
| ------------------------------- | ----------------------------------------------- | -------------- |
| p t k c ch f h s sh th x soft_c | No voicing at all after the consonant           | None — clean   |
| m n ng l r v z                  | Voiced throughout; F1 stays closed to the end   | None — clean   |
| d                               | Brief voice bar, F1 stays ~390 Hz               | None — clean   |
| b                               | F1 483 → 911 Hz over 0.04–0.11 s ("buh")        | Cut at 0.07 s  |
| g                               | F1 436 → 759 Hz over 0.09–0.12 s ("guh")        | Cut at 0.095 s |
| j, soft_g (same recording)      | F1 346 → 835 Hz over 0.10–0.19 s ("juh")        | Cut at 0.14 s  |
| y                               | F1 ~300 Hz to 0.08 s, then → 938 Hz ("yuh")     | Cut at 0.095 s |
| w                               | F1 ~260–330 Hz to 0.12 s, then → 863 Hz ("wuh") | Cut at 0.13 s  |
| q (/kw/)                        | Same opening as w ("kwuh")                      | Cut at 0.15 s  |

Each cut ends in a 20 ms fade. Re-measured afterwards, every trimmed clip
ends with F1 at or below ~470 Hz — the consonant, with no vowel after it.

## The /aw/ recording

There was no `aw.mp3`, so saw, paw, dawn and the rest of the /aw/ stage
fell back to the device's text-to-speech voice. The `or` clip begins with a
steady /ɔː/ (F1 ≈ 545 Hz, F2 ≈ 970 Hz, F3 ≈ 2950 Hz) for 0.11 s; its
r-colouring starts after that, where F3 falls to ~2000 Hz. That steady part,
slowed to a natural vowel length (0.2 s), is now `aw.mp3`: a recorded /aw/
in the same voice, with no r. Measured: F1 543, F2 971, F3 2913 Hz.

## The two oo sounds

`long_oo.mp3` and `short_oo.mp3` were a different, lower voice (≈ 98 Hz)
from every other clip (≈ 175–260 Hz), so a child sounding out "book" heard
the speaker change on the vowel. They are now cut from the main voice's
`long_u` clip ("you"), which glides y → a fronted u → a steady back /uː/ →
a laxer /ʊ/ as it trails off:

| New clip   | Taken from          | Measured F1 / F2 | Pitch  | Length | Textbook (adult female) |
| ---------- | ------------------- | ---------------- | ------ | ------ | ----------------------- |
| `long_oo`  | long_u 0.69–0.825 s | 362 / 968 Hz     | 191 Hz | 0.37 s | /uː/ ≈ 460 / 1100 Hz    |
| `short_oo` | long_u 0.85–0.975 s | 457 / 1097 Hz    | 157 Hz | 0.24 s | /ʊ/ ≈ 520 / 1225 Hz     |

Both are back, rounded vowels with no trace of the "y" (no frame of
`long_oo` has F2 above 1300 Hz), and /ʊ/ is more open than /uː/, as it
should be. Each is slowed to a natural vowel length and matched in
loudness to the other vowels (mean ≈ −19 dB).

## The schwa

There was no /ə/ recording; it played the short-u clip, so the "-le" in
"table" and the "a" in "about" sounded like the stressed /ʌ/ of "cup".
`schwa.mp3` is the opening of the main voice's short-u clip (0–0.08 s),
where the vowel is still mid-central (F1 ≈ 600, F2 ≈ 1475 Hz) before it
opens further. It is kept short (0.16 s) and about 4 dB softer than the
other vowels, because a schwa is the weak, unstressed "uh".
`APPROXIMATE_PHONEME_AUDIO` is now empty: no sound plays a stand-in.

`aw.mp3` was also 7 dB louder than the other vowels; it now matches them.

## Rebuilding

`scripts/audio/fix-phoneme-clips.sh` reads the ORIGINAL clips from a fixed
commit and rewrites the trimmed ones, so it can be re-run safely. To undo a
trim, restore that file from the commit named in the script.

## Still open

- These clips are made from existing recordings, not recorded fresh. They
  measure right, but a teacher should listen on a real device, especially
  to b and g (now short) and the three new vowels. A fresh recording of
  the oo sounds and the schwa by the main speaker would still be better.
