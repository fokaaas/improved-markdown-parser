import { describe } from '@jest/globals';
import { MarkdownValidator } from './markdown.validator';
import { MarkdownParser } from '../parsers/markdown.parser';

describe('MarkdownValidator', () => {
  const markdownValidator = new MarkdownValidator();
  const markdownParser = new MarkdownParser('path');
  const cases = markdownParser['cases'];

  describe('getMarkupParts', () => {
    it('should return all matches for given cases', () => {
      const target = 'Some _text_ with **markdown** `syntax`';

      const result = markdownValidator['getMarkupParts'](target, cases);
      expect(result).toEqual(['markdown', 'text', 'syntax']);
    });

    it('should return empty array if there is no match', () => {
      const target = 'Some text';

      const result = markdownValidator['getMarkupParts'](target, cases);
      expect(result).toEqual([]);
    });

    it('should return empty array if input is empty', () => {
      const result = markdownValidator['getMarkupParts']('', cases);
      expect(result).toEqual([]);
    });
  });

  describe('checkNesting', () => {
    it('should not throw an error if there is no nesting', () => {
      const target = 'Some _text_ with **markdown** `syntax`';

      expect(() =>
        markdownValidator['checkNesting'](target, cases)
      ).not.toThrow();
    });

    it('should throw an error if there is a nesting', () => {
      const target = 'Some _text **with** markdown_ `syntax`';

      expect(() => markdownValidator['checkNesting'](target, cases)).toThrow(
        'invalid markdown (nested markup)'
      );
    });

    it('should not throw an error if input is empty', () => {
      expect(() => markdownValidator['checkNesting']('', cases)).not.toThrow();
    });

    it('should not throw an error if there is no markup', () => {
      const target = 'Some text without markdown syntax';

      expect(() =>
        markdownValidator['checkNesting'](target, cases)
      ).not.toThrow();
    });
  });

  describe('checkUnpairedMarkup', () => {
    it('should not throw an error if there is no unpaired markup', () => {
      const target = 'Some <i>text</i> with <b>markdown<b> <tt>syntax</tt>';

      expect(() =>
        markdownValidator['checkUnpairedMarkup'](target)
      ).not.toThrow();
    });

    it('should throw an error if there is unpaired markup', () => {
      const target = 'Some <i>text</i> with <b>markdown</b> _syntax';

      expect(() => markdownValidator['checkUnpairedMarkup'](target)).toThrow(
        'invalid markdown (unpaired markup)'
      );
    });

    it('should not throw an error if input is empty', () => {
      expect(() => markdownValidator['checkUnpairedMarkup']('')).not.toThrow();
    });

    it('should not throw an error if there is no markup and html', () => {
      const target = 'Some text without markdown syntax';

      expect(() =>
        markdownValidator['checkUnpairedMarkup'](target)
      ).not.toThrow();
    });
  });
});
