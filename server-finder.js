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
    //Creating a Promise object that either with online server with lowest priority or rejects with "No server online"
    axios
      .all(httpRequests) //making simultaneous requests
      .then(
        axios.spread((...args) => {
          let serverIndex = -1; //index of the resolved server
          let serverPriority; //priority of the resolved server
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

          //checking if server are online
          if (serverPriority != null && serverPriority != undefined) {
            resolve(servers[serverIndex].url); //resolving with lowest priority server
          } else {
            reject("No Server Online"); //rejecting incase of no online server
          }
        })
      )
      .catch((error) => {
        throw error;
      });
  });
}

module.exports.findServer = findServer;
