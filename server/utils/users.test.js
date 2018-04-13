import expect from 'expect';
import Users from './users';

describe('Users',() => {

    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: '1',
                name: 'Mike',
                room: 'Node'
            },
            {
                id: '2',
                name: 'Charles',
                room: 'React'
            },
            {
                id: '3',
                name: 'Gyslain',
                room: 'Node'
            }
        ]
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Charles',
            room: 'TestRoom'
        };
        
        let resUser = users.addUser(user.id,user.name,user.room);
        expect(users.users).toMatchObject([user]);
    });

    it('should remove a user',() => {
        let user = users.removeUser('1');
        expect(user).toBeTruthy();
    });

    it('should not remove a user',() => {
        let user = users.removeUser('122222');
        expect(user).toBeFalsy();
    });

    it('should find a user',() => {
        expect(users.getUser('1')).toBeTruthy();
    });

    it('should not find a user',() => {
        expect(users.getUser(14)).toBeFalsy();
    });

    it('should return names for node course',() => {
        let usersList = users.getUserList('Node');
        expect(usersList).toMatchObject(['Mike','Gyslain']);
    });

    it('should return names for react course',() => {
        let usersList = users.getUserList('React');
        expect(usersList).toMatchObject(['Charles']);
    });
});