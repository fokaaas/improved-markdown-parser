import {Command} from 'commander';
import {MarkdownParser} from './markdown-parser';

const program = new Command();

program
  .name('MD to HTML parser')
  .description('Converts a markdown file to HTML')
  .version('0.0.1', '-v, --version', 'output the current version')
  .argument('<path>', 'path to markdown file')
  .option('-o, --out <path>', 'path to html file')
  .parse();

const options = program.opts();
const parser = new MarkdownParser(program.args[0], options.out);
parser.parse();
