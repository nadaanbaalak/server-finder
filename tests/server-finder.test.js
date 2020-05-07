const findServer = require("../server-finder").findServer;
const axios = require("axios");

jest.mock("axios"); //mocking the axios module

describe("findServer", () => {
  // case 1: few server are offline,few servers are online and http://google.com has lowest priority
  it("resolves with http://google.com", () => {
    axios.get.mockResolvedValue([null, { status: 201 }, null, { status: 200 }]);
    axios.all.mockResolvedValue([null, { status: 201 }, null, { status: 200 }]);
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
    findServer(servers).then((res) => {
      expect(res).toBe("http://google.com");
    });
  });

  //case 2:few servers are offline,few servers are online and http://boldtech.co has lowest priority
  it("resolves with http://boldtech.co", () => {
    axios.get.mockResolvedValue([null, { status: 201 }, null, { status: 200 }]);
    axios.all.mockResolvedValue([null, { status: 201 }, null, { status: 200 }]);
    const servers = [
      {
        url: "http://doesNotExist.boldtech.co",
        priority: 1,
      },
      {
        url: "http://boldtech.co",
        priority: 3,
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
    findServer(servers).then((res) => {
      expect(res).toBe("http://boldtech.co");
    });
  });

  // case 3: all servers are online and http://google.com has lowest priority
  it("resolves with http://doesNotExist.boldtech.co", () => {
    axios.get.mockResolvedValue([
      { status: 201 },
      { status: 201 },
      { status: 204 },
      { status: 200 },
    ]);
    axios.all.mockResolvedValue([
      { status: 201 },
      { status: 201 },
      { status: 204 },
      { status: 200 },
    ]);
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
    findServer(servers).then((res) => {
      expect(res).toBe("doesNotExist.boldtech.co");
    });
  });

  //case 4: few server are offline with status >=300
  it("rejects with No Server Online", () => {
    axios.get.mockResolvedValue([null, { status: 300 }, null, { status: 404 }]);
    axios.all.mockResolvedValue([null, { status: 300 }, null, { status: 404 }]);
    const servers = [
      {
        url: "http://doesNotExist.boldtech.co",
        priority: 1,
      },
      {
        url: "http://boldtech.co",
        priority: 3,
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

    findServer(servers).then((res) => {
      expect.assertions(1);
      expect(res).toBe("No Server Online");
    });
  });

  // case 5: all servers are offline
  it("rejects with No Server Online", () => {
    axios.get.mockResolvedValue([null, null, null, null]);
    axios.all.mockResolvedValue([null, null, null, null]);
    const servers = [
      {
        url: "http://doesNotExist.boldtech.co",
        priority: 1,
      },
      {
        url: "http://boldtech.co",
        priority: 3,
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

    findServer(servers).then((res) => {
      expect.assertions(1);
      expect(res).toBe("No Server Online");
    });
  });
});
