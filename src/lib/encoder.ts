import merge from "lodash.merge";
import { ICodepointEncoder } from "./interfaces/encoder.interface";

export interface CodepointEncoderOptions {
  surrogates: boolean;
  radix: number;
}

export class CodepointEncoder implements ICodepointEncoder {
  static readonly DEFAULT_OPTIONS: CodepointEncoderOptions = {
    surrogates: false,
    radix: 16,
  };

  readonly options: CodepointEncoderOptions;

  constructor(options?: Partial<CodepointEncoderOptions>) {
    this.options = Object.assign(CodepointEncoder.DEFAULT_OPTIONS, options);
  }

  private _encodeWithSurrogates(value: string) {
    const result: string[] = [];
    for (let i = 0; i < value.length; i++) {
      result.push(value.charCodeAt(i).toString(this.options.radix));
    }
    return result;
  }

  encode(value: string): string | string[] {
    if (this.options.surrogates) {
      return this._encodeWithSurrogates(value);
    }
    return value.codePointAt(0)?.toString(this.options.radix) ?? "";
  }
}
