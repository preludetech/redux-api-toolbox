export function getCurrentLoggedInUser({ state }) {
  const userDict = (state.apiEntities || {}).loggedInUser;
  return userDict ? Object.values(userDict)[0] : null;
}
