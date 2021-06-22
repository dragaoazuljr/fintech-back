import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { PixService } from './pix.service';
import { Pix, PixSchema } from './schema/pix.schema';
import { PixController } from './pix.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pix.name, schema: PixSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    PixService,
    UsersService
  ],
  controllers: [PixController],
  exports: [
    PixService
  ]
})
export class PixModule {}
