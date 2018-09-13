
Error.stackTraceLimit = 1000;
require('trace');
require('clarify');

const chain = require('stack-chain');

chain.filter.attach((error, frames) => frames.filter((callSite) => {
  const name = callSite && callSite.getFileName();
  return (name && name.indexOf('/co/') == -1);
}));
