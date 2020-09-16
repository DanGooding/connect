
export const numGroups = parseInt(process.env.REACT_APP_NUM_GROUPS) || 4;
export const groupSize = parseInt(process.env.REACT_APP_GROUP_SIZE) || 4;
export const numColumns = groupSize;
export const numRows = numGroups;
export const maxLives = parseInt(process.env.REACT_APP_MAX_LIVES) || 3;
export const wallDuration = parseInt(process.env.REACT_APP_WALL_DURATION) || 150;
export const numBonusPoints = 2;
