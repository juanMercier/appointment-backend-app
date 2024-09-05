import { DynamoDB, RDS } from 'aws-sdk';
import { AppointmentRequest } from '../interfaces/AppointmentRequest';

export const saveAppointment = async (dynamoDb: DynamoDB.DocumentClient, request: AppointmentRequest) => {
    const appointmentId = `${request.insuredId}_${request.scheduleId}_${Date.now()}`;
    const params = {
        TableName: 'Appointments',
        Item: {
            appointmentId: appointmentId,
            insuredId: request.insuredId,
            scheduleId: request.scheduleId,
            countryISO: request.countryISO,
            status: 'pending',
            createdAt: new Date().toISOString(),
        },
    };

    await dynamoDb.put(params).promise();
    return appointmentId;
};

export const updateAppointmentStatus = async (dynamoDb: DynamoDB.DocumentClient, appointmentId: string, status: string) => {
    const params = {
        TableName: 'Appointments',
        Key: { appointmentId: appointmentId },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status },
    };

    await dynamoDb.update(params).promise();
};

export const saveToRDS = async (rds: RDS, dataAppointment: any, countryISO: string) => {
    console.log(`Appointment ${countryISO}:`, dataAppointment);
};
