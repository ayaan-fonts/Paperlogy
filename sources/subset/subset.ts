import {
  FONTFAMILY,
  getFontList,
  IFontInfo,
  subsets,
  Tformat,
  TSubsetKinds,
} from "./subset-utils";

// subset_glyphs.txt only covers Korean/English glyphs, so the language-based
// static subset ("glyph") is skipped for PaperlogyJP.
const fontLists: { fontList: IFontInfo; withGlyphSubset: boolean }[] = [
  { fontList: getFontList(FONTFAMILY.Paperlogy), withGlyphSubset: true },
  { fontList: getFontList(FONTFAMILY.PaperlogyJP), withGlyphSubset: false },
];

// Every family shares the same output folders (woff/, glyph-subset/, ...),
// so all families must go through a single subsets() call - each call clears
// its output folders from scratch, and a per-family call would wipe out the
// previous family's files.
const jobs = fontLists.flatMap(
  ({ fontList, withGlyphSubset }): [TSubsetKinds, Tformat, IFontInfo][] => [
    // Static full-glyph webfont. woff2 already ships as the official
    // release, so only woff needs to be generated here.
    ["static", "woff", fontList],

    // Language-based static subset
    ...(withGlyphSubset
      ? ([
          ["glyph", "woff", fontList],
          ["glyph", "woff2", fontList],
        ] as [TSubsetKinds, Tformat, IFontInfo][])
      : []),

    // Per-request dynamic subset (Google Fonts style)
    ["dynamic", "woff", fontList],
    ["dynamic", "woff2", fontList],
  ],
);

subsets(...jobs);
