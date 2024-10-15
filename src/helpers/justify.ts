const LINE_LENGTH = 80;

/**
 * Replace single newlines with a space and multiple spaces with a single space.
 * @param text - The input text.
 * @returns The normalized text.
 */
const replaceSingularNewline = (text: string): string => {
  return text
    .replace(/[\n\r]+/g, ' ')      // Replace all newlines with space
    .replace(/\s{2,}/g, ' ')       // Replace multiple spaces with single space
    .trim();
};

/**
 * Justify a single line by inserting extra spaces between words.
 * @param words - Array of words in the line.
 * @param extraSpaces - The total number of extra spaces to insert.
 * @returns The justified line.
 */
const justifyLine = (words: string[], extraSpaces: number): string => {
  if (words.length === 1) {
    // If there's only one word, pad the end with spaces.
    return words[0].padEnd(LINE_LENGTH, ' ');
  }

  const spacesBetweenWords = Math.floor(extraSpaces / (words.length - 1));
  let remainingExtraSpaces = extraSpaces % (words.length - 1);

  return words
    .map((word, index) => {
      if (index === words.length - 1) {
        return word; // Last word, no extra spaces.
      }
      // Each space between words has 1 (minimum) + spacesBetweenWords + (if extra, 1)
      const spacesToInsert = 1 + spacesBetweenWords + (remainingExtraSpaces > 0 ? 1 : 0);
      remainingExtraSpaces = remainingExtraSpaces > 0 ? remainingExtraSpaces - 1 : 0;
      return word + ' '.repeat(spacesToInsert);
    })
    .join('');
};

/**
 * Justify a single paragraph.
 * @param paragraph - The input paragraph text.
 * @returns The justified paragraph.
 */
const processParagraph = (paragraph: string): string => {
  const words = paragraph.split(' ').filter(word => word.length > 0);
  const justifiedParagraph: string[] = [];
  let currentLine: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    // Check if adding the next word exceeds the line length
    // currentLine.length is the number of words; spaces are (currentLine.length - 1)
    if (currentLength + word.length + currentLine.length > LINE_LENGTH) {
      if (currentLine.length > 0) {
        // Calculate the total spaces to insert
        const totalSpaces = LINE_LENGTH - currentLength;
        const extraSpaces = totalSpaces - (currentLine.length - 1);
        justifiedParagraph.push(justifyLine(currentLine, extraSpaces));
        currentLine = [];
        currentLength = 0;
      }
    }
    currentLine.push(word);
    currentLength += word.length;
  }

  // Handle the last line (left-justified)
  if (currentLine.length > 0) {
    justifiedParagraph.push(currentLine.join(' '));
  }

  return justifiedParagraph.join('\n');
};

/**
 * Process and justify the entire text.
 * @param text - The input text containing one or more paragraphs.
 * @returns The fully justified text.
 */
export const processJustification = (text: string): string => {
  return text
    .split('\n\n')                    // Split into paragraphs
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(replaceSingularNewline) // Normalize text
    .map(processParagraph)
    .join('\n');
};
