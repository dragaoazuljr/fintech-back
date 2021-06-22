import { rejects } from "assert";

export class UserMockClassService {
	userCreated = {
		_id: "1",
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
    
	findUserByLogin (login) {
		return new Promise(resolve => resolve(this.users.find(user => user.email === login)))
	}

    findUser (_id) {
		return new Promise((resolve, reject) => {
			const user = this.users.find(user => user._id === _id)

			if (user) {
				resolve(user);
			} else {
				reject("Invalid user id")
				throw new Error ("Invalid user id")
			}
		})
	}
}

export const UserMockValueService = {

	createUser: () => {
		const userCreated = {
			_id: 1,
			email: 'user@email.com',
			password: 'User@10'
		};
		const users = [
			{...userCreated}
		];

		return new Promise((resolve, reject) => resolve(userCreated))
	},
    
	findUserByLogin: (login) => {
		const userCreated = {
			_id: 1,
			email: 'user@email.com',
			password: 'User@10'
		};
		const users = [
			{...userCreated}
		];

		return new Promise(resolve => resolve(users.find(user => user.email === login)))
	},

    findUser: (_id) => {
		const userCreated = {
			_id: 1,
			email: 'user@email.com',
			password: 'User@10'
		};
		const users = [
			{...userCreated}
		];

		return new Promise(resolve => resolve(users.find(user => user._id === _id)))
	}
}