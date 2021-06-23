export class PixSchemaModelMock {
	pixKeys = [
		{
			user: 1,
			key: "user@email.com",
			label: "email"
		}
	]

	find(search?) {
		return {
			where: function (user) {
				return {
					equals: function (value) {
						return {
							exec: function() {
								return new Promise((resolve, reject) => {
									const pixKeys = [
										{
											user: "1",
											key: "user@email.com",
											label: "email"
										}
									]

									const keys = pixKeys.filter(pix => pix.user === value);
	
									keys.length > 0 ? resolve(keys) : reject(`did not find keys to user ${value}`)
								})
							} 
						}
					}
				}
			},
			lean: function() {
				return {
					populate: () => ({
						exec: function() {
							return new Promise((resolve, reject) => {
								const pixKeys = [
									{
										user: "1",
										key: "user@email.com",
										label: "email"
									}
								]
								try {
									const keys = pixKeys.filter(pix => pix.key === search.key);
			
									resolve(keys)
								} catch (err) {
									reject(err)
								}
							})
						} 
					})
				}
			}
		}
	}

	save(pix) {
		return new Promise((resolve, reject) => pix ? resolve(pix) : reject(pix))
	}
}