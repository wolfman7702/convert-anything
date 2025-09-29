export function countWords(text: string) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const lines = text.split(/\n/).length;
  
  return {
    words: words.length,
    characters: chars,
    charactersNoSpaces: charsNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTime: Math.ceil(words.length / 200), // ~200 words per minute
  };
}

export function convertCase(text: string, caseType: 'upper' | 'lower' | 'title'): string {
  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    default:
      return text;
  }
}

export function removeDuplicateLines(text: string): string {
  const lines = text.split('\n');
  const unique = Array.from(new Set(lines));
  return unique.join('\n');
}

export function sortLines(text: string, order: 'asc' | 'desc' = 'asc'): string {
  const lines = text.split('\n');
  lines.sort();
  if (order === 'desc') lines.reverse();
  return lines.join('\n');
}

export function reverseText(text: string): string {
  return text.split('').reverse().join('');
}

export function findReplace(text: string, find: string, replace: string, caseSensitive: boolean = true): string {
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
  return text.replace(regex, replace);
}

export function formatJSON(jsonString: string): { formatted: string; isValid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      formatted: JSON.stringify(parsed, null, 2),
      isValid: true,
    };
  } catch (error) {
    return {
      formatted: jsonString,
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

export function minifyJSON(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed);
}
