import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '../../src/labs/frontmatter';

describe('parseFrontmatter', () => {
    it('parses a normal markdown file with frontmatter and body', () => {
        const input = [
            '---',
            'title: Incidence matrix',
            'summary: Basic introduction to graphs',
            '---',
            'Content of the assignment.',
        ].join('\n');

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                title: 'Incidence matrix',
                summary: 'Basic introduction to graphs',
            },
            body: 'Content of the assignment.',
        });
    });

    it('returns empty meta and full raw text when frontmatter is missing', () => {
        const input = 'Basic text without frontmatter.';

        expect(parseFrontmatter(input)).toEqual({
            meta: {},
            body: 'Basic text without frontmatter.',
        });
    });

    it('handles Windows CRLF (\\r\\n) line endings', () => {
        const input = [
            '---',
            'title: Lab 1',
            'summary: Description',
            '---',
            'First line',
            'Second line',
        ].join('\r\n');

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                title: 'Lab 1',
                summary: 'Description',
            },
            body: 'First line\r\nSecond line',
        });
    });

    it('does not treat --- inside body as frontmatter when not at start', () => {
        const input = [
            'Basic introduction without frontmatter.',
            '',
            '---',
            'title: This should not be treated as frontmatter',
            '---',
            'Rest of the text.',
        ].join('\n');

        expect(parseFrontmatter(input)).toEqual({
            meta: {},
            body: input,
        });
    });

    it('parses frontmatter with no body after closing ---', () => {
        const input = '---\ntitle: Title\nsummary: Summary\n---';

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                title: 'Title',
                summary: 'Summary',
            },
            body: '',
        });
    });

    it('preserves colons inside values', () => {
        const input = [
            '---',
            'summary: C = O - I: clean increment',
            '---',
            'Task text.',
        ].join('\n');

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                summary: 'C = O - I: clean increment',
            },
            body: 'Task text.',
        });
    });

    it('ignores empty lines and lines without a valid key inside frontmatter', () => {
        const input = [
            '---',
            '',
            'title: Test',
            '   ',
            ': missing key',
            'line without colon',
            'summary: Valid summary',
            '---',
            'Body.',
        ].join('\n');

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                title: 'Test',
                summary: 'Valid summary',
            },
            body: 'Body.',
        });
    });

    it('strips leading UTF-8 BOM and unwraps outer quotes', () => {
        const input = '\uFEFF---\ntitle: "Incidence matrix"\nsummary: \'Introduction\'\n---\nContent';

        expect(parseFrontmatter(input)).toEqual({
            meta: {
                title: 'Incidence matrix',
                summary: 'Introduction',
            },
            body: 'Content',
        });
    });
});
