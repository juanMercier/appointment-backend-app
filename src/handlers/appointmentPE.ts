import { SQSEvent, SQSHandler } from 'aws-lambda';
import { RDS } from 'aws-sdk';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { saveToRDS } from '../utils/database';

const rds = new RDS();
const eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION });
const peruCountryISO = 'PE';

export const processAppointmentPE: SQSHandler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const appointmentData = JSON.parse(record.body);

        await saveToRDS(rds, appointmentData, peruCountryISO);

        const params = {
            Entries: [
                {
                    Source: process.env.EVENT_SOURCE,
                    DetailType: process.env.EVENT_DETAIL_TYPE,
                    Detail: JSON.stringify({
                        appointmentId: appointmentData.appointmentId,
                        countryISO: peruCountryISO,
                        status: 'completed',
                    }),
                    EventBusName: process.env.EVENT_BUS_NAME,
                },
            ],
        };

        const command = new PutEventsCommand(params);
        await eventBridge.send(command);
    }
};