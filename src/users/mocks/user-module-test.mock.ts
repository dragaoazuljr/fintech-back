import { Module } from "@nestjs/common";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { UserMockService } from "./user-service.mock";

@Module({
	controllers: [ UsersController ],
	providers: [{
		provide: UsersService,
		useClass: UserMockService
	}],
	exports: [UsersService]
})
export class UsersModuleTest {}