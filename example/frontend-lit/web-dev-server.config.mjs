// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes("--hmr");

import rollupReplace from "@rollup/plugin-replace";
// import rollupLitcss from "rollup-plugin-lit-css";

import { fromRollup } from "@web/dev-server-rollup";

const production = false;
const replace = fromRollup(rollupReplace);
// const litcss = fromRollup(rollupLitcss);
export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: "/",
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ["browser", "development"],
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'demo/index.html',

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
    replace({
      preventAssignment: false,
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      ),
      "process.env.API_BASE_URL": JSON.stringify("http://127.0.0.1:8000"),
    }),
    // litcss(),
  ],

  // See documentation for all available options
});
