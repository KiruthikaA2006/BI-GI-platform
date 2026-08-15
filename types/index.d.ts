declare module "papaparse" {
  export interface ParseConfig {
    header?: boolean;
    skipEmptyLines?: boolean | "greedy";
    complete?: (results: ParseResult<any>) => void;
    error?: (error: any) => void;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: any[];
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      fields?: string[];
      truncated: boolean;
    };
  }

  export function parse<T>(file: File | string, config?: ParseConfig): ParseResult<T>;
}
