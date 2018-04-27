

# gulp-vizoo

> Add Vizoo script and inline plugins into HTML document

## Getting Started
This plugin requires Gulp `^3.9.1`

```shell
npm install gulp-vizoo --save-dev
```

Once the plugin has been installed, it may be enabled inside your gulpfile.js with this line of JavaScript:

```js
var vizoo = require('gulp-vizoo');
```

## The "vizoo" task

### Overview
No seu projeto adicione uma fonte, um pipe com o a variavel vizoo, e o destino.
Segue exemplo:

```js
gulp.src('dev/index.html')
  .pipe(vizoo({              
    main: {
      plugins:['theme@red','grid'],
          attr:{splash:false}
      }
    }))
    .pipe(gulp.dest('./dist/'));
```

### Options

#### plugins

An array containing the names of the files you use

#### attr

attribute parameters **data-vizoo-attr** used in the vizu script tag

### Usage Examples

```js
gulp.task('default', function(cb) {
  gulp.src('dev/index.html')
  .pipe(vizoo({              
    main: {
      plugins:['theme@red','grid'],
          attr:{splash:false}
      }
    }))
    .pipe(gulp.dest('./dist/'));
});
```


#### document replace

add in your document HTML the next comments:

```html
<!-- gulp-vizoo/ -->
  <script></script>
<!-- /gulp-vizoo -->
```
Content will be replaced with the vizco scripts


### Usage Examples

```html
<!DOCTYPE html>
<html>
<head>
  <title></title>

  <!-- gulp-vizoo/ -->
    <script
  type="text/javascript" data-vizoo-core
    src="http://vizoo.online/core/v1/vizoo.js"     
  data-vizoo-plugins="cards|tabs|grid|import|gallery|timeline"
    data-vizoo-attr="splash:true,splashColor1:'#333',splashColor2:'#02ffe0'"
  ></script>
    <!-- /gulp-vizoo -->
</head>
<body>
  <p>Content</p>
</body>
</html>
```

> Attention: insert the attribute on tag HTML: data-vizoo-theme="THEME-NAME"