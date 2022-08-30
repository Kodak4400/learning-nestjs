import { Controller, Get, Logger, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.hbs')
  async index() {
    return this.appService.index();
  }

  @Get(':id')
  @Render('detail.hbs')
  async detail(@Param('id') id: string) {
    return this.appService.detail(id);
  }

  @Get(':id/confirm')
  @Render('confirm.hbs')
  async confirm(@Param('id') id: string) {
    this.logger.log('confirm');
    return '';
  }
}
