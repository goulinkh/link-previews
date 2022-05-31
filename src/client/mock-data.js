window.linkPreviews.SERVER_URL = "";

const mockData = {
  "https://ubuntu.com/internet-of-things": {
    screenshot: "/screenshots/ubuntu.png",
    metadata: {
      title: "Enterprise Open Source and Linux | Ubuntu",
      description:
        "Ubuntu is the modern, open source operating system on Linux for the enterprise server, desktop, cloud, and IoT.",
      icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png",
      url: "https://www.ubuntu.com",
      hostname: "ubuntu.com",
    },
  },
  "https://www.linux.com/": {
    screenshot: "/screenshots/linux.jpg",
    metadata: {
      title: "Linux.com - News For Open Source Professionals",
      description:
        "Linux.com is the go-to resource for open source professionals to learn about the latest in Linux and open source technology, careers, best practices, and industry trends. Get news, information, and tutorials to help advance your next project or career – or just to simply stay informed.",
      icon: "https://www.linux.com/wp-content/uploads/2019/08/favicon-300x300.png",
      hostname: "linux.com",
    },
  },
  "https://www.debian.org": {
    screenshot: "/screenshots/debian.jpg",
    metadata: {
      title: "Debian -- The Universal Operating System ",
      icon: "https://www.debian.org/favicon.ico",
      hostname: "debian.org",
    },
  },
  "https://en.wikipedia.org/wiki/Free_and_open-source_software": {
    screenshot: "/screenshots/wikipedia.jpg",
    metadata: {
      title: "Free and open-source software - Wikipedia",
      icon: "https://en.wikipedia.org/static/favicon/wikipedia.ico",
      hostname: "wikipedia.org",
    },
  },
};
Object.keys(mockData).forEach(
  (url) => console.log(url) || previews.set(url, mockData[url])
);
