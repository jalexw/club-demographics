// Gender Types
export enum Genders {
  Male="Male",
  Female="Female",
  NonBinary="NonBinary"
}
export const genders: (keyof typeof Genders)[] = Object.keys(Genders).filter((item) => {
  return isNaN(Number(item));
}) as (keyof typeof Genders)[];

export type Gender = (keyof typeof Genders) & string;

// Member Personal Details
export interface PersonalDetails {
  name?: string;
  dob: Date;
  gender: Gender;
}

// Member Details necessary to build population pyramid
export interface AnonymizedMember extends Omit<PersonalDetails, "name"> {}

// Encode a member as a string to pass to the API route
export function encodeRow(row: PersonalDetails): `${string}-${string}` {
  // Name is not relevant for creating population pyramid, ignore
  // Date string format: YYYY-MM-DD
  const dateString: string = row.dob.toISOString().slice(0, 10);
  // Male => M, Female => F, NonBinary => N
  const genderShortString: string = row.gender[0];
  return `${dateString}-${genderShortString}`
}

export function encodeRows(members: readonly PersonalDetails[]): string {
  if (!members || members.length === 0) return "";
  // Encode each member as a string
  const encodedMembers: (`${string}-${string}`)[] = members.map(encodeRow);
  const queryEncoded: string = encodedMembers.map(
    (encodedMember) => `row[]=${encodedMember}`
  ).join("&");
  return queryEncoded
}

export function decodeRow(row: string): AnonymizedMember {
  if (row.length !== 12) {
    throw new Error("Invalid row format: " + row);
  }

  let gender: Gender;
  switch (row.slice(11, 12)) {
    case "M":
      gender = "Male" as Gender;
      break;
    case "F":
      gender = "Female" as Gender;
      break;
    case "N":
      gender = "NonBinary" as Gender;
      break;
    default:
      throw new Error("Row improperly encoded with anonymized members' genders")
  }

  return {
    dob: new Date(row.slice(0, 10)),
    gender
  }
}