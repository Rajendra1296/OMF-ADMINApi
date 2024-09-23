import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { UpdateStatusDto } from './DTO/Updatestatus.dto';

jest.mock('@aws-sdk/client-sqs');
jest.mock('@aws-sdk/client-dynamodb');

describe('AdminService', () => {
  let adminService;
  let sqsClient: SQSClient;
  let dynamoDBClient: DynamoDBClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    sqsClient = new SQSClient({ region: 'us-east-1' });
    dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserStatus', () => {
    it('should send a message to the SQS queue', async () => {
      const updatestatusDto: UpdateStatusDto = { id: '123', status: 'active' };

      const sendMessageMock = jest.spyOn(sqsClient, 'send');

      const result = await adminService.updateUserStatus(updatestatusDto);

      expect(sendMessageMock).toHaveBeenCalledWith(
        expect.any(SendMessageCommand),
      );
      expect(result).toBe('User updated successfully');
    });

    it('should log the message body', async () => {
      const updatestatusDto: UpdateStatusDto = { id: '123', status: 'active' };
      const logSpy = jest.spyOn(adminService['logger'], 'log');

      await adminService.updateUserStatus(updatestatusDto);

      expect(logSpy).toHaveBeenCalledWith({
        operation: 'updateStatus',
        user: { id: '123', status: 'active' },
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item from the DynamoDB table', async () => {
      const tableName = 'TestTable';
      const key = { id: '123' };

      const deleteItemMock = jest.spyOn(dynamoDBClient, 'send');

      const result = await adminService.deleteItem(tableName, key);

      expect(deleteItemMock).toHaveBeenCalledWith(
        expect.any(DeleteItemCommand),
      );
      expect(result).toBe('id  deleted successfully');
    });

    it('should log deletion success', async () => {
      const tableName = 'TestTable';
      const key = { id: '123' };
      const logSpy = jest.spyOn(adminService['logger'], 'log');

      await adminService.deleteItem(tableName, key);

      expect(logSpy).toHaveBeenCalledWith(`id  deleted successfully`);
    });
  });
});
