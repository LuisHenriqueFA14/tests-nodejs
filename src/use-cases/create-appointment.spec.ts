import { describe, expect, it } from 'vitest'
import { Appointment } from '../entities/appointments'
import { CreateAppointment } from './create-appointment'
import { getFutureDate } from '../tests/utils/get-future-date'
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository'

describe('Create Appointment', () => {
    it('should be able to create an appointment', () => {
        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(appointmentsRepository);

        const startsAt = getFutureDate('2022-01-01');
        const endsAt = getFutureDate('2022-01-02');

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })

    it('should not be able to create an appointment with overlapping dates', async () => {
        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(appointmentsRepository);

        const startsAt = getFutureDate('2022-01-02');
        const endsAt = getFutureDate('2022-01-04');

        await createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-01-03'),
            endsAt: getFutureDate('2022-01-05')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-01-01'),
            endsAt: getFutureDate('2022-01-03')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-01-01'),
            endsAt: getFutureDate('2022-01-05')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-01-02'),
            endsAt: getFutureDate('2022-01-03')
        })).rejects.toBeInstanceOf(Error)
    })
})