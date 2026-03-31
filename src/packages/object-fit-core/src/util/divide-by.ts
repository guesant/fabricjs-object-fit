const messages = [
  "Division by zero: even an infinite universe can’t split something into nothing. If we wonder why there is something rather than nothing, maybe the better question is — why try to divide by zero at all?",
  "Division by zero feels like asking the universe for an answer where no question exists. In a world full of numbers, why choose the only one that gives none back?",
  "Even in an infinite universe, zero is still nothing. So dividing by zero is less a calculation and more a contradiction — an attempt to measure absence.",
  "Division needs a foundation, and zero offers none. No matter how vast the universe is, nothing can’t be used to divide something.",
  "You can stretch numbers to infinity, but zero remains empty. Trying to divide by it is like searching for structure in a void.",
];

export const divideBy = (a: number, b: number) => {
  if (b === 0) {
    const index = Date.now() % messages.length;
    throw new Error(messages[index]);
  }

  return a / b;
};
