import { Module } from "@nestjs/common";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { UserMockClassService } from "./user-service.mock";

@Module({
	controllers: [ UsersController ],
	providers: [{
		provide: UsersService,
		useClass: UserMockClassService
	}],
	exports: [UsersService]
})
export class UsersModuleTest {}