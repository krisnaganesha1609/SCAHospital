export type uuid = string;
export type JsonObject = Map<any, any>;
export type roles = 'Admin' | 'Doctor' | 'Receptionist' | 'Pharmacist';
export type prescriptionStatus = 'Pending' | 'Approved' | 'Dispensed' | 'Cancelled';
export type reservationStatus = 'Booked' | 'Checked In' | 'Cancelled' | 'No Show' | 'Done';
export type pharmacyApprovalStatus = 'Pending' | 'Dispensed' | 'Partial' | 'Rejected';