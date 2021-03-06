module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: ['build/']
            },
            chrome_ext_build: {
                src: ['chrome_ext_build']
            }
        },

        browserify: {
            options: {
                transform: [
                    ["babelify", {
                        presets: ["react", "es2015"]
                    }]
                ]
            },
            dev: {
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    'www/app.js': ['src/app.jsx']
                }
            },
            app: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                files: {
                    'www/app.js': ['src/app.jsx']
                }
            },
            prod: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                files: {
                    'build/app.js': ['src/app.jsx']
                }
            },
            chrome_ext_build: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                files: {
                    'chrome_ext_build/app.js': ['src/app.jsx']
                }

            }
        },

        uglify: {
            app: {
                files: {
                    'www/app.js': 'www/app.js'
                }
            },
            prod: {
                files: {
                    'build/app.js': 'build/app.js'
                }
            },
            chrome_ext_build: {
                files: {
                    'chrome_ext_build/app.js': 'chrome_ext_build/app.js'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'www/',
                    src: ['manifest.appcache','styles/**','resources/**'],
                    dest: 'build/'
                }]
            },
            chrome_ext_build: {
                files: [{
                    expand: true,
                    cwd: 'www/',
                    src: ['styles/**','resources/**'],
                    dest: 'chrome_ext_build/'
                }, {
                    expand: true,
                    cwd: 'chrome_ext/',
                    src: ['./**'],
                    dest: 'chrome_ext_build/'
                }]
            }
        },
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            build: {
                NODE_ENV: 'production'
            }
        },

        processhtml: {
            options: {strip: true},
            dev: {
                files: {
                    'www/index.html': ['index.tpl.html']
                }
            },
            web: {
                files: {
                    'build/index.html': ['index.tpl.html']
                }
            },
            chrome_ext_build: {
                files: {
                    'chrome_ext_build/index.html': ['index.tpl.html']
                }
            },
            app: {
                files: {
                    'www/index.html': ['index.tpl.html']
                }
            }
        }

    });

    // Default task(s).
    grunt.registerTask('default', ['env:dev','processhtml:dev','browserify:dev']);
    grunt.registerTask('build:app', ['env:build','processhtml:app','browserify:app','uglify:app']);
    grunt.registerTask('build:web', ['clean:build','env:build','browserify:prod','copy:build','uglify:prod','processhtml:web']);
    grunt.registerTask('build:chrome-ext', ['clean:chrome_ext_build','env:build','browserify:chrome_ext_build','copy:chrome_ext_build','uglify:chrome_ext_build','processhtml:chrome_ext_build']);

};

