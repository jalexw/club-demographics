import type { PersonalDetails } from "@/member";
import type { SimulationSettings } from "./SimulationSettings";

export type SimulatedYear = {
  year: number;
  members: readonly PersonalDetails[];
  waitlist: readonly PersonalDetails[];
}

export type SimulationResults = SimulatedYear[];

export default function simulate(
  initMembers: readonly PersonalDetails[],
  initWaitlist: readonly PersonalDetails[],
  settings: SimulationSettings
): SimulationResults {
  // # of years to simulate
  const years: number = settings.simulationLength;
  // Push simulated years into this array
  const results: SimulationResults = [];

  let members: PersonalDetails[] = [...initMembers];
  let waitlist: PersonalDetails[] = [...initWaitlist];

  // Simulate each year
  for (let year = 1; year <= years; year++) {
    // Sample new members from the waitlist
    const sampleResults = settings.samplingStrategy.sample(waitlist, settings.sampleRate);
    // Members to receive memberships from the waitlist
    const membersToAdd = sampleResults.sample;

    // Remove some members from the club at random based on attrition rate
    const membersWithSimulatedAttrition = members.filter(
      () => Math.random() >= settings.exitRate
    )

    const newYear: SimulatedYear = {
      year,
      members: [...membersWithSimulatedAttrition, ...membersToAdd],
      waitlist: [...sampleResults.waitlist]
    };
    results.push(newYear);
    members = [...newYear.members];
    waitlist = [...newYear.waitlist];
  }
  return results;
}