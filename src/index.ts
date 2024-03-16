import { Command, Option } from 'commander';
import { MarkdownToEscapeParser } from './parsers/markdown-to-escape.parser';
import { MarkdownToHtmlParser } from './parsers/markdown-to-html.parser';

const program = new Command();

const parsers: any = {
  html: MarkdownToHtmlParser,
  escape: MarkdownToEscapeParser,
};

program
  .name('Markdown Parser')
  .description('Converts a markdown file to HTML')
  .version('0.0.1', '-v, --version', 'output the current version')
  .argument('<path>', 'path to markdown file')
  .option('-o, --out <path>', 'path to html file')
  .addOption(
    new Option('-f, --format <type>', 'output format').choices([
      'html',
      'escape',
    ])
  )
  .parse();

const options = program.opts();

const parse = (path: string, out?: string) => {
  if (!options.format) {
    const parser = options.out
      ? new MarkdownToHtmlParser(path, out)
      : new MarkdownToEscapeParser(path);
    parser.parse();
  } else {
    const Parser = parsers[options.format];
    new Parser(path, out).parse();
  }
};

parse(program.args[0], options.out);
