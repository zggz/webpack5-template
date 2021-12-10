'use strict'
import path from 'path'
import config from './config.js'
import MiniCssExtractPlugin from "mini-css-extract-plugin"



export const assetsPath = function (_path) {
  return path.posix.join(config.assetsSubDirectory, _path)
}

export const cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }


  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const miniCssLoader = {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    }
    const loaders = [miniCssLoader, cssLoader]
    if (options.usePostCSS) {
      loaders.push(postcssLoader)
    }

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    return loaders
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
export const styleLoaders = function (options) {
  const output = []
  const loaders = cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
