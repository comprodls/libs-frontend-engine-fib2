'use strict';
var bowerjson = require('./bower.json');
var engine_src = "src/js";
var adaptor_src = "src/adaptor/js/";
var bower_components = "../../bower_components/"
var dist = "dist/";
var requireLib = "bower_components/requirejs/";

module.exports = function(grunt) {
    // Grunt project configuration.
    grunt.initConfig({
        // Task configuration. 
        
        // clean dist folder
        clean: {            
            dist: {
                options: {
                    force: true
                },
                src: [
                    dist
                ]
            },
            bower: {
               src: "bower_components"
            },
        },

        bower: {
            install: {
              options: { 
                verbose: true,
                copy:false
              }             
            }
        },
        
       /* concat: {
            vendorLibs: {
                src: [
                    'bower_components/jquery/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/handlebars/handlebars.js'
                ],
                dest: dist + 'vendor.js'
            }
        },*/
        requirejs: {
            nfib: {
                options: {
                    baseUrl: engine_src,
                    name: "nfib",
                    out: dist + "nfib.js",
                    paths: {
                        'text': bower_components + 'text/text',
                        'css': bower_components + 'require-css/css',
                        'css-builder': bower_components + 'require-css/css-builder',
                        'normalize': bower_components + 'require-css/normalize'
                    },
                    optimize: 'uglify2',
                    uglify2: {
                        mangle: false
                    },
                    exclude: ['normalize'],
                    done: function (done, output) {
                        console.log('done requirejs for nfib module');
                        done();
                    }
                }
            }
        }

    });
    
    //Load grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    
    // Default task
    grunt.registerTask('default', [ 
        'clean:dist',
        //'clean:bower',
        //'bower:install',
        //'concat',
        'requirejs'
        //'uglify'
    ]);  

};
