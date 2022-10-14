import { write, writeFile, writeFileSync } from "fs";
import path from "path";
import yaml from "yaml";
import { ExtractorResult } from "./extractor";

export interface ExporterOptions {
  output: string;
  type: "json" | "csv" | "yaml";
  filenameReplacer: (familyName: string) => string;
}

export class Exporter {
  static readonly DEFAULT_OPTIONS: ExporterOptions = {
    output: "./",
    type: "json",
    filenameReplacer: (familyName: string) => {
      return familyName.toLowerCase().replace(/\s+/g, "-");
    },
  };

  private readonly _options: ExporterOptions;

  constructor(options?: Partial<ExporterOptions>) {
    this._options = Object.assign(Exporter.DEFAULT_OPTIONS, options);
  }

  static export(result: ExtractorResult, options?: ExporterOptions) {
    const exporter = new Exporter(options);
    return exporter.export(result);
  }

  export(result: ExtractorResult) {
    const { fontFamily, glyphs } = result;
    const { output, type, filenameReplacer } = this._options;

    const fileName = filenameReplacer(fontFamily);
    const outputFile = path.resolve(
      process.cwd(),
      output,
      `${fileName}-codepoints.${type}`
    );
    // const outputData = {
    //   glyphs: glyphs.reduce((res, { glyph: { name }, codepoints }) => {
    //     res[name] = codepoints;
    //     return res;
    //   }, {} as Record<string, (string | string[])[]>),
    // };
    const outputData = glyphs.map(({ glyph: { name }, codepoints }) => ({
      name,
      codepoint: codepoints[0],
    }));

    if (type === "yaml") {
      writeFileSync(outputFile, yaml.stringify(outputData), {
        encoding: "utf-8",
      });
    } else if (type === "json") {
      writeFileSync(outputFile, JSON.stringify(outputData, null, 2), {
        encoding: "utf-8",
      });
    }
  }
}
