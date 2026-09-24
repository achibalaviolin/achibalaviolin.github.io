# Hero video

Source: `hero-white-source.mp4`, 1920x1080, 10s, 24fps, supplied by the artist.
Shot on white, subject in the right of frame, with a pale ribbon that leaves
the violin and sweeps left across the empty half.

    ffmpeg -i hero-white-source.mp4 -movflags +faststart \
      -vf "crop=1700:1080:0:0,scale=1600:-2,hqdn3d=1.5:1:2:2" \
      -c:v libx264 -crf 29 -preset veryslow -pix_fmt yuv420p \
      -c:a aac -b:a 96k -ac 2 hero-white.mp4

The audio track is kept (AAC 96k; the source measures -20.9 LUFS integrated).
It costs about 0.12 MB. The video still starts muted, because browsers will
not autoplay audible media, and the hero carries a Sound on/off control.

## The audio: his own recording

The hero plays 2:12–2:22 of The Waltz of Chennai (official music video
track), 10s to match the loop exactly, with a 0.25s fade in and 0.6s fade
out so the loop point does not click. His master is left at its own level:
the cut measures -20.7 LUFS, the stock audio it replaced -20.9.

    ffmpeg -ss 132 -t 10 -i "The Waltz of Chennai - Official Music Video Achi Bala Violin ©.mp3" \
      -af "afade=t=in:st=0:d=0.25,afade=t=out:st=9.4:d=0.6" \
      -ar 48000 -c:a pcm_s16le ../audio/waltz-2m12-2m22.wav

    ffmpeg -i hero-white-stock-audio.mp4 -i ../audio/waltz-2m12-2m22.wav \
      -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -ac 2 -shortest \
      -movflags +faststart hero-white.mp4

The picture is stream-copied, so the headline sweep timings below still hold.
`hero-white-stock-audio.mp4` is the previous encode, with the stock clip's
audio, kept in case it is ever wanted back.

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
