# Markdown Parser

This console application allows you to parse markdown into html.

The result can be displayed in the console or saved to a file.

**Tech Stack**:
- Node.js
- TypeScript
- Commander

## How to set up it locally?

Firstly, clone this repo:

```bash
git clone https://github.com/fokaaas/markdown-parser.git
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
pnpm parse <path> -o <path>
```

Explore all commands:

```bash
pnpm parse --help
```

```bash
Usage: MD to HTML parser [options] <path>

Converts a markdown file to HTML

Arguments:
  path              path to markdown file

Options:
  -v, --version     output the current version
  -o, --out <path>  path to html file
  -h, --help        display help for command
```

## Example

Lets parse churka-example.md file and save result to churka-example.html:

### churka-example.md

```markdown
Їде `чурка` по дорозі. Зупиняється і **бачить**: _крисак на дорозі лежить_. Великий такий, правда дохлий.
Ну і вирішив він його забрати із собою. Взяв на руки, _відкрив багажник_. І положив туди крисака зі словами "Прігодіться!".

На наступний **день** їде чурка _тією самою_ дорогою. Зупиняється. Відкриває `багажник, дістає звідти крисака`, кладе його на те
ж саме місце. І `говорить`: "Нє прігоділся!"
```

Parse it:

```bash
pnpm parse churka-example.md -o churka-example.html
```

churka-example.html:

```html
<p>Їде <tt>чурка</tt> по дорозі. Зупиняється і <b>бачить</b>: <i>крисак на дорозі лежить</i>. Великий такий, правда дохлий.
Ну і вирішив він його забрати із собою. Взяв на руки, <i>відкрив багажник</i>. І положив туди крисака зі словами "Прігодіться!".</p>
<p>На наступний <b>день</b> їде чурка <i>тією самою</i> дорогою. Зупиняється. Відкриває <tt>багажник, дістає звідти крисака</tt>, кладе його на те
ж саме місце. І <tt>горорить</tt>: "Нє прігоділся!"
</p>
```

## Revert Commit

[Link](https://github.com/fokaaas/markdown-parser/commit/583d2de561e477b049711f8b901ca9fbfe9747cf)
