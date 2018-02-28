import path from 'path'
import test from 'ava'
import sao from 'sao'

const template = path.join(__dirname, '..')

const testIndexPageGenerator = function(indexPageFormat, indexPageName) {
  return async function(t) {
    const stream = await sao.mockPrompt(template, {indexPageFormat})

    stream.fileList.forEach(filePath => {
      if (filePath === indexPageName) {
        t.pass()
      }
    })
  }
}

test('Test index.pug generation', testIndexPageGenerator('pug', 'app/index.pug'))
test('Test index.pug generation', testIndexPageGenerator('html', 'app/index.html'))
