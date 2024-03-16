import * as fs from 'fs';
import { dirname } from 'path';
import { CaseDto } from '../dto/case.dto';

export class MarkdownParser {
  constructor(
    private readonly path: string,
    protected readonly out?: string
  ) {}

  protected readonly preformattedText: string[] = [];

  protected readonly cases: CaseDto[] = [
    {
      pattern: /(?<=[ ,.:;\n\t]|^)\*\*(?=\S)(.+?)(?<=\S)\*\*(?=[ ,.:;\n\t]|$)/g,
      html: '<b>$1</b>',
      escape: '\x1b[1m$1\x1b[22m',
    },
    {
      pattern: /(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g,
      html: '<i>$1</i>',
      escape: '\x1b[3m$1\x1b[23m',
    },
    {
      pattern: /(?<=[ ,.:;\n\t]|^)`(?=\S)(.+?)(?=\S)`(?=[ ,.:;\n\t]|$)/g,
      html: '<tt>$1</tt>',
      escape: '\x1b[7m$1\x1b[27m',
    },
  ];

  protected removePreformattedText(text: string): string {
    const preformattedText = text.match(/```([\s\S]*?)```/g);
    if (!preformattedText) return text;

    this.preformattedText.push(...preformattedText);
    return preformattedText.reduce(
      (acc, cur, index) => acc.replace(cur, `PRE{{${index}}}PRE`),
      text
    );
  }

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
