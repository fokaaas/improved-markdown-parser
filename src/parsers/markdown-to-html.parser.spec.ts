import { describe } from '@jest/globals';
import { MarkdownToHtmlParser } from './markdown-to-html.parser';
import * as os from 'os';

describe('MarkdownToHtmlParser', () => {
  describe('parse', () => {
    it('should correctly replace markdown with html tags and log result', () => {
      const markdownToHtmlParser = new MarkdownToHtmlParser('path');
      jest
        .spyOn(markdownToHtmlParser as any, 'readMarkdown')
        .mockReturnValue('Some _text_ with **markdown** `syntax`');
      jest.spyOn(console, 'log').mockReturnValue();

      markdownToHtmlParser.parse();
      expect(console.log).toHaveBeenCalledWith(
        '<p>Some <i>text</i> with <b>markdown</b> <tt>syntax</tt></p>'
      );
    });

    it('should write result to file if out is provided', () => {
      const markdownToHtmlParser = new MarkdownToHtmlParser('path', 'out');
      jest
        .spyOn(markdownToHtmlParser as any, 'readMarkdown')
        .mockReturnValue('Some _text_ with **markdown** `syntax`');
      jest
        .spyOn(markdownToHtmlParser as any, 'writeResult')
        .mockReturnValue({});

      markdownToHtmlParser.parse();
      expect(markdownToHtmlParser['writeResult']).toHaveBeenCalledWith(
        '<p>Some <i>text</i> with <b>markdown</b> <tt>syntax</tt></p>'
      );
    });
  });

  describe('setPreformattedText', () => {
    const markdownToHtmlParser = new MarkdownToHtmlParser('path');

    it('should correctly replace preformatted text with html tags', () => {
      Object.defineProperty(markdownToHtmlParser, 'preformattedText', {
        value: ['```bla bla _text_```', '```text```'],
      });

      const result = markdownToHtmlParser['setPreformattedText'](
        'Some PRE{{0}}PRE with PRE{{1}}PRE'
      );

      expect(result).toBe(
        'Some <pre>bla bla _text_</pre> with <pre>text</pre>'
      );
    });

    it('should replace not all preformatted text if there is no match', () => {
      Object.defineProperty(markdownToHtmlParser, 'preformattedText', {
        value: ['```bla bla _text_```', '```text```'],
      });

      const result = markdownToHtmlParser['setPreformattedText'](
        'Some PRE{{0}}PRE with PRE{{1}}PRE and PRE{{2}}PRE'
      );

      expect(result).toBe(
        'Some <pre>bla bla _text_</pre> with <pre>text</pre> and PRE{{2}}PRE'
      );
    });

    it('should return the same string if there is no preformatted text', () => {
      const result = markdownToHtmlParser['setPreformattedText']('Some text');
      expect(result).toBe('Some text');
    });

    it('should return empty string if input is empty', () => {
      const result = markdownToHtmlParser['setPreformattedText']('');
      expect(result).toBe('');
    });
  });

  describe('setParagraphs', () => {
    const markdownToHtmlParser = new MarkdownToHtmlParser('path');
    const separator = `${os.EOL}${os.EOL}`;

    it('should correctly replace separator with paragraph tags', () => {
      const text = `Some text${separator}with text`;
      const result = markdownToHtmlParser['setParagraphs'](text);

      expect(result).toBe('<p>Some text</p>\n<p>with text</p>');
    });

    it('should return paragraph string if there is no separator', () => {
      const text = 'Some text';
      const result = markdownToHtmlParser['setParagraphs'](text);

      expect(result).toBe('<p>Some text</p>');
    });
  });
});
