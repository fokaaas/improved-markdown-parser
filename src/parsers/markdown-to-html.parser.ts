import { MarkdownValidator } from '../validators/markdown-validator';
import { CaseDto } from '../dto/case.dto';
import * as os from 'os';
import { MarkdownParser } from './markdown.parser';

const markdownValidator = new MarkdownValidator();

export class MarkdownToHtmlParser extends MarkdownParser {
  constructor(path: string, out?: string) {
    super(path, out);
  }

  private readonly cases: CaseDto[] = [
    {
      pattern: /(?<=[ ,.:;\n\t]|^)\*\*(?=\S)(.+?)(?<=\S)\*\*(?=[ ,.:;\n\t]|$)/g,
      replacement: '<b>$1</b>',
    },
    {
      pattern: /(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g,
      replacement: '<i>$1</i>',
    },
    {
      pattern: /(?<=[ ,.:;\n\t]|^)`(?=\S)(.+?)(?=\S)`(?=[ ,.:;\n\t]|$)/g,
      replacement: '<tt>$1</tt>',
    },
  ];

  private preformattedText: string[] = [];

  private separator = `${os.EOL}${os.EOL}`;

  parse() {
    const file = this.readMarkdown();
    const formattedText = this.removePreformattedText(file);

    markdownValidator.checkNesting(formattedText, this.cases);
    const html = this.cases.reduce((acc, cur) => {
      return acc.replace(cur.pattern, cur.replacement);
    }, formattedText);

    const htmlWithParagraphs = this.setParagraphs(html);
    markdownValidator.checkUnpairedMarkup(htmlWithParagraphs);

    const result = this.setPreformattedText(htmlWithParagraphs);
    this.out ? this.writeResult(result) : console.log(result);
  }

  private removePreformattedText(text: string): string {
    const preformattedText = text.match(/```([\s\S]*?)```/g);
    if (!preformattedText) return text;

    this.preformattedText.push(...preformattedText);
    return preformattedText.reduce(
      (acc, cur, index) => acc.replace(cur, `PRE{{${index}}}PRE`),
      text
    );
  }

  private setPreformattedText(text: string): string {
    return this.preformattedText.reduce((acc, cur, index) => {
      const html = `<pre>${cur.replace(/```/g, '')}</pre>`;
      return acc.replace(`PRE{{${index}}}PRE`, html);
    }, text);
  }

  private setParagraphs(text: string): string {
    return text
      .split(this.separator)
      .reduce((acc, cur) => `${acc}\n<p>${cur}</p>`, '');
  }
}
