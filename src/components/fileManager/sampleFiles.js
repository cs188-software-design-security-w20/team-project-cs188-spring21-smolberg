function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const sampleFiles = [
  {
    name: "report.pdf",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "README",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "movie.avi",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "data.csv",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "test.doc",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "pgm.exe",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "index.html",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "src.js",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "image.jpg",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "x.json",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "video.mp4",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "song.mp3",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "presentation.ppt",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
  {
    name: "compressed.zip",
    sum: "d8837d6a773331f74705ad54e4f17c220acd89d28dd33e99451ba282fce9f8f9",
    lastModTime: randomDate(new Date(2021, 1, 1), new Date()),
  },
];

export default sampleFiles;
