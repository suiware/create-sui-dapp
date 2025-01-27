#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { APP_NAME } from './constants.js'
import {
  capitalize,
  checkGit,
  displayErrorMessage,
  displayInfoMessage,
  getPackageVersion,
  promptForSettings,
  scaffoldProject,
} from './utils.js'

const main = async () => {
  await checkGit()

  const program = new Command()

  program
    .name('create-sui-dapp')
    .description(`Install ${APP_NAME} with ease`)
    .version(getPackageVersion())
    .arguments('[project-name]')
    .action(async (args: string) => {
      const choices = await promptForSettings(args)
      if (!choices) {
        displayErrorMessage(`\nIncorrect input. Please try again.\n`)
        return
      }

      const { projectName, template } = choices

      displayInfoMessage(
        `\nCreating "${projectName}" project from ${capitalize(template)} template...\n`
      )
      await scaffoldProject(projectName, template)
    })

  program.parse()
}

// Main entry point.
main().catch((e) => {
  console.error(chalk.red(e))
})
