import { useEffect, useState } from "react"

function GeneticAlgorithm() {
  const [populationSize, setPopulationSize] = useState(2)
  const [chromosomeLength, setChromosomeLength] = useState(4)
  const [generations, setGenerations] = useState(100)
  const [crossoverRate, setCrossoverRate] = useState(0.7)
  const [mutationRate, setMutationRate] = useState(0.3)

  const [result, setResult] = useState(null)

  function fitness(x) {
    return Math.abs((x - 5) / (2 + Math.sin(x)))
  }

  function generatePopulation(size, chromosomeLength) {
    const population = []
    for (let i = 0; i < size; i++) {
      let individual = ""
      for (let j = 0; j < chromosomeLength; j++) {
        individual += Math.random() < 0.5 ? "0" : "1"
      }
      population.push(individual)
    }
    return population
  }

  function crossover(parent1, parent2, crossoverRate) {
    if (Math.random() < crossoverRate) {
      const pos = Math.floor(Math.random() * parent1.length)
      const offspring1 = parent1.substring(0, pos) + parent2.substring(pos)
      const offspring2 = parent2.substring(0, pos) + parent1.substring(pos)
      return [offspring1, offspring2]
    }
    return [parent1, parent2]
  }

  function mutate(individual, mutationRate) {
    let mutated = ""
    for (let i = 0; i < individual.length; i++) {
      if (Math.random() < mutationRate) {
        mutated += individual[i] === "0" ? "1" : "0"
      } else {
        mutated += individual[i]
      }
    }
    return mutated
  }

  function selectParent(population) {
    const index = Math.floor(Math.random() * population.length)
    return population[index]
  }

  function evolve(population, crossoverRate, mutationRate) {
    const newPopulation = []
    for (let i = 0; i < population.length; i++) {
      const parent1 = selectParent(population)
      const parent2 = selectParent(population)
      let [child1, child2] = crossover(parent1, parent2, crossoverRate)

      child1 = mutate(child1, mutationRate)
      child2 = mutate(child2, mutationRate)

      newPopulation.push(child1)
      newPopulation.push(child2)
    }
    return newPopulation.slice(0, population.length)
  }

  function binaryToDecimal(binaryStr) {
    return parseInt(binaryStr, 2)
  }

  function geneticAlgorithm(config) {
    const {
      populationSize,
      chromosomeLength,
      generations,
      crossoverRate,
      mutationRate,
    } = config

    let population = generatePopulation(populationSize, chromosomeLength)

    for (let i = 0; i < generations; i++) {
      population = evolve(population, crossoverRate, mutationRate)
    }

    let bestIndividual = population[0]
    let bestFitness = fitness(binaryToDecimal(bestIndividual))

    for (let i = 1; i < populationSize; i++) {
      const currentFitness = fitness(binaryToDecimal(population[i]))

      if (currentFitness > bestFitness) {
        bestFitness = currentFitness
        bestIndividual = population[i]
      }
    }

    return {
      individual: bestIndividual,
      fitness: bestFitness,
      value: binaryToDecimal(bestIndividual),
    }
  }

  useEffect(() => {
    const config = {
      populationSize,
      chromosomeLength,
      generations,
      crossoverRate,
      mutationRate,
    }

    const result = geneticAlgorithm(config)

    setResult(result)
  }, [
    populationSize,
    chromosomeLength,
    generations,
    crossoverRate,
    mutationRate,
  ])

  if (!result) return <div>loading...</div>

  return (
    <div>
      <h1>Genetic Algorithm Configurations</h1>
      <div>
        <label>
          Population Size:
          <input
            type="number"
            value={populationSize}
            onChange={(e) => setPopulationSize(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Chromosome Length:
          <input
            type="number"
            value={chromosomeLength}
            onChange={(e) => setChromosomeLength(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Generations:
          <input
            type="number"
            step="10"
            value={generations}
            onChange={(e) => setGenerations(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Crossover Rate:
          <input
            type="number"
            step="0.1"
            value={crossoverRate}
            onChange={(e) => setCrossoverRate(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Mutation Rate:
          <input
            type="number"
            step="0.1"
            value={mutationRate}
            onChange={(e) => setMutationRate(Number(e.target.value))}
          />
        </label>
      </div>

      <h1>Genetic Algorithm Results</h1>
      <p>
        <strong>Best Individual:</strong> {result.individual}
      </p>
      <p>
        <strong>Value:</strong> {result.value}
      </p>
      <p>
        <strong>Fitness:</strong> {result.fitness}
      </p>
    </div>
  )
}

export default GeneticAlgorithm
