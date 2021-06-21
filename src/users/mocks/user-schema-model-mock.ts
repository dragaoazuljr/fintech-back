export class UserSchemaModelMock {
	userCredentials = {
		name: 'User',
		email: 'user@email.com',
		password: 'User@10'
	};
	userCreated = {
		_id: "1",
		email: 'user@email.com',
		password: 'User@10'
	};
	users = [
		{ ...this.userCreated }
	];

	find({ email }) {
		return {
			exec: () => new Promise((resolve, rejection) => {
				const user = this.users.find(user => user.email === email);
				user ? resolve(user) : rejection(false);
			})
		}
	}

	findOne({ email }) {
		return {
			exec: () => new Promise((resolve, rejection) => {
				const user = this.users.find(user => user.email === email);
				user ? resolve(user) : rejection(undefined);
			})
		}
	}

	findById(_id) {
		return {
			exec: () => new Promise((resolve, rejection) => {
				const user = this.users.find(user => user._id === _id);
				user ? resolve(user) : rejection(false);
			})
		}
	}

	save(user) {
		return new Promise((resolve, rejection) => user ? resolve(user) : rejection(false));
	}
}

export const mockMongoose = {
    find() {
      return {}
    }
}