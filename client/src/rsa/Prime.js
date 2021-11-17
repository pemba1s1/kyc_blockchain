const getPrimes = (min, max) => {
    const result = Array(max + 1)
      .fill(0)
      .map((_, i) => i);
    for (let i = 2; i <= Math.sqrt(max + 1); i++) {
      for (let j = i ** 2; j < max + 1; j += i) delete result[j];
    }
    return Object.values(result.slice(Math.max(min, 2)));
};
  
const getRandNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
  
export const getRandPrime = (min, max) => {
    const primes = getPrimes(min, max);
    const rand = getRandNum(0, primes.length - 1);
    return [primes[rand],primes[primes.length-rand]];
};