const path = require('path')
const fs = require('fs')

module.exports = {
  prompts: {
    projectName: {
      message: 'What is the name of your project?',
      default: ':folderName:',
      filter: val => val.toLowerCase()
    },
    version: {
      message: 'What version your project would have initially?',
      default: '0.0.1'
    },
    description: {
      message: 'What is description of your project',
      default: ''
    },
    fullname: {
      message: 'What is your fullname?',
      default: ':gitUser:',
      filter: val => val.toLowerCase(),
      store: true
    },
    username: {
      message: 'What is your GitHub username?',
      default: '',
      filter: val => val.toLowerCase(),
      store: true
    },
    email: {
      message: 'What is your GitHub email?',
      default: ':gitEmail:',
      store: true
    },
    repo: {
      message: 'What is repo of this project?',
      default: '',
      store: true
    },
    indexTemplateEngine: {
      type: 'list',
      message: 'What template engine should be used for index page?',
      default: 'plain',
      choices: [
        'pug',
        'markdown',
        'plain'
      ]
    },
    viewTemplateEngine: {
      type: 'list',
      message: 'What template engine should be used for views?',
      default: 'plain',
      choices: [
        'pug',
        'markdown',
        'plain'
      ]
    },
    useStyle: {
      type: 'confirm',
      message: 'Should styles be used?',
      default: true
    },
    cssPreprocessor: {
      type: 'list',
      message: 'What css preprocessor should be used?',
      default: 'plain',
      choices: [
        'less',
        'plain'
      ],
      when: answers => answers.useStyle
    },
    useScript: {
      type: 'confirm',
      message: 'Should scripts be used?',
      default: true
    },
    bundler: {
      type: 'list',
      message: 'What bundler should be used?',
      default: 'plain',
      choices: [
        'webpack',
        'plain'
      ],
      when: answers => answers.useScript
    },
    pathWebpackConfig: {
      type: 'input',
      message: 'Directory name of source directory?',
      default: './webpack.config.js',
      when: answers => answers.bundler === 'webpack'
    },
    pathApp: {
      type: 'input',
      message: 'Directory name of source directory?',
      default: 'app' 
    },
    pathDist: {
      type: 'input',
      message: 'Directory name of dist directory?',
      default: 'dist' 
    },
    useBrowserSync: {
      type: 'confirm',
      message: 'Should browser sync be used?',
      default: false
    },
    verbose: {
      type: 'confirm',
      message: 'Enable verbose mode?',
      default: false
    },
    installDependencies: {
      type: 'confirm',
      message: 'Should dependencies be installed right now?',
      default: true
    },
    packageManager: {
      type: 'list',
      message: 'What package manager should be used?',
      choices: [
        'npm',
        'yarn'
      ],
      default: 'yarn',
      store: true,
      when: answers => answers.installDependencies
    }
  },
  move: {
    'gitignore': '.gitignore'
  },
  post(context) {
    const answers = context.answers

    createFiles(context)

    if (answers.installDependencies) {
      installDependencies(context)
    }

    initGitRepository(context)
  }
}

function createFiles(context) {
  createIndexPage(context)
  createDefaultView(context)
  createDefaultStyle(context)
  createDefaultScript(context)
}

function createIndexPage(context) {
  const indexPagePath = generateIndexPagePath(context)
  ensureParentsExist(indexPagePath)
  createEmptyFile(indexPagePath)
}

function generateIndexPagePath(context) {
  const answers = context.answers
  const indexTemplateEngine = answers.indexTemplateEngine
  const pathApp = answers.pathApp

  const indexPagePathGenerators = {
    'pug': function () {
      return path.join(context.folderPath, pathApp, 'index.pug')
    },                                     
    'markdown': function () {             
      return path.join(context.folderPath, pathApp, 'index.md')
    },                                     
    'plain': function () {                 
      return path.join(context.folderPath, pathApp, 'index.html')
    },
    'default': function () {
      throw new Error('Invalid index page template engine')
    }
  }

  const generator = (indexPagePathGenerators[indexTemplateEngine] ||
                     indexPagePathGenerators['default'])

  return generator()
}

function ensureParentsExist(filepath, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const targetDir = path.dirname(filepath)
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    }
    catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    return curDir;
  }, initDir);
}

function createEmptyFile(filepath) {
  fs.closeSync(fs.openSync(filepath, 'a'));
}

function createDefaultView(context) {
  const defaultViewPath = generateDefaultViewPath(context)
  ensureParentsExist(defaultViewPath)
  createEmptyFile(defaultViewPath)
}

function generateDefaultViewPath(context) {
  const answers = context.answers
  const viewTemplateEngine = answers.viewTemplateEngine
  const pathApp = answers.pathApp

  const defaultViewPathGenerators = {
    'pug': function () {
      return path.join(context.folderPath, pathApp, 'view', 'view.pug')
    },                                     
    'markdown': function () {                 
      return path.join(context.folderPath, pathApp, 'view', 'view.md')
    },
    'plain': function () {                 
      return path.join(context.folderPath, pathApp, 'view', 'view.html')
    },
    'default': function () {
      throw new Error('Invalid template engine')
    }
  }

  let pathGenerator = (defaultViewPathGenerators[viewTemplateEngine] ||
                       defaultViewPathGenerators['default'])

  return pathGenerator()
}

function createDefaultStyle(context) {
  const defaultStylePath = generateDefaultStylePath(context)

  ensureParentsExist(defaultStylePath)
  createEmptyFile(defaultStylePath)
}

function generateDefaultStylePath(context) {
  const answers = context.answers
  const cssPreprocessor = answers.cssPreprocessor
  const pathApp = answers.pathApp

  const defaultStylePathGenerators = {
    'less': function () {
      return path.join(context.folderPath, pathApp, 'style', 'style.less')
    },                                     
    'plain': function () {                 
      return path.join(context.folderPath, pathApp, 'style', 'style.css')
    },
    'default': function () {
      throw new Error('Invalid css preprocessor')
    }
  }

  let pathGenerator = (defaultStylePathGenerators[cssPreprocessor] ||
                       defaultStylePathGenerators['default'])

  return pathGenerator()
}

function createDefaultScript(context) {
  const defaultScriptPath = generateDefaultScriptPath(context)

  ensureParentsExist(defaultScriptPath)
  createEmptyFile(defaultScriptPath)
}

function generateDefaultScriptPath(context) {
  const answers = context.answers
  const pathApp = answers.pathApp

  return path.join(context.folderPath, pathApp, 'script', 'script.js')
}

function installDependencies(context) {
  const packageManager = context.answers.packageManager
  const installers = {
    'npm': function () {
      context.npmInstall()
    },
    'yarn': function () {
      context.yarnInstall()
    },
    'default': function () {
      throw new Error('Incorrect value of option \'packageManager\': ' + packageManager)
    }
  }

  const installer = (installers[packageManager] || installers['default'])

  installer()
}

function initGitRepository(context) {
  context.gitInit()
}
