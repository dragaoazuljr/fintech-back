import { CanActivate } from "@nestjs/common";

export const mock_jwtGuard: CanActivate = {
	canActivate: jest.fn(() => true)
}