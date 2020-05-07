const axios = require("axios");

function findServer(servers) {
  //creating an array of axios GET request
  const httpRequests = servers.map((server) =>
    axios
      .get(server.url, { timeout: 5000 })
      .then((response) => response)
      .catch((error) => null)
  );

  return new Promise((resolve, reject) => {
    //Creating a Promise object that either with online server with lowest priority or
    axios
      .all(httpRequests)
      .then(
        axios.spread((...args) => {
          let serverIndex = -1;
          let serverPriority;
          args.map((arg, index) => {
            if (arg != null) {
              if (arg.status >= 200 && arg.status <= 299) {
                if (
                  serverPriority == undefined ||
                  servers[index].priority < serverPriority
                ) {
                  serverPriority = servers[index].priority;
                  serverIndex = index;
                }
              }
            }
          });

          if (serverPriority != null && serverPriority != undefined) {
            resolve(servers[serverIndex].url);
          } else {
            reject("All servers offline");
          }
        })
      )
      .catch((error) => console.log(error));
  });
}

findServer([
  {
    url: "https://httpstat.us/401",
    priority: 1,
  },
  {
    url: "https://httpstat.us/402",
    priority: 3,
  },
  {
    url: "https://httpstat.us/300",
    priority: 2,
  },
  {
    url: "https://httpstat.us/404",
    priority: 4,
  },
])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
module.exports.findServer = findServer;
