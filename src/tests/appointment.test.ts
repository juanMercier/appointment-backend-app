import { postAppointment } from '../../src/handlers/appointment';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { saveAppointment } from '../../src/utils/database';
import { publishToSNS } from '../../src/utils/snsPublisher';

// Mock the utility functions
jest.mock('../../src/utils/database');
jest.mock('../../src/utils/snsPublisher');

describe('postAppointment handler', () => {
    let event: APIGatewayProxyEvent;

    beforeEach(() => {
        event = {
            body: JSON.stringify({
                insuredId: '12345',
                scheduleId: 100,
                countryISO: 'PE',
            }),
        } as any;
    });

    it('should return 200', async () => {
        (saveAppointment as jest.Mock).mockResolvedValue('appointment123');
        (publishToSNS as jest.Mock).mockResolvedValue({});

        const result = await postAppointment(event, {} as any, () => {});

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({
            message: 'Appointment scheduled',
            appointmentId: 'appointment123',
        });
    });

    it('should return 400', async () => {
        event.body = null;

        const result = await postAppointment(event, {} as any, () => {});

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({
            message: 'Request body is missing',
        });
    });

    it('should return 500', async () => {
        (saveAppointment as jest.Mock).mockRejectedValue(new Error('Database error'));

        const result = await postAppointment(event, {} as any, () => {});

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({
            message: 'Failed to schedule appointment',
            error: 'Database error',
        });
    });
});
