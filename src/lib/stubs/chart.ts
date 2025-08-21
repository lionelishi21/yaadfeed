// Stub for Chart.js to reduce bundle size
export const Chart = {
  register: (...args: any[]) => {},
  defaults: {},
};

// Export all Chart.js components as empty functions
export const CategoryScale = {};
export const LinearScale = {};
export const PointElement = {};
export const LineElement = {};
export const Title = {};
export const Tooltip = {};
export const Legend = {};
export const ArcElement = {};

export default Chart;
