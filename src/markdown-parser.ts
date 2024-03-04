import * as fs from 'fs';

export class MarkdownParser {
  constructor (
    private readonly path: string,
    private readonly out?: string,
  ) {}

  private readonly cases = [
    { pattern: /\*\*(.+?)\*\*/g, replacement: '<b>$1</b>' },
    { pattern: /_(.+?)_/g, replacement: '<i>$1</i>' },
    { pattern: /`(.+?)`/g, replacement: '<tt>$1</tt>' },
  ]

  private preformattedText: string[] = [];

  parse() {
    const file = this.readFile();
    const formattedText = this.removePreformattedText(file);
    const html = this.cases.reduce((acc, cur) =>
      acc.replace(cur.pattern, cur.replacement), formattedText);
    const htmlWithParagraphs = this.setParagraphs(html);
    console.log(this.setPreformattedText(htmlWithParagraphs));
  }

  private removePreformattedText (text: string): string {
    const preformattedText = text.match(/```([\s\S]*?)```/g);
    if (!preformattedText) return text;
    this.preformattedText.push(...preformattedText);
    return preformattedText.reduce((acc, cur, index) =>
      acc.replace(cur, `PRE{{${index}}}PRE`), text)
  }

  private setPreformattedText (text: string): string {
    return this.preformattedText.reduce((acc, cur, index) => {
      const html = `<pre>${cur.replace(/```/g, '')}</pre>`;
      return acc.replace(`PRE{{${index}}}PRE`, html);
    }, text)
  }

  private setParagraphs (text: string): string {
    return text.split('\n\n').reduce((acc, cur) =>
      `${acc}\n<p>${cur}</p>`, '');
  }

  private readFile (): string {
    return fs.readFileSync(this.path, 'utf-8');
  }
}
