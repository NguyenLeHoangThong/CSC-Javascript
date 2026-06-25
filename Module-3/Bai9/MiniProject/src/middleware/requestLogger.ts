import morgan from 'morgan';

// HTTP request logging.
// - development: 'dev' format (short, coloured) — easy to read while coding
// - production:  'combined' format (Apache-style) — works with log aggregators
export const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);
