export const formatDate = (date: Date): string => {
	// TODO: update to HL7 format YYYYMMDDSS:HHMMSS
	return date.toISOString().split('T')[0]; // e.g. "2025-07-11"
};
