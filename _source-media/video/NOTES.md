# Hero video

Source: `hero-source.mp4`, 1920x1080, 10s, 24fps, supplied by the artist.

Encoded with:

    ffmpeg -i hero-source.mp4 -an -movflags +faststart \
      -vf "scale=1600:-2,hqdn3d=2:1:3:3" \
      -c:v libx264 -crf 30 -preset veryslow -pix_fmt yuv420p hero-full.mp4

`hqdn3d` matters more than the CRF here. The footage is full of drifting
sparkle particles, and the encoder was spending most of its bitrate on that
grain: without the denoise the same CRF produced 4.2 MB instead of 1.9 MB.

No WebM. VP9 at a matched quality came out at 2.93 MB against H.264's 1.92 MB
for this content, so shipping it would only have given some browsers the
heavier file.

The ribbon variant crops to the right of the frame (`crop=1080:830:840:0`),
which is the glowing sound-ribbon with no face in shot. The height is
cropped to 830 rather than 1080 to exclude a four-point sparkle watermark
baked into the bottom-right of the source.
