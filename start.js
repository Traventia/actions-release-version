const spawn = require("child_process").spawn;
const path = require("path");
const releaseVersionJs = require("./release_version_js");

const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
    console.log(`Started: ${cmd} ${args.join(" ")}`);
    const app = spawn(cmd, args, { stdio: "inherit" });
    app.on("close", (code) => {
      if (code !== 0) {
        err = new Error(`Invalid status code: ${code}`);
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });
    app.on("error", reject);
  });

const main = async () => {
  const newversion = await releaseVersionJs();
  await exec("bash", [path.join(__dirname, "./start.sh"), newversion]);
};

main().catch((err) => {
  console.error(err);
  console.error(err.stack);
  process.exit(err.code || -1);
});
