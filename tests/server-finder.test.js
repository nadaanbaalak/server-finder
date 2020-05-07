const findServer = require("../server-finder").findServer;
const axios = require("axios");

jest.mock("axios"); //mocking the axios module

describe("findServer", () => {
  // case 1: all servers are online and http://doesNotExist.boldtech.co has lowest priority
  it("resolves with http://doesNotExist.boldtech.co", () => {
    axios.get.mockResolvedValue({ status: 201 });
    axios.all.mockResolvedValue([
      { status: 201 },
      { status: 201 },
      { status: 201 },
      { status: 201 },
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

  // case 2: all servers are online and http://google.com has lowest priority
  it("resolves with http://google.com", () => {
    axios.get.mockResolvedValue({ status: 201 });
    axios.all.mockResolvedValue([
      { status: 201 },
      { status: 201 },
      { status: 201 },
      { status: 201 },
    ]);
    const servers = [
      {
        url: "http://doesNotExist.boldtech.co",
        priority: 4,
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
        priority: 1,
      },
    ];
    findServer(servers).then((res) => {
      expect(res).toBe("google.com");
    });
  });

  //case 2: all server are offline with status >=300
  it("rejects with No Server Online", () => {
    axios.get.mockResolvedValue({ status: 300 });
    axios.all.mockResolvedValue([
      { status: 300 },
      { status: 300 },
      { status: 300 },
      { status: 300 },
    ]);
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

  // case 3: all servers are offline
  it("rejects with No Server Online", () => {
    axios.get.mockResolvedValue(null);
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
