export class UserMockService {
	userCreated = {
		_id: 1,
		email: 'user@email.com',
		password: 'User@10'
	};
	users = [
		{...this.userCreated}
	];

	constructor() {}

    createUser () {
		return new Promise((resolve, reject) => resolve(this.userCreated))
	}
    
	findUserBylogin (login) {
		return new Promise(resolve => resolve(this.users.find(user => user.email === login)))
	}

    findUser (_id) {
		return new Promise(resolve => resolve(this.users.find(user => user._id === _id)))
	}
}