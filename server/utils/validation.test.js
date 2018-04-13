import expect from 'expect';
import { isRealString } from './validation';

describe('isRealString',() => {
    it('should reject non-string values', () => {
        expect(isRealString(122222222)).toBe(false);
    });
    
    it('should reject string with only values', () => {
        expect(isRealString('    ')).toBe(false);
    });

    it('should allow string with non-space values', () => {
        expect(isRealString('adadad')).toBe(true);
    });
});