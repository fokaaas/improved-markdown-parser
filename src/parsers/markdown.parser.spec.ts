import { beforeEach, describe } from '@jest/globals';
import { MarkdownParser } from './markdown.parser';
import * as fs from 'fs';

describe('MarkdownParser', () => {
  describe('removePreformattedText', () => {
    let markdownParser: MarkdownParser;

    beforeEach(() => {
      markdownParser = new MarkdownParser('path');
    });

    it('should remove preformatted text', () => {
      const text = '```bla bla _text_``` some text ```text``` _sd_';
      const expected = 'PRE{{0}}PRE some text PRE{{1}}PRE _sd_';

      const result = markdownParser['removePreformattedText'](text);
      const preformattedText = markdownParser['preformattedText'];

      expect(result).toBe(expected);
      expect(preformattedText).toEqual(['```bla bla _text_```', '```text```']);
    });

    it('should return the same string if there is no preformatted text', () => {
      const text = 'bla bla _text_ some text _sd_';

      const result = markdownParser['removePreformattedText'](text);
      const preformattedText = markdownParser['preformattedText'];

      expect(result).toBe(text);
      expect(preformattedText).toEqual([]);
    });

    it('should return empty string if input is empty', () => {
      const result = markdownParser['removePreformattedText']('');
      expect(result).toBe('');
    });
  });

  describe('readMarkdown', () => {
    const markdownParser = new MarkdownParser('path');

    it('should read markdown file if exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const readFileSync = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('some text');

      markdownParser['readMarkdown']();
      expect(readFileSync).toHaveBeenCalled();
    });

    it('should throw an error if file not found', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(() => markdownParser['readMarkdown']()).toThrow('file not found');
    });
  });

  describe('writeResult', () => {
    const markdownParser = new MarkdownParser('path', 'out');

    it('should write result to file', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const writeFileSync = jest.spyOn(fs, 'writeFileSync').mockReturnValue();

      markdownParser['writeResult']('some text');
      expect(writeFileSync).toHaveBeenCalled();
    });

    it('should throw an error if out is not correct', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(() => markdownParser['writeResult']('some text')).toThrow(
        'out is not correct'
      );
    });
  });
});
