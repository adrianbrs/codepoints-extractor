import type { Glyph } from "fontkit";

declare module "fontkit" {
  interface Font {
    /**
     * Returns a glyph object for the given glyph id.
     * You can pass the array of code points this glyph represents for
     * your use later, and it will be stored in the glyph object.
     */
    getGlyph(glyph: number, characters?: number[]): Glyph;
  }

  interface Glyph {
    /**
     * The glyph's name
     */
    get name(): string;

    /**
     * Renders the glyph to the given graphics context, at the specified font size.
     */
    render(ctx: CanvasRenderingContext2D, size: number): void;
  }
}
