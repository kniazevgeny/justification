const LINE_LENGTH = 80;

const getClosestSpaceIdx = (s: string): number => {
  for (let i = LINE_LENGTH; i > 0; i--) if (s[i] == " ") return i;
  return 0;
};

const processParagraph = (p: string) => {
  // put parts of the original string s to result until done
  let result = "";
  // debugger;
  for (
    let lineIdx = 0;
    lineIdx < Math.ceil(p.length / LINE_LENGTH);
    lineIdx++
  ) {
    const closestSpaceIdx = getClosestSpaceIdx(p);
    if (closestSpaceIdx != LINE_LENGTH && p.length >= 80) {
      let spacesToInsert = LINE_LENGTH - closestSpaceIdx;
      while (spacesToInsert > 0) {
        for (let i = 0; i < LINE_LENGTH; i++) {
          if (p[i] == " " && p[i + 1] != " ") {
            p = p.substring(0, i) + " " + p.substring(i, undefined);
            spacesToInsert -= 1;
          }
        }
      }
    }
    result += p.slice(0, LINE_LENGTH) + "\n";
    p = p.slice(LINE_LENGTH + 1, undefined);
  }
  result += p;
  return result;
};

export const processJustification = (s: string) => {
  return s
    .split("\n")
    .filter((el) => el.length)
    .map(processParagraph)
    .join("\n");
};
