import { SNS } from 'aws-sdk';
import { AppointmentRequest } from '../interfaces/AppointmentRequest';

export const publishToSNS = async (sns: SNS, request: AppointmentRequest) => {
    const topicArn = request.countryISO === 'PE' ? process.env.SNS_TOPIC_PE : process.env.SNS_TOPIC_CL;
    const params = {
        Message: JSON.stringify(request),
        TopicArn: topicArn,
    };

    await sns.publish(params).promise();
};
