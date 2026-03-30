//TODO: Minify this file before making it publicly available
const API_ROOT = 'https://a4ac4g3krj.execute-api.us-west-2.amazonaws.com/prod/';
const AWE_UUID = 'awe-8wall-uuid';

function getLoggedInUser() {
  return localStorage.getItem(AWE_UUID);
}

function setLoggedInUser(uuid) {
  localStorage.setItem(AWE_UUID, uuid);
}

function logout() {
  localStorage.removeItem(AWE_UUID);
}

function doAjax(method, url, data, cb) {
  axios({
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    params: data,
    url: API_ROOT + url,
    validateStatus: (status) => true,
  }).then((response) => {
    if (response.status === 200) {
      return cb && cb(response.data, undefined);
    }
    return cb && cb(undefined, response.data);
  }).catch((error) => {
    return cb && cb(undefined, error);
  });
}

function login(display, email, cb) {
  doAjax('GET', 'email/' + email, { display }, cb);
}

function register(display, email, cb) {
  doAjax('POST', 'email/' + email, JSON.stringify({ display }), cb);
}

function getPortalRank(portal, uuid, cb) {
  doAjax('GET', 'portal/' + portal, { uuid }, cb);
}

function getPortalWinner(portal, cb) {
  doAjax('GET', 'portal/' + portal, {}, cb);
}

function getLeaderboard(uuid, cb) {
  doAjax('GET', 'leaderboard', { uuid }, cb);
}

function signSolution(data) {
  return CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(data));
}

function solvePortal(portal, uuid, cb) {
  let solution = {
    portal,
    solveTime: Date.now(),
    uuid,
  };
  const solutionData = JSON.stringify(solution, Object.keys(solution).sort());
  const password = signSolution(signSolution(solutionData));
  doAjax('POST', 'solutions/' + portal, JSON.stringify({
    password,
    solveTime: solution.solveTime,
    uuid: solution.uuid,
  }), cb);
}

function getUserData(uuid, cb) {
  doAjax('GET', 'user/' + uuid, {}, cb);
}
