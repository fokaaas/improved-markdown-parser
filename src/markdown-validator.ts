import { CaseDto } from './dto/case.dto';

export class MarkdownValidator {
  private readonly markupParts: RegExp[] = [
    /(?<=[ ,.:;\n\t]|^)\*\*(?=\S)/g,
    /(?<=\S)\*\*(?=[ ,.:;\n\t]|$)/g,
    /(?<=[ ,.:;\n\t]|^)_(?=\S)/g,
    /(?<=\S)_(?=[ ,.:;\n\t]|$)/g,
    /(?<=[ ,.:;\n\t]|^)`(?=\S)/g,
    /(?=\S)`(?=[ ,.:;\n\t]|$)/g,
  ];

  private getMarkupParts(target: string, cases: CaseDto[]) {
    const parts = [];
    for (const { pattern } of cases) {
      const matches = target.match(pattern);
      if (matches) {
        parts.push(...matches.map(match => match.replace(pattern, '$1')));
      }
    }
    return parts;
  }

  checkNesting(target: string, cases: CaseDto[]) {
    const parts = this.getMarkupParts(target, cases);
    for (const part of parts) {
      cases.map(({ pattern }) => {
        const matches = part.match(pattern);
        if (matches) throw new Error('invalid markdown (nested markup)');
      });
    }
  }

  checkUnpairedMarkup(target: string) {
    for (const part of this.markupParts) {
      const matches = target.match(part);
      if (matches) throw new Error('invalid markdown (unpaired markup)');
    }
  }
}
