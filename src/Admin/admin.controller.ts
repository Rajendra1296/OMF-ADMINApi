import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UpdateStatusDto } from './DTO/Updatestatus.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('update')
  @ApiOperation({ summary: 'Update Status' })
  @ApiBody({
    description: 'Message to post on sqs',
    type: UpdateStatusDto,
  })
  async updateUserStatus(@Body() updateUserDto: UpdateStatusDto) {
    return this.adminService.updateUserStatus(updateUserDto);
  }
  @Delete('delete/:tableName/:id')
  @ApiOperation({ summary: 'Delete an item from DynamoDB' })
  async deleteItem(
    @Param('tableName') tableName: string,
    @Param('id') id: string,
  ) {
    await this.adminService.deleteItem(tableName, { id });
  }
}
