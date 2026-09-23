# Wordmark

`wordmark-source.png` is the supplied artwork: 1931x470, pure white on
transparency. White-on-transparent is unusable as-is on a white page, so it is
traced to a path that takes `currentColor` instead of being shipped as an
image.

The alpha channel is the shape, not the colour channels, so the trace runs off
alpha:

    # alpha -> 1-bit PBM (potrace does not read PNG), then trace
    node -e "…extractChannel('alpha')… > /tmp/logo.pbm"
    potrace /tmp/logo.pbm --svg --turdsize 4 --alphamax 1.1 --opttolerance 0.3

Output lives in `src/components/ui/wordmark.tsx` (inlined, recolourable) and
`public/logo/wordmark.svg` (standalone, for the OG image or press use).
