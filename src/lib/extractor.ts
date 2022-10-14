import EventEmitter from "events";
import fontkit, { Font, Glyph } from "fontkit";
import { CodepointEncoder } from "./encoder";

export interface ExtractorOptions {
  codepointEncoder: CodepointEncoder;
}

export interface GlyphEntry {
  glyph: Glyph;
  codepoints: (string | string[])[];
}

export interface ExtractorResult {
  fontFamily: string;
  glyphs: GlyphEntry[];
}

export class Extractor extends EventEmitter {
  static readonly DEFAULT_OPTIONS: ExtractorOptions = {
    codepointEncoder: new CodepointEncoder(),
  };

  private _options: ExtractorOptions;

  private get _codepointEncoder() {
    return this._options.codepointEncoder!;
  }

  constructor(public readonly font: Font, options?: Partial<ExtractorOptions>) {
    super();
    this._options = Object.assign(Extractor.DEFAULT_OPTIONS, options);
  }

  getOptions() {
    return this._options;
  }

  setOptions(options: Partial<ExtractorOptions>) {
    this._options = Object.assign(Extractor.DEFAULT_OPTIONS, options);
    return this;
  }

  /**
   * Create a new Extractor instance from file path (async)
   */
  static fromFile(
    path: string,
    postscriptName?: string,
    options?: ExtractorOptions
  ) {
    return new Promise<Font>((resolve, reject) => {
      fontkit.open(path, postscriptName!, (err, font) => {
        if (err) {
          return reject(err);
        }
        return resolve(font);
      });
    }).then((font) => Extractor.from(font, options));
  }

  /**
   * Create a new Extractor instance from file path (sync)
   */
  static fromFileSync(
    path: string,
    postscriptName?: string,
    options?: ExtractorOptions
  ) {
    const font = fontkit.openSync(path, postscriptName);
    return Extractor.from(font, options);
  }

  /**
   * Create a new Extractor instance from Buffer
   */
  static fromBuffer(
    buffer: Buffer,
    postscriptName?: string,
    options?: ExtractorOptions
  ) {
    const font = fontkit.create(buffer, postscriptName);
    return Extractor.from(font, options);
  }

  /**
   * Create a new Extractor instance from Font
   */
  static from(font: Font, options?: ExtractorOptions) {
    return new Extractor(font, options);
  }

  //============================================================
  private _getGlyphCodes(glyph: Glyph) {
    const strings = this.font.stringsForGlyph(glyph.id);
    const codes = strings.map((v) => this._codepointEncoder.encode(v));
    return codes;
  }

  extract(): ExtractorResult {
    const entries: GlyphEntry[] = Array.from(
      { length: this.font.numGlyphs },
      (_, i) => {
        const glyph = this.font.getGlyph(i);
        const codepoints = this._getGlyphCodes(glyph);
        return {
          name: glyph.name,
          codepoints,
          glyph,
        };
      }
    ).filter((e) => !!e.name);

    return {
      fontFamily: this.font.familyName,
      glyphs: entries,
    };
  }
}
