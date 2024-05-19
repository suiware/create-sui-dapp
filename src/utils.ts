import chalk from "chalk";
import { execSync } from "child_process";
import commandExists from "command-exists";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { SOURCE_REPO } from "./constants.js";

export const cloneStarter = async (projectName: string) => {
  checkFolderExists(projectName);

  await runCommand(
    `git clone --depth 1 ${SOURCE_REPO} "${projectName}"`,
    "+ Cloned the source repo",
    "- Cannot clone the source repo"
  );

  await runCommand(
    `cd ${projectName} && rm -rf ./.git`,
    "+ Removed old git history",
    "- Cannot remove old git history"
  );

  await runCommand(
    `cd ${projectName} && git init && git add . && git commit -m "Initial commit"`,
    "+ Initialized a new git repo",
    "- Cannot initialize a new git repo"
  );
};

export const checkGit = async () => {
  try {
    await commandExists("git");
  } catch {
    displayErrorMessage(
      "Git not found. Please install https://git-scm.com/downloads"
    );
    process.exit(1);
  }
};

export const checkFolderExists = (projectPath: string) => {
  const fullPath = path.resolve(process.cwd(), projectPath);

  let doesFolderExist = false;
  try {
    doesFolderExist = fs.existsSync(fullPath);
  } catch {
    doesFolderExist = true;
  }

  if (doesFolderExist) {
    displayErrorMessage(
      "The folder already exists. Please remove or choose another project name."
    );
    process.exit(1);
  }
};

export const displayErrorMessage = (message: string) => {
  console.error(chalk.red(message));
};

export const displaySuccessMessage = (message: string) => {
  console.log(chalk.green(message));
};

export async function promptForProjectName(args: string) {
  if (!args) {
    const { projectName } = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        default: "my-sui-dapp",
        message: "Please specify a name for your project: ",
        validate: (input: string) => {
          if (input == null || input.trim().length === 0) {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    displaySuccessMessage(`Creating "${projectName}" project...`);
    return projectName;
  }
  return args;
}

export const runCommand = (
  command: string,
  successMessage: string,
  errorMessage: string,
  verbose: boolean = false
) => {
  const ignore = !verbose ? "ignore" : undefined;

  try {
    execSync(command, {
      stdio: ignore,
    });
  } catch (e) {
    displayErrorMessage(errorMessage);
    verbose && console.error(e);
    process.exit(1);
  }

  displaySuccessMessage(successMessage);
};
