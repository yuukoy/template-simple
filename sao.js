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
      default: '',
      filter: val => val.toLowerCase(),
      store: true
    },
    username: {
      message: 'What is your GitHub username?',
      default: ':gitUser:',
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
      default: ':gitEmail:',
      store: true
    },
    serverPort: {
      message: 'What port number would you use for development server?',
      default: '9901'
    },
    serverHost: {
      message: 'What the name of the host that you\'d use for development server?',
      default: 'localhost'
    }
  },
  move: {
    'gitignore': '.gitignore'
  },
  gitInit: true,
  installDependencies: true
};
