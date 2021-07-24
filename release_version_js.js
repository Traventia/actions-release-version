#!/usr/bin/env node
const fs = require("fs");

function getVersion([majorMinorPatch, build]) {
  const [major, minor, patch] = majorMinorPatch.split(".");
  let versionBuild;
  if (build) {
    const [buildType, buildNumber] = build.split(".");
    versionBuild = { type: buildType, number: buildNumber };
  }
  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    build: versionBuild ? versionBuild : null,
  };
}

const main = async () => {
  //Get version
  const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  const version = getVersion(packageJson.version.split("-"));

  //Calculate new version
  version.minor += 1;

  //Write new version
  const newVersion = `${version.major}.${version.minor}.${version.patch}${
    version.build !== null ? `-${version.build.type}.${version.build.number}` : ""
  }`;
  packageJson.version = newVersion;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson));

  return newVersion;
};

module.exports = main;
