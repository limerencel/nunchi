const htmlPattern = /<\/?[a-z][\s\S]*>/i;

const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

export const extractTextContent = (value = '') => {
  if (!value) {
    return '';
  }

  if (typeof DOMParser === 'undefined') {
    return collapseWhitespace(value.replace(/<[^>]+>/g, ' '));
  }

  const documentFragment = new DOMParser().parseFromString(value, 'text/html');
  return collapseWhitespace(documentFragment.body.textContent || '');
};

export const isHtmlContent = (value = '') => htmlPattern.test(value);

export const formatShortDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
};

export const formatLongDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const estimateReadingTime = (value = '') => {
  const wordCount = extractTextContent(value).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 180));
};
