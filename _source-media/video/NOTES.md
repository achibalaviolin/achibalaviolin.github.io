# Hero video

Source: `hero-white-source.mp4`, 1920x1080, 10s, 24fps, supplied by the artist.
Shot on white, subject in the right of frame, with a pale ribbon that leaves
the violin and sweeps left across the empty half.

    ffmpeg -i hero-white-source.mp4 -an -movflags +faststart \
      -vf "crop=1700:1080:0:0,scale=1600:-2,hqdn3d=1.5:1:2:2" \
      -c:v libx264 -crf 29 -preset veryslow -pix_fmt yuv420p hero-white.mp4

0.71 MB from a 3.3 MB source. The crop to 1700 wide removes a four-point
sparkle watermark baked into the bottom-right of the frame, and still leaves
the subject comfortably in shot.

`hqdn3d` is worth keeping even here. On the earlier, particle-heavy footage it
was the difference between 4.2 MB and 1.9 MB at the same CRF, because the
encoder spends its bitrate on drifting grain.

No WebM. On the earlier footage VP9 came out at 2.93 MB against H.264's
1.92 MB at matched quality, so shipping it would only have handed some
browsers the heavier file.

## The headline sweep

`src/components/sections/hero-headline.tsx` lights the headline as the ribbon
crosses it. The window is measured off this encode, not guessed: detail in the
left 44% of frame is flat until 3.5s, rises through 5.0s, holds to 7.5s and is
gone by 9.0s. Hence SWEEP_IN 3.6 and SWEEP_OUT 8.0. Re-measure if the footage
is ever replaced.
