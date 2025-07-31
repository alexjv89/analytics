// Mock server-only
jest.mock("server-only", () => {});

// Mock database
// jest.mock("@/database", () => ({
//   Sequelize: {
//     Op: {
//       iLike: "iLike",
//       or: "or",
//       gte: "gte",
//       lte: "lte",
//     },
//   },
// }));

// Add testing-library jest-dom matchers
require("@testing-library/jest-dom");
