import { z } from 'zod';

export const submitClaimSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required').max(30, 'Vehicle number is too long'),
  vehicleModel: z.string().min(1, 'Vehicle model is required').max(100, 'Vehicle model is too long'),
  policyNumber: z.string().min(1, 'Policy number is required').max(50, 'Policy number is too long'),
  accidentDate: z.string().min(1, 'Accident date is required').refine((val) => {
    const parsed = Date.parse(val);
    return !isNaN(parsed) && new Date(parsed) <= new Date();
  }, {
    message: 'Invalid accident date. Must be a valid date in the past or present.',
  }),
});
