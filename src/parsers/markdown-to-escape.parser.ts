import { MarkdownParser } from './markdown.parser';
import { MarkdownValidator } from '../validators/markdown-validator';

const markdownValidator = new MarkdownValidator();

export class MarkdownToEscapeParser extends MarkdownParser {
  constructor(path: string, out?: string) {
    super(path, out);
  }

  parse() {
    const file = this.readMarkdown();
    const formattedText = this.removePreformattedText(file);

    markdownValidator.checkNesting(formattedText, this.cases);
    const escape = this.cases.reduce((acc, cur) => {
      return acc.replace(cur.pattern, cur.escape);
    }, formattedText);

    markdownValidator.checkUnpairedMarkup(escape);
    const result = this.setInverseMode(escape);
    this.out ? this.writeResult(result) : console.log(result);
  }

  private setInverseMode(text: string): string {
    return this.preformattedText.reduce((acc, cur, index) => {
      const escape = `\x1b[7m${cur.replace(/```/g, '')}\x1b[27m`;
      return acc.replace(`PRE{{${index}}}PRE`, escape);
    }, text);
  }
}
