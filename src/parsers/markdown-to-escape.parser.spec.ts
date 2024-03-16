import { describe } from '@jest/globals';
import { MarkdownToEscapeParser } from './markdown-to-escape.parser';

describe('MarkdownToEscapeParser', () => {
  describe('parse', () => {
    it('should correctly replace markdown with escape characters and log result', () => {
      const markdownToEscapeParser = new MarkdownToEscapeParser('path');
      jest
        .spyOn(markdownToEscapeParser as any, 'readMarkdown')
        .mockReturnValue('Some _text_ with **markdown** `syntax`');
      jest.spyOn(console, 'log').mockReturnValue();

      markdownToEscapeParser.parse();
      expect(console.log).toHaveBeenCalledWith(
        'Some \x1b[3mtext\x1b[23m with \x1b[1mmarkdown\x1b[22m \x1b[7msyntax\x1b[27m'
      );
    });

    it('should write result to file if out is provided', () => {
      const markdownToEscapeParser = new MarkdownToEscapeParser('path', 'out');
      jest
        .spyOn(markdownToEscapeParser as any, 'readMarkdown')
        .mockReturnValue('Some _text_ with **markdown** `syntax`');
      jest
        .spyOn(markdownToEscapeParser as any, 'writeResult')
        .mockReturnValue({});

      markdownToEscapeParser.parse();
      expect(markdownToEscapeParser['writeResult']).toHaveBeenCalledWith(
        'Some \x1b[3mtext\x1b[23m with \x1b[1mmarkdown\x1b[22m \x1b[7msyntax\x1b[27m'
      );
    });
  });

  describe('setPreformattedText', () => {
    const markdownToEscapeParser = new MarkdownToEscapeParser('path');

    it('should correctly replace preformatted text with escape characters', () => {
      Object.defineProperty(markdownToEscapeParser, 'preformattedText', {
        value: ['```bla bla _text_```', '```text```'],
      });

      const result = markdownToEscapeParser['setPreformattedText'](
        'Some PRE{{0}}PRE with PRE{{1}}PRE'
      );

      expect(result).toBe(
        'Some \x1b[7mbla bla _text_\x1b[27m with \x1b[7mtext\x1b[27m'
      );
    });

    it('should replace not all preformatted text if there is no match', () => {
      Object.defineProperty(markdownToEscapeParser, 'preformattedText', {
        value: ['```bla bla _text_```', '```text```'],
      });

      const result = markdownToEscapeParser['setPreformattedText'](
        'Some PRE{{0}}PRE with PRE{{1}}PRE and PRE{{2}}PRE'
      );

      expect(result).toBe(
        'Some \x1b[7mbla bla _text_\x1b[27m with \x1b[7mtext\x1b[27m and PRE{{2}}PRE'
      );
    });

    it('should return the same string if there is no preformatted text', () => {
      const result = markdownToEscapeParser['setPreformattedText']('Some text');
      expect(result).toBe('Some text');
    });

    it('should return empty string if input is empty', () => {
      const result = markdownToEscapeParser['setPreformattedText']('');
      expect(result).toBe('');
    });
  });
});
