const messages = [
  "To divide by zero is to demand an answer from absolute silence. The universe owes us no meaning when we address the void.",
  "Mathematics is the language of existence, yet zero remains the unspeakable. You seek a proportion where substance itself refuses to dwell.",
  "Not all that exists can be partitioned. Attempting to divide by emptiness is not a miscalculation; it is a reminder that absence has no parts.",
  "In searching for structure within the vacuum, you find no number—only the reflection of your own desire for order amidst primordial chaos.",
  "There are abysses that reason cannot bridge. Zero is not a divisor; it is the event horizon where logic dissolves and mystery begins.",
];

export const divideBy = (a: number, b: number) => {
  if (b === 0) {
    const index = Date.now() % messages.length;
    throw new Error(messages[index]);
  }

  return a / b;
};
