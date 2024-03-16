import * as fs from 'fs';
import { dirname } from 'path';
import { MarkdownParserInterface } from '../interfaces/markdown-parser.interface';

export abstract class MarkdownParser implements MarkdownParserInterface {
  protected constructor(
    private readonly path: string,
    protected readonly out?: string
  ) {}

  abstract parse(): void;

  protected readMarkdown(): string {
    const isExists = fs.existsSync(this.path);
    if (!isExists) throw new Error('file not found');
    return fs.readFileSync(this.path, 'utf-8');
  }

  protected writeResult(text: string): void {
    const path = dirname(this.out);
    const isExists = fs.existsSync(path);
    if (!isExists) throw new Error('out is not correct');
    fs.writeFileSync(this.out, text);
  }
}
