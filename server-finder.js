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
            reject("No Server Online");
          }
        })
      )
      .catch((error) => console.log(error));
  });
}

module.exports.findServer = findServer;
