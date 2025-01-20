import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioController } from './controllers/usuario.controller';
import { UsuarioService } from './service/usuario.entity';
import { AuthModule } from '../auth/auth.module';

 
@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),forwardRef(() => AuthModule), ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
 