import Listr from 'listr'

const chalk = require('chalk')
const fs = require('fs')
const ncp = require('ncp')
const path = require('path')
const { promisify } = require('util')
const execa = require('execa')
const listr = require('listr')
const { projectInstall } = require('pkg-install')

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {

    return copy(
        options.templateDirectory,
        options.targetDirectory,
        {
            clobber: false,
        }
    )

}

async function initGit(options) {
    const result = await execa(
        'git',
        ['init'],
        {
            cwd: options.targetDirectory,
        }
    )
    if (result.failed) {
        return Promise.reject(new Error('Falied too initialize Git repo'))
    }
    return
}

export async function createProject(options) {

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    const currentFileUrl = import.meta.url
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        options.template.toLowerCase()
    ).slice(3)
    options.templateDirectory = templateDir

    try {
        await access(templateDir, fs.constants.R_OK)
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'))
        console.error(err)
        process.exit(1)
    }

    const tasks = new Listr([
        {
            title: 'Copying project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Initializing git repository',
            task: () => initGit(options),
            enabled: () => options.git
        },
        {
            title: 'Installing dependencies',
            task: () => projectInstall({
                cwd: options.targetDirectory
            }),
            skip: () => !options.runInstall ? 'Pass --install to autmatically install dependencies'
                : undefined
        }
    ])

    await tasks.run()

    console.log('%s Project ready', chalk.green.bold('DONE'))
    return true

}