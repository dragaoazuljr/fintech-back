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

	find = ({ email }) => { };

	findOne = ({ email }) => { };

	findById(_id) {	}

	save(user) { }
}

export const mockMongoose = {
    find() {
      return {}
    }
}