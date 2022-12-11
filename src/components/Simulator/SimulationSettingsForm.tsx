import { Dispatch, FC, FormEventHandler, SetStateAction, useCallback } from "react";
import type { SimulationSettings } from "./SimulationSettings";
import { SampleStrategy, samplingStrategies } from "./sampling";
import simulate, { SimulationResults } from "./simulate";
import { PersonalDetails } from "@/member";

export interface SimulationSettingsProps {
  members: PersonalDetails[];
  waitlist: PersonalDetails[];
  setSimulationResults: Dispatch<SetStateAction<SimulationResults>>;
}

const SimulationSettingsForm: FC<SimulationSettingsProps> = ({ members, waitlist, setSimulationResults }) => {
  const startSimulation: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const simulationLength: number = Number(e.currentTarget["simulationLength"].value);
      if (!Number.isInteger(simulationLength) || simulationLength < 1 || simulationLength > 50) {
        console.log("Invalid simulation length")
        return;
      }

      const samplingStrategyId: string = e.currentTarget["samplingStrategy"].value;
      const samplingStrategy: SampleStrategy | undefined = samplingStrategies.find(
        s => s.id === samplingStrategyId
      );
      if (!samplingStrategy) {
        console.log("Invalid sampling strategy")
        return;
      }

      const sampleRate: number = Number(e.currentTarget["sampleRate"].value);
      if (!Number.isInteger(sampleRate)) {
        console.log("Invalid sample rate; must be integer >= 0")
        return;
      }

      const exitRate: number = Number(e.currentTarget["exitRate"].value);
      if (isNaN(exitRate) || exitRate < 0 || exitRate > 1) {
        console.log("Invalid member exit rate; must be number between 0-1 representing percentage leaving each year")
        return;
      }

      const simulationResults = simulate(
        members,
        waitlist,
        {
          sampleRate,
          exitRate,
          simulationLength,
          samplingStrategy
        } as SimulationSettings
      )
      setSimulationResults(simulationResults);
    },
    [members, waitlist, setSimulationResults]
  )

  return (
    <form onSubmit={startSimulation} className="w-full flex flex-col">
      <div className="flex flex-row justify-center items-center">
        <label htmlFor="simulationLength">Simulation Length (years)</label>
        <input
          type="number"
          name="simulationLength"
          id="simulationLength"
          className="border-2 border-gray-300 rounded-md p-2 m-2 w-48 h-12"
          defaultValue={10}
          min={1}
          max={50}
          step={1}
        />
      </div>
      <div className="flex flex-row justify-center items-center">
        <label htmlFor="samplingStrategy">Waitlist Sampling Strategy</label>
        <select
          name="samplingStrategy"
          id="samplingStrategy"
          className="border-2 border-gray-300 rounded-md p-2 m-2 w-48 h-12"
        >
          {
            samplingStrategies.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))
          }
        </select>
      </div>
      <div className="flex flex-row justify-center items-center">
        <label htmlFor="sampleRate">Waitlist Sample Quota</label>
        <input
          type="number"
          name="sampleRate"
          id="sampleRate"
          className="border-2 border-gray-300 rounded-md p-2 m-2 w-48 h-12"
          defaultValue={25}
          min={0}
          step={1}
        />
      </div>
      <div className="flex flex-row justify-center items-center">
        <label htmlFor="exitRate">Member Attrition/Exit Rate</label>
        <input
          type="number"
          name="exitRate"
          id="exitRate"
          className="border-2 border-gray-300 rounded-md p-2 m-2 w-48 h-12"
          defaultValue={0.015}
          min={0}
          max={1}
          step={0.0005}
        />
      </div>
      <button
        className="border bg-green-600 text-white p-2 rounded-lg font-bold"
        type="submit"
      >
        Simulate
      </button>
    </form>
  )
}

export default SimulationSettingsForm;