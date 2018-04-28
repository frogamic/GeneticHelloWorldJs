'use strict';
const MUTATE_RATE = 0.01;
const BREED_RATE = 0.75;
const POPULATION_SIZE = 1000;
const TARGET = 'Hello, World';

const generateCharacter = () => {
    return String.fromCharCode(Math.floor(Math.random() * 94) + 32);
}

const selectParent = (elders, totalScore) => {
    let selection = Math.random() * totalScore;
    let sum = 0;
    for (let e of elders) {
        sum += e.score;
        if (selection <= sum) {
            return e;
        }
    }
}

const generatePopulation = () => {
    let p = [];
    for (let i = 0; i < POPULATION_SIZE; ++i) {
        let x = '';
        for (let c of TARGET) {
            x += generateCharacter();
        }
        p.push(x);
    }
    return p;
}

const checkFitness = (x) => {
    let r = {value: x, score: 0};
    for (let i in x) {
        if (x[i] === TARGET[i]) {
            r.score++;
        }
    }
    return r;
}

const breed = (p1, p2) => {
    let c = '';
    for (let i in TARGET) {
        if (Math.random() < MUTATE_RATE) {
            c += generateCharacter();
        } else {
            if (Math.random() < 0.5) {
                c += p1[i];
            } else {
                c += p2[i];
            }
        }
    }
    return c;
}

let population = generatePopulation();
let generation = 0;

console.log(`Using a population size of ${POPULATION_SIZE},`);
console.log(`Regenerating ${BREED_RATE * 100}% of the population per generation,`);
console.log(`${MUTATE_RATE * 100}% chance of mutation for each chromosome.`);

do {
    generation += 1;

    let results = population.map(checkFitness).sort((x, y) => {return y.score - x.score;});
    if (results[0].value !== TARGET) {
        let elders = results.slice(0, POPULATION_SIZE * (1 - BREED_RATE));
        population = elders.map(x => x.value);
        let totalScore = elders.reduce((a, x) => {return a + x.score;}, 0);
        for (let i = 0; i < POPULATION_SIZE * BREED_RATE; ++i) {
            population.push(breed(selectParent(elders, totalScore).value, selectParent(elders, totalScore).value));
        }
    } else {
        population = results.map(x => x.value);
    }

    console.log(`Generation ${generation}: '${results[0].value}', score: ${results[0].score}`);
} while (population[0] !== TARGET)
