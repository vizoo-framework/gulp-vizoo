'use strict';

var Transform = require('readable-stream/transform');
var common = require('./common');
var request = require('request');
var http = require("http");

module.exports = function gulpHtmlmin(options) {

  return new Transform({
    objectMode: true,
    transform: function htmlminTransform(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      var self = this;

      function initProcess(file, done) {
        var result;
        
        var buf = file.contents;

            var plugins = options.main.plugins;
            var attr = options.main.attr;
            var version = options.main.version || '0.0.1';
            var source = options.main.source || 'http://vizoo.online/core/'+version;
            var src = String(buf);
            var dest = cb;
         


            var vizooPluginsList = plugins;
            var vizooPluginsListCurl = {};
            var concatSourceJs = [];
            var concatSourceCss = [];
            var index = 0;

            vizooPluginsListCurl[index] = {
                name:'core',
                type:'js-master',
                src: source + '/vizoo.js',
            }

            var themename = "THEME-NAME";

            for(var key in vizooPluginsList){
                var plugin = vizooPluginsList[key];
                var pluginArray = plugin.split('@');
                var plugin2Js = plugin;
                var plugin2Css = plugin;
                var pluginName = plugin;
                

                if( pluginArray[0] == 'theme' ){
                    plugin = 'theme';
                    plugin2Js = 'theme';
                    themename = pluginArray[1];
                    plugin2Css = pluginArray[1] + '/'+'theme';
                }

                index++;

                vizooPluginsListCurl[index] = {
                    name:pluginName,
                    type:'js',
                    src: source + '/plugins/'+plugin+'/'+plugin2Js+'.js',
                }

                index++;

                vizooPluginsListCurl[index] = {
                    name:pluginName,
                    type:'css',
                    src: source + '/plugins/'+plugin+'/'+plugin2Css+'.css',
                }
            }







            function step(array,index,name,body,type,attr,plugins,src,dest,file){

                if(type == 'js-master'){
                    var attrString = JSON.stringify(attr);
                    attrString = attrString.replace('{','');
                    attrString = attrString.replace('}','');
                    masterJs = '<script type="text/javascript" data-vizoo-core data-vizoo-attr=\''+attrString+'\'>'+"\n"+body+"\n"+'</script>';

                }
                if(type == 'js')
                    allJs += '<script type="text/javascript" data-name="'+name+'">'+"\n"+body+"\n"+'</script>';
                if(type == 'css'){
                    allCss += '<style type="text/css" data-name="'+name+'">'+"\n"+body+"\n"+'</style>';                    
                }

                if( index >= (Object.keys(array).length -1) ){
                    var joins = masterJs+''+allJs+''+allCss;

                    src = src.replace(/\<\!\-\-\s?gulp-vizoo\/\s?\-\-\>[^]+(.*)\<\!\-\-\s?\/gulp-vizoo\s?\-\-\>/mgi,joins);
                        
                    console.log("\n\n"+'Attention: insert the attribute on tag HTML: data-vizoo-theme="'+themename+'" '+"\n\n");

                     
                    var contents = new Buffer(src);
                    file.contents = contents;
                    done(null, contents);
                    self.push(file);
                }
            }





              var masterJs = '';
              var allJs = '';
              var allCss = '';
              var index = 0;


              var downloadScript = function(downloadScript,vizooPluginsListCurl,index,file){

                if( vizooPluginsListCurl[index] == undefined){
                    return false;
                }

                var name = vizooPluginsListCurl[index].name;
                var type = vizooPluginsListCurl[index].type;
                var path = vizooPluginsListCurl[index].src;

                console.log(index+' : downloading Vizoo... '+name+' - '+type);

                request.get(path,function(error,response,body){
                    if (!error && response.statusCode == 200) {
                        step(vizooPluginsListCurl,index,name,body,type,attr,plugins,src,dest,file);
                        index++;
                        downloadScript(downloadScript,vizooPluginsListCurl,index,file);
                    }else{
                        console.log('error on download: '+name+' - '+path);
                    }

                });
              }

              downloadScript(downloadScript,vizooPluginsListCurl,0,file);

       
      }

      


      initProcess(file, function(err, contents) {});

    }
  });
};
