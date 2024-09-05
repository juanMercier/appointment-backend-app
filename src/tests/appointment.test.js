"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_1 = require("../../src/handlers/appointment");
describe('postAppointment', () => {
    it('should return a success message when the appointment is scheduled', async () => {
        const event = {
            body: JSON.stringify({
                insuredId: '00001',
                scheduleId: 100,
                countryISO: 'PE',
            }),
        };
        const result = await (0, appointment_1.postAppointment)(event);
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).message).toBe('Appointment is being processed');
    });
    it('should return an error message when there is an error', async () => {
        const event = {
            body: null,
        };
        const result = await (0, appointment_1.postAppointment)(event);
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('Failed to process appointment');
    });
});
