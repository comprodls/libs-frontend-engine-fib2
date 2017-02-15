'use strict';
var engine_src = "src/engines/";
var adaptor_src = "src/adaptor/js/";
var skin_src = "src/skins/default/";
var vendors = "../../../../vendors/"
var dist = "dist/";
var requireLib = "vendors/requirejs/";

module.exports = function(grunt) {
    // Grunt project configuration.
    grunt.initConfig({
		// Task configuration.
        
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),  
		
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
            engines: [
                engine_src + 'fib/js/fib-min-<%= pkg.version %>.js',
				engine_src + 'chart/js/chart-min-<%= pkg.version %>.js',
                engine_src + 'mcq/js/mcqsc-min-<%= pkg.version %>.js',
                engine_src + 'mcqmc/js/mcqmc-min-<%= pkg.version %>.js',
                engine_src + 'dnd/js/dnd-min-<%= pkg.version %>.js',
                engine_src + 'multi-item/js/placementtest-min-<%= pkg.version %>.js',
                engine_src + 'oe/js/oe-min-<%= pkg.version %>.js',
                engine_src + 'nfib/js/nfib-min-<%= pkg.version %>.js'
            ]
        },
		// Convert less to css
		less:{
            main :{               
                files:[
						{
							src : skin_src + 'styles.less',
                            dest: dist + "css/styles.css"
						}
			        ]
                }
        },
		// copy audio swf to "dist/js" folder
		copy: {
			js: {
				src: [adaptor_src + 'shell.js'],
				dest: dist + 'js/shell.js'
            },
			swf: {
				expand: true,
				flatten: true,
				cwd: engine_src,
				src: ['**/js/audiojs.swf'],
				dest: dist + "js"
            },
           engines: {
               files: [
                   {src: [engine_src + 'fib/js/fib.js'], dest: engine_src + 'fib/js/fib-min-<%= pkg.version %>.js'},
				   {src: [engine_src + 'chart/js/chart.js'], dest: engine_src + 'chart/js/chart-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'mcq/js/mcqsc.js'], dest: engine_src + 'mcq/js/mcqsc-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'mcqmc/js/mcqmc.js'], dest: engine_src + 'mcqmc/js/mcqmc-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'dnd/js/dnd.js'], dest: engine_src + 'dnd/js/dnd-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'multi-item/js/placementtest.js'], dest: engine_src + 'multi-item/js/placementtest-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'oe/js/oe.js'], dest: engine_src + 'oe/js/oe-min-<%= pkg.version %>.js'},
                   {src: [engine_src + 'nfib/js/nfib.js'], dest: engine_src + 'nfib/js/nfib-min-<%= pkg.version %>.js'},
               ]
            }
	    },
		// concat adaptor js to adaptor.js
		concat: {
			adaptorScripts: {
				src: [
					adaptor_src + 'utils.js',
					adaptor_src + 'activityadapter.js'
				],
				dest: dist + 'js/adaptor.js'
			},
            vendorLibs: {
                src: [
                    'vendors/jquery/jquery.js',
                    'vendors/bootstrap/dist/js/bootstrap.js',
					'vendors/handlebars/handlebars.js',
					'vendors/imagesloaded/imagesloaded.pkgd.js'
            	],
                dest: dist + 'js/vendor.js'
            }
	    },
		// Minify styles.css present inside "dist/css"
		cssmin: {
          main: {
            files: [
                    {
					  src: [dist + "css/styles.css"],
					  dest: dist + "css/styles.min.css"
					}
            ]
          }
        },
		requirejs: {
			// Compilation of all fib engine dependencies to fib.js
            fibMinified: {
                options: {
                    baseUrl: engine_src + "fib/js",
					name: "fib-min-<%= pkg.version %>",
					out: dist + "js/fib-min-<%= pkg.version %>.js",
					paths: {
                        'text': vendors + 'text/text',
						'css': vendors + 'require-css/css',
						'css-builder': vendors + 'require-css/css-builder',
						'normalize': vendors + 'require-css/normalize'
                    },
					optimize: "uglify2",
					exclude: ['normalize'],
					done: function (done, output) {
						console.log('done requirejs for fib module');
						done();
					}
                }
            },
            fib: {
                options: {
                    baseUrl: engine_src + "fib/js",
					name: "fib",
					out: dist + "js/fib.js",
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
						console.log('done requirejs for fib module');
						done();
					}
                }
            },
            nfibMinified: {
                options: {
                    baseUrl: engine_src + "nfib/js",
                    name: "nfib-min-<%= pkg.version %>",
                    out: dist + "js/nfib-min-<%= pkg.version %>.js",
                    paths: {
                        'text': vendors + 'text/text',
                        'css': vendors + 'require-css/css',
                        'css-builder': vendors + 'require-css/css-builder',
                        'normalize': vendors + 'require-css/normalize'
                    },
                    optimize: "uglify2",
                    exclude: ['normalize'],
                    done: function (done, output) {
                        console.log('done requirejs for nfib module');
                        done();
                    }
                }
            },
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
            },
            // Compilation of all chart engine dependencies to chart.js
			chartMinified: {
                options: {
                    baseUrl: engine_src + "chart/js",
					name: "chart-min-<%= pkg.version %>",
					out: dist + "js/chart-min-<%= pkg.version %>.js",
					paths: {
                        'text': vendors + 'text/text',
						'css': vendors + 'require-css/css',
						'css-builder': vendors + 'require-css/css-builder',
						'normalize': vendors + 'require-css/normalize'
                    },
					optimize: "uglify2",
					exclude: ['normalize'],
					done: function (done, output) {
						console.log('done requirejs for chart module');
						done();
					}
                }
            },
            chart: {
                options: {
                    baseUrl: engine_src + "chart/js",
					name: "chart",
					out: dist + "js/chart.js",
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
						console.log('done requirejs for chart module');
						done();
					}
                }
            },
			// Compilation of all mcqsc engine dependencies to mcqsc.js
            mcqscMinified: {
                options: {
                    baseUrl: engine_src + "mcq/js",
					name: "mcqsc-min-<%= pkg.version %>",
					out: dist + "js/mcqsc-min-<%= pkg.version %>.js",
					paths: {
                        'text': vendors + 'text/text',
						'css': vendors + 'require-css/css',
						'css-builder': vendors + 'require-css/css-builder',
						'normalize': vendors + 'require-css/normalize'
                    },
					optimize: "uglify2",
					exclude: ['normalize'],					
					done: function (done, output) {
						console.log('done requirejs for mcq module');
						done();
					}
                }
            },
            mcqsc: {
                options: {
                    baseUrl: engine_src + "mcq/js",
					name: "mcqsc",
					out: dist + "js/mcqsc.js",
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
						console.log('done requirejs for mcq module');
						done();
					}
                }
            },
            // Compilation of all mcqmc engine dependencies to mcqmc.js
            mcqmcMinified: {
                options: {
                    baseUrl: engine_src + "mcqmc/js",
					name: "mcqmc-min-<%= pkg.version %>",
					out: dist + "js/mcqmc-min-<%= pkg.version %>.js",
					paths: {
                        'text': vendors + 'text/text',
						'css': vendors + 'require-css/css',
						'css-builder': vendors + 'require-css/css-builder',
						'normalize': vendors + 'require-css/normalize'
                    },
					optimize: "uglify2",
					exclude: ['normalize'],					
					done: function (done, output) {
						console.log('done requirejs for mcq module');
						done();
					}
                }
            },
            mcqmc: {
                options: {
                    baseUrl: engine_src + "mcqmc/js",
					name: "mcqmc",
					out: dist + "js/mcqmc.js",
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
						console.log('done requirejs for mcq module');
						done();
					}
                }
            },
            // Compilation of all dnd engine dependencies to dnd.js
            dndMinified: {
                options: {
                    baseUrl: engine_src + "dnd/js",
                    name: "dnd-min-<%= pkg.version %>",
                    out: dist + "js/dnd-min-<%= pkg.version %>.js",
                    paths: {
                        'text': vendors + 'text/text',
                        'css': vendors + 'require-css/css',
                        'css-builder': vendors + 'require-css/css-builder',
                        'normalize': vendors + 'require-css/normalize'
                    },
                    optimize: 'uglify2',
                    exclude: ['normalize'],					
                    done: function (done, output) {
                        console.log('done requirejs for dnd module');
                        done();
                    }
                }
            },
            dnd: {
                options: {
                    baseUrl: engine_src + "dnd/js",
                    name: "dnd",
                    out: dist + "js/dnd.js",
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
                        console.log('done requirejs for dnd module');
                        done();
                    }
                }
            },
            // Compilation of all oe engine dependencies to oe.js
            oeMinified: {
                options: {
                    baseUrl: engine_src + "oe/js",
                    name: "oe-min-<%= pkg.version %>",
                    out: dist + "js/oe-min-<%= pkg.version %>.js",
                    paths: {
                        'text': vendors + 'text/text',
                        'css': vendors + 'require-css/css',
                        'css-builder': vendors + 'require-css/css-builder',
                        'normalize': vendors + 'require-css/normalize'
                    },
                    optimize: 'uglify2',
                    exclude: ['normalize'],                 
                    done: function (done, output) {
                        console.log('done requirejs for oe module');
                        done();
                    }
                }
            },
            oe: {
                options: {
                    baseUrl: engine_src + "oe/js",
                    name: "oe",
                    out: dist + "js/oe.js",
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
                        console.log('done requirejs for oe module');
                        done();
                    }
                }
            },
			// Compilation of all placementtest engine dependencies to placementtest.js
			placementtestMinified: {
                options: {
                    baseUrl: engine_src + "multi-item/js",
					name: "placementtest-min-<%= pkg.version %>",
					out: dist + "js/placementtest-min-<%= pkg.version %>.js",
					paths: {
						'css': vendors + 'require-css/css',
						'css-builder': vendors + 'require-css/css-builder',
						'normalize': vendors + 'require-css/normalize'
                    },
					optimize: "uglify2",
					exclude: ['normalize'],					
					done: function (done, output) {
						console.log('done requirejs for multi-item module');
						done();
					}
                }
            },
            placementtest: {
                options: {
                    baseUrl: engine_src + "multi-item/js",
					name: "placementtest",
					out: dist + "js/placementtest.js",
					paths: {
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
						console.log('done requirejs for multi-item module');
						done();
					}
                }
            }
        },
		// Minify all the js files present inside "dist/js"
		uglify: {
            libjs: {
                files: {
                    'dist/js/require.min.js': [requireLib + 'require.js'],                    
                    'dist/js/adaptor.min.js': ['dist/js/adaptor.js'],
                    'dist/js/vendor-min-<%= pkg.version %>.js': ['dist/js/vendor.js'],
                    'dist/js/shell-min-<%= pkg.version %>.js': ['dist/js/shell.js']
                }
            }
        },
        // Include external file
        includereplace: {
            your_target: {
                // Files to perform replacements and includes with 
                src:  engine_src + 'mcq/test/index-prod-template.js',
                // Destination directory to copy files to 
                dest: engine_src + 'mcq/test/index-prod.js'
            }
        },  
        htmlcompressor: {
            compile: {
              files: {
                'src/adaptor/test/activityLauncher.html': 'src/adaptor/test/activityLauncher-template.html'
              },
              options: {
                type: 'html',
                preserveServerScript: true
              }
            }
          },
        // text replace
        replace: {
          version: {
            src: [engine_src + 'mcq/test/index-prod.js'],
            overwrite : true,
            replacements: [
                {
                    from: "vendor-min-",                   
                    to: "vendor-min-<%= pkg.version %>"
                },
                {
                    from: "shell-min-",                   
                    to: "shell-min-<%= pkg.version %>"
                },
                {
                    from: "mcqsc-min-",                   
                    to: "mcqsc-min-<%= pkg.version %>"
                },
                {
                    from: "libs-frontend-core-min-",                   
                    to: "libs-frontend-core-min-<%= pkg.libsFrontendCore %>"
                }
            ]
          }
        }, 
		// Connect on port 9001
        connect: {
            dev: {
                options: {
                    port: 9001,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    base: '..'
                }
            }
        }

	});
	
	//Load grunt Tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less'); 
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-htmlcompressor');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-connect');
	
	// Default task
	grunt.registerTask('default', [ 
        'clean:dist',
		'less',
        'copy',
        'concat',
        'cssmin',
		'uglify',
        'requirejs',
        'clean:engines',
        'htmlcompressor',
        'includereplace',
        'replace'
    ]);  

	grunt.registerTask('connectServer', [ 
		'connect'
    ]);
};
