'use strict';
var engine_src = "src/engines/";
var adaptor_src = "src/adaptor/js/";
var vendors = "../../../../vendors/"
var dist = "dist/";
var requireLib = "vendors/requirejs/";

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
            }
        },
        
        // concat adaptor js to adaptor.js
        concat: {
            vendorLibs: {
                src: [
                    'vendors/jquery/jquery.js',
                    'vendors/bootstrap/dist/js/bootstrap.js',
                    'vendors/handlebars/handlebars.js'
                ],
                dest: dist + 'js/vendor.js'
            }
        },
        requirejs: {
            nfib: {
                options: {
                    baseUrl: engine_src + "nfib/js",
                    name: "nfib",
                    out: dist + "js/nfib.js",
                    paths: {
                        'text': vendors + 'text/text',
                        'css': vendors + 'require-css/css',
                        'css-builder': vendors + 'require-css/css-builder',
                        'normalize': vendors + 'require-css/normalize'
                    },
                    optimize: 'none',
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
        },
        // Minify all the js files present inside "dist/js"
        uglify: {
            libjs: {
                files: {
                    'dist/js/require.min.js': [requireLib + 'require.js']
                }
            }
        },
       
       
       

    });
    
    //Load grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    
    // Default task
    grunt.registerTask('default', [ 
        'clean:dist',
        'concat',
        'uglify',
        'requirejs',
        'clean:engines'
    ]);  

};
