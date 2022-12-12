import { PersonalDetails } from "@/member";

export type SampleFunction = (waitlist: readonly PersonalDetails[], sampleSize: number) => {
  sample: readonly PersonalDetails[];
  waitlist: readonly PersonalDetails[];
};

export type SampleStrategy = {
  id: string;
  label: string;
  sample: SampleFunction;
}

export const samplingStrategies: SampleStrategy[] = [
  {
    id: "random",
    label: "Random",
    sample: (waitlist, sampleSize) => {
      // Take 'sampleSize' random members out of the waitlist without replacement
      const sample: PersonalDetails[] = [];
      const waitlistCopy = [...waitlist];
      for (let i = 0; i < sampleSize; i++) {
        if (waitlistCopy.length === 0) {
          break;
        }
        const index = Math.floor(Math.random() * waitlistCopy.length);
        sample.push(waitlistCopy[index]);
        waitlistCopy.splice(index, 1);
      }
      return {
        sample,
        waitlist: waitlistCopy
      }
    }
  }, {
    id: "in-order",
    label: "Descending Priority",
    sample: (waitlist, sampleSize) => {
      // Take 'sampleSize' members out of the waitlist in the order they joined
      const sample: PersonalDetails[] = [];
      const waitlistCopy = [...waitlist];
      for (let i = 0; i < sampleSize; i++) {
        if (waitlistCopy.length === 0) {
          break;
        }
        sample.push(waitlistCopy.shift()!);
      }
      return {
        sample,
        waitlist: waitlistCopy
      }
    }
  }
]