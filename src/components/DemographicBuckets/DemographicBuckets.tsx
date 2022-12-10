import type { AnonymizedMember, Gender } from '../../member';

// A list of numbers, where each number represents the number of members in that age bucket
export type AgeBuckets = number[];

// Age buckets split by gender
export type GenderBuckets = {
  [key in Gender]: AgeBuckets;
}

// This class will take in a list of anonymized member details (gender/dob) and group them into buckets
export default class DemographicBuckets {
  // All members to be bucketed
  private rows: AnonymizedMember[];
  // The date to use as the reference point for bucketing (calculate age with)
  private date: Date;
  // The number of buckets to use
  private n_buckets: number;
  // The width of each bucket in years
  private bucket_width: number;

  constructor(
    rows: AnonymizedMember[],
    date: Date = new Date(),
    n_buckets: number = 17,
    // Default to 5 years per bucket
    bucket_width: number = 5,
  ) {
    this.rows = rows;
    this.date = date;
    this.n_buckets = n_buckets;
    this.bucket_width = bucket_width;
  }

  private getMemberAge(member: AnonymizedMember): number {
    // calculate the age in full years
    let age: number = this.date.getFullYear() - member.dob.getFullYear();

    // if the person's date of birth has not yet occurred in the current year,
    // subtract one year from the age
    if (
      this.date.getMonth() < member.dob.getMonth() ||
      (
        this.date.getMonth() === member.dob.getMonth() && this.date.getDate() < member.dob.getDate()
      )
    ) {
      age -= 1;
    }

    return age;
  }

  private splitRowsByAge(genderedRows: AnonymizedMember[]): AgeBuckets {
    const ages: number[] = genderedRows.map(
      (row: AnonymizedMember) => this.getMemberAge(row)
    );
    // Create an array of 0s to represent the number of members in each age bucket
    // One extra bucket is added to hold overflow members
    const ageBuckets: AgeBuckets = new Array(this.n_buckets + 1).fill(0);
    
    // Increment the bucket count for each member in that age range
    ages.forEach(age => {
      // Find the bucket to put the member in
      const bucketIndex = Math.min(Math.floor(age / this.bucket_width), this.n_buckets);
      ageBuckets[bucketIndex] += 1;
    })
    return ageBuckets;
  }

  public get buckets(): GenderBuckets {
    // Split rows by gender
    const maleRows = this.rows.filter(row => row.gender === "Male" as Gender)
    const femaleRows = this.rows.filter(row => row.gender === "Female" as Gender)
    const nonBinaryRows = this.rows.filter(row => row.gender === "NonBinary" as Gender)

    // Split rows by age
    const buckets: GenderBuckets = {
      Male: this.splitRowsByAge(maleRows),
      Female: this.splitRowsByAge(femaleRows),
      NonBinary: this.splitRowsByAge(nonBinaryRows),
    }
    return buckets;
  }

  public get bucketDetails(): readonly [number, number] {
    return [this.n_buckets, this.bucket_width];
  }
}
