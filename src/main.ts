import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,     // elimina propiedades que no estén en el DTO
    forbidNonWhitelisted: false, // no lanza error si llegan propiedades extra
    transform: true,     // convierte el body a instancia del DTO
  }),
);


  const config = new DocumentBuilder()
  .setTitle('India Talia API')
  .setDescription('API desarrollada con NestJS — autenticación, roles y módulos dinámicos.')
  .setVersion('1.0.0')
  .addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'Authorization',
    in: 'header',
  },
  'JWT-auth' // 👈 Este nombre debe coincidir con el de @ApiBearerAuth('JWT-auth')
)

  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();