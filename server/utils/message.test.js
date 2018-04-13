import expect from 'expect';
import { generateMessage } from './message';

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let obj = {
            from: 'charles',
            text: 'Hey mon beau!'
        };
        let message = generateMessage(obj.from,obj.text);
        expect(message).toMatchObject({ ...obj });
        expect(typeof(message.createdAt)).toBe('number');
    })
});