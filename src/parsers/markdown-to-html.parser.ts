import { MarkdownValidator } from '../validators/markdown-validator';
import { MarkdownParser } from './markdown.parser';
import * as os from 'os';

const markdownValidator = new MarkdownValidator();

export class MarkdownToHtmlParser extends MarkdownParser {
  constructor(path: string, out?: string) {
    super(path, out);
  }

  private readonly separator = `${os.EOL}${os.EOL}`;

  parse() {
    const file = this.readMarkdown();
    const formattedText = this.removePreformattedText(file);

    markdownValidator.checkNesting(formattedText, this.cases);
    const html = this.cases.reduce((acc, cur) => {
      return acc.replace(cur.pattern, cur.html);
    }, formattedText);

    const htmlWithParagraphs = this.setParagraphs(html);
    markdownValidator.checkUnpairedMarkup(htmlWithParagraphs);

    const result = this.setPreformattedText(htmlWithParagraphs);
    this.out ? this.writeResult(result) : console.log(result);
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
      .reduce((acc, cur) => `${acc}<p>${cur}</p>\n`, '')
      .trim();
  }
}
