const createConfigurator = require('gulp-configurer')
const gulp = require('gulp')

createConfigurator({
  pathSource: '<%= pathApp %>',
  pathOut: '<%= pathDist %>',
  indexPageTemplateEngine: '<%= indexTemplateEngine %>',
  templateEngine: '<%= viewTemplateEngine %>',
  useStyle: <%= useStyle %>,
  cssPreprocessor: '<%= cssPreprocessor %>',
  useScript: <%= useScript %>,
  bundler: '<%= bundler %>',
  <% if (bundler === 'webpack') { %>
  webpackConfig: require('<%= pathWebpackConfig %>'),
  <% } %>
  useBrowserSync: <%= useBrowserSync %>,
  verbose: <%= verbose %>,
  gulp: require('gulp')
})()
