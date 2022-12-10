export const genders = ["Male", "Female", "Non-Binary"] as const;
export type Gender = (keyof typeof genders ) & string;

export interface PersonalDetails {
  name?: string;
  dob: Date;
  gender: Gender;
}