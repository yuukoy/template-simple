const createConfigurator = require('gulp-configurer')
const gulp = require('gulp')

createConfigurator({
  pathSource: '<%= pathApp %>',
  pathOut: '<%= pathDist %>',
  indexPageTemplateEngine: '<%= indexTemplateEngine %>',
  templateEngine: '<%= viewTemplateEngine %>',
  useStyle: <%= useStyle %>,
  <% if (useStyle) { %>
  cssPreprocessor: '<%= cssPreprocessor %>',
  <% } %>
  useScript: <%= useScript %>,
  <% if (useScript) { %>
  bundler: '<%= bundler %>',
  <% } %>
  <% if (useScript && bundler === 'webpack') { %>
  webpackConfig: require('<%= pathWebpackConfig %>'),
  <% } %>
  useBrowserSync: <%= useBrowserSync %>,
  verbose: <%= verbose %>,
  gulp: require('gulp')
})()
