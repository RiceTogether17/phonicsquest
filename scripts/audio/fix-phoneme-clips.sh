#!/usr/bin/env bash
# Rebuild the phoneme clips that carried a vowel after the consonant, and
# derive the /aw/ clip, from the ORIGINAL recordings at a fixed commit.
#
# Why: VALIDITY_ROADMAP.md 1.5 (schwa intrusion). An isolated consonant
# recorded as "buh" teaches the child to blend b-a-t as "buh-a-t", which
# does not make "bat". Each clip below was measured frame by frame (LPC
# formants, voicing): the first formant rises from a closed consonant
# (~300-470 Hz) into an open vowel (~750-930 Hz) where the "uh" starts.
# The cut sits just before that rise, with a 20 ms fade so there is no
# click. Measurements and cut points are recorded in AUDIO_QA.md.
#
# /aw/ had no recording (the device voice said it). The "or" clip opens
# with a steady /ɔː/ (F1 ~545 Hz, F2 ~970 Hz) before its r-colouring
# begins at 0.11 s (F3 falls from ~2950 to ~2000 Hz), so that steady part,
# slowed to a natural vowel length, is a recorded /aw/ in the same voice.
#
# Reads originals from git, so running it twice gives the same result.
# Usage: scripts/audio/fix-phoneme-clips.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
SRC_REV=3f808af
OUT=public/audio/phonemes
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

enc=(-ac 1 -ar 44100 -c:a libmp3lame -b:a 128k)

trim() { # name end_seconds
  git show "$SRC_REV:$OUT/$1.mp3" > "$TMP/$1.mp3"
  local fade_start
  fade_start=$(awk "BEGIN{print $2 - 0.02}")
  ffmpeg -v error -y -i "$TMP/$1.mp3" \
    -af "atrim=0:$2,afade=t=out:st=$fade_start:d=0.02" "${enc[@]}" "$OUT/$1.mp3"
}

trim b 0.07
trim g 0.095
trim j 0.14
trim soft_g 0.14
trim y 0.095
trim w 0.13
trim q 0.15

git show "$SRC_REV:$OUT/or.mp3" > "$TMP/or.mp3"
ffmpeg -v error -y -i "$TMP/or.mp3" \
  -af "atrim=0:0.115,atempo=0.55,afade=t=out:st=0.17:d=0.04" "${enc[@]}" "$OUT/aw.mp3"

echo "Rebuilt b g j soft_g y w q and created aw from $SRC_REV."
