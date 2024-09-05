import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { SNS } from 'aws-sdk';
import { AppointmentRequest } from '../interfaces/AppointmentRequest';
import { saveAppointment } from '../utils/database';
import { publishToSNS } from '../utils/snsPublisher';

const dynamoDb = new DynamoDB.DocumentClient();
const sns = new SNS();

export const postAppointment: APIGatewayProxyHandler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Bad Request',
                }),
            };
        }

        const request: AppointmentRequest = JSON.parse(event.body);
        const appointmentId = await saveAppointment(dynamoDb, request);

        await publishToSNS(sns, request);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Appointment scheduled',
                appointmentId: appointmentId
            }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to schedule appointment',
                error: error.message,
            }),
        };
    }
};
