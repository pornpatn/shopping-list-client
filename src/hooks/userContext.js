import React from 'react';

const userContext = React.createContext({ profile: null, token: null });

export { userContext };