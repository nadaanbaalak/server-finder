const serverFinder = require("./server-finder");

const servers = [
  {
    url: "http://doesNotExist.boldtech.co",
    priority: 1,
  },
  {
    url: "http://boldtech.co",
    priority: 7,
  },
  {
    url: "http://offline.boldtech.co",
    priority: 2,
  },
  {
    url: "http://google.com",
    priority: 4,
  },
];

serverFinder
  .findServer(servers)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
