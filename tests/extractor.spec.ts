import path from "path";
import { CodepointEncoder } from "../src/lib/encoder";
import { Extractor } from "../src/lib/extractor";
import { Exporter } from "../src/lib/exporter";

describe("Extract codepoints from .ttf font files", function () {
  it("should extract codepoints from file sync", function () {
    const extractor = Extractor.fromFileSync(
      path.resolve(__dirname, "fonts/materialdesignicons-webfont.ttf")
    );

    const result = extractor.extract();

    Exporter.export(result);

    expect(extractor.font).toBeTruthy();
  });
});
