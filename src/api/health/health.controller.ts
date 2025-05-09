import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@ApiTags('Status')
@Controller('status')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Get API status of the server' })
  @ApiResponse({ type: SuccessResponseDto, status: HttpStatus.OK })
  statusCheck() {
    return;
  }
}
