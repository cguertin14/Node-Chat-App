import expect from 'expect';
import { generateMessage, generateLocationMessage } from './message';

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let obj = {
            from: 'charles',
            text: 'Hey mon beau!'
        };
        let message = generateMessage(obj.from,obj.text);

        // Assertations
        expect(message).toMatchObject({ ...obj });
        expect(typeof(message.createdAt)).toBe('number');
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let obj = {
            from: 'Charles',
            latitude: 1,
            longitude: 1,
            url: 'https://www.google.com/maps?q=1,1'
        };
        
        let locationMessage = generateLocationMessage(obj.from, obj.latitude, obj.longitude);

        // Assertations
        expect(locationMessage.from).toBe(obj.from);
        expect(typeof(locationMessage.createdAt)).toBe('number');
        expect(locationMessage.url).toBe('https://www.google.com/maps?q=1,1');
        expect(locationMessage).toMatchObject({ from: obj.from, url: obj.url });
    });
});