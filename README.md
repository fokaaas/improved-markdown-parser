# Markdown Parser

This console application allows you to parse markdown into html & escape codes.

The result can be displayed in the console or saved to a file.

**Tech Stack**:
- Node.js
- TypeScript
- Commander

## How to set up it locally?

Firstly, clone this repo:

```bash
git clone https://github.com/fokaaas/improved-markdown-parser.git
```

Then install **pnpm** globally:

```bash
npm install -g pnpm
```

Install dependencies in project directory:

```bash
pnpm install
```

Run application:

```bash
pnpm parse <path> --out <path> --format <type>
```

Explore all commands:

```bash
pnpm parse --help
```

```bash
Usage: Markdown Parser [options] <path>     

Converts a markdown file to HTML

Arguments:
  path                 path to markdown file

Options:
  -v, --version        output the current version
  -o, --out <path>     path to html file
  -f, --format <type>  output format (choices: "html", "escape")
  -h, --help           display help for command
```

## Examples

Lets parse churka-example.md file and save result to churka-example.html:

### churka-example.md

```markdown
Їде `чурка` по дорозі. Зупиняється і **ба_чить**: _крисак на дорозі лежить_. Великий такий, правда дохлий.
Ну і вирішив він його забрати із собою. Взяв на руки, _відкрив багажник_. І положив туди крисака зі словами "Прігодіться!".

На наступний **день** їде чурка _тією самою_ дорогою. <Зупиняється>
</Зупиняється>
\```
Відкриває `багажник, дістає звідти крисака`, кладе його на те
ж саме місце. І `говорить`: "Нє прігоділся!"
\```
```

Parse it:

```bash
pnpm parse churka-example.md --out churka-example.html
```

churka-example.html:

```html
<p>Їде <tt>чурка</tt> по дорозі. Зупиняється і <b>ба_чить</b>: <i>крисак на дорозі лежить</i>. Великий такий, правда дохлий. 
Ну і вирішив він його забрати із собою. Взяв на руки, <i>відкрив багажник</i>. І положив туди крисака зі словами "Прігодіться!".</p>
<p>На наступний <b>день</b> їде чурка <i>тією самою</i> дорогою. Зупиняється.
<pre>
Відкриває `багажник, дістає звідти крисака`, кладе його на те
ж саме місце. І `говорить`: "Нє прігоділся!"
</pre>
</p>
```

Then, lets parse churka-example.md file into escape codes:

```bash
pnpm parse churka-example.md --out churka-example.txt --format escape
```

churka-example.txt:

```
Їде [7mчурка[27m по дорозі. Зупиняється і [1mба_чить[22m: [3mкрисак на дорозі лежить[23m. Великий такий, правда дохлий.
Ну і вирішив він його забрати із собою. Взяв на руки, [3mвідкрив багажник[23m. І положив туди крисака зі словами "Прігодіться!".

На наступний [1mдень[22m їде чурка [3mтією самою[23m дорогою. Зупиняється.
[7m
Відкриває `багажник, дістає звідти крисака`, кладе його на те
ж саме місце. І `говорить`: "Нє прігоділся!"
[27m
```

## Revert Commit

[Link](https://github.com/fokaaas/improved-markdown-parser/commit/de63ed97fa3a5908788de5147e221631e32de893)
