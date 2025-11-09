import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const config = new DocumentBuilder()
  //   .setTitle('INDIA TALIA')
  //   .setDescription('Ecommerce y sistema de gestion')
  //   .setVersion('1.0')
  //   .addTag('India Talia')
  //   //.addBearerAuth()
  //   .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, documentFactory);

  //swagger bien documentada
  const config = new DocumentBuilder()
  .setTitle('India Talia API')
  .setDescription('API desarrollada con NestJS — autenticación, roles y módulos dinámicos.')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Introduce el token JWT para acceder a las rutas protegidas.',
    },
    'JWT-auth', // 🔑 Este nombre se usará en los decoradores (opcional, pero claro)
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();