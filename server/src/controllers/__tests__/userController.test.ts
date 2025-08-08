import { Request, Response } from 'express';
import { getUsers, addUser } from '../../controllers/userController.ts';
import User from '../../models/users.ts';
import { HTTP_STATUS } from '../../constants/statusCodes.ts';

jest.mock('../../models/users.ts');

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return list of users on success', async () => {
      const mockUsers = [{ name: 'Alice' }, { name: 'Bob' }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      await getUsers({} as Request, mockResponse as Response);

      expect(User.find).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors in fetching users', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error('DB error'));

      await getUsers({} as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Failed to fetch users',
        details: 'DB error',
      }));
    });
  });

  describe('addUser', () => {
    it('should create a user when input is valid', async () => {
      const reqBody = { name: 'Charlie', email: 'charlie@example.com' };
      mockRequest = { body: reqBody };
      const mockUser = { _id: 'abc123', ...reqBody };

      (User.create as jest.Mock).mockResolvedValue(mockUser);

      await addUser(mockRequest as Request, mockResponse as Response);

      expect(User.create).toHaveBeenCalledWith(reqBody);
      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if validation fails', async () => {
      mockRequest = { body: { name: '', email: 'invalid' } };

      await addUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Object),
      }));
    });

    it('should return 400 if user creation fails', async () => {
      const reqBody = { name: 'Test', email: 'test@example.com' };
      mockRequest = { body: reqBody };

      (User.create as jest.Mock).mockRejectedValue(new Error('Insert error'));

      await addUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        error: 'User creation failed',
        details: 'Insert error',
      }));
    });
  });
});
