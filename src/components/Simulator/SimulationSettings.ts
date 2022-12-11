import type { SampleStrategy } from "./sampling";

export interface SimulationSettings {
  // Number of years ahead to simulate
  simulationLength: number;
  // How to sample members from the waitlist
  samplingStrategy: SampleStrategy
  // Number of members to add each year
  sampleRate: number;
  // Number of members that tend to leave each year (randomly removed)
  exitRate: number;
}
