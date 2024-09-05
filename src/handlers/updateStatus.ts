import { SQSHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { updateAppointmentStatus } from '../utils/database';

const dynamoDb = new DynamoDB.DocumentClient();

export const updateStatus: SQSHandler = async (event) => {
    for (const record of event.Records) {
        const appointmentData = JSON.parse(record.body);
        await updateAppointmentStatus(dynamoDb, appointmentData.appointmentId, 'completed');
    }
};
