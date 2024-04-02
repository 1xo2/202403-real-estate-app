export function wordsCap(sentence: string): string {
  const words = sentence.split(" ");
  const capitalizedWords: string[] = [];

  for (const word of words) {
    if (word.length === 0) continue; // Skip empty words

    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    capitalizedWords.push(capitalizedWord);
  }

  return capitalizedWords.join(" ");
}
// return true is null || undefined
export function isNull_Undefined_emptyString<T>(value: T | null | undefined | ""): value is null | undefined | "" {
  return value === null || value === undefined || value==="";
}
