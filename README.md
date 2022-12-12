# Club Demographics

## Project Background

This project was created to allow a golf club to simulate how different waitlist sampling strategies/algorithms would affect the gender and age distribution of their club. For many years, women were not allowed in the club, or not allowed to play on certain days. Correspondingly, the proportion of women in the club is currently not representative of the proportion of women who golf in the country. This tool was created to help explore how the club might change how the waitlist works: letting a higher proportion of women in to correct the past's systemic bias, while also accepting the people who have been waiting the longest to get in.

## So how do I use it?
1. Upload spreadsheets containing your membership list and waitlist
2. Examine your club's current age and gender distribution as a population pyramid.
3. Choose simulation settings and explore different sampling strategies.
4. View what your club's population pyramid is expected to look like in future years
5. Infer if your selected sampling strategy will meet your club's diversity goals.

## Example Population Pyramid Output
![An example population pyramid generated by this project](https://github.com/jalexw/club-demographics/blob/main/public/example_population_pyramid.png?raw=true)

## Layperson Usage
[Visit the version already deployed on Vercel](https://club-demographics.vercel.app/) to generate population pyramids or use existing sampling strategies without writing any code.

## Developers - How to code your own waitlist sampling methods as TypeScript functions
1. Clone this repository: `git clone https://github.com/jalexw/club-demographics.git`
2. Make the cloned repository your active directory: `cd club-demographics`
3. Use [Yarn Package Manager](https://yarnpkg.com) to install this project's dependencies: `yarn`
4. Start a local Next.js development environment: `yarn dev`
5. Edit the sampling strategies available: `src/components/Simulator/sampling.ts`

## Contributing
Did you create a new sampling method or add a new feature? Pull requests welcome!