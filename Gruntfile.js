module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/*'],
            release: ['release/*']
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'angular-app/dist', src: '**/*', dest: 'build/public/'},
                    {expand: true, src: 'middlewares/**/*', dest: 'build/'},
                    {expand: true, src: 'routes/**/*', dest: 'build/'},
                    {expand: true, src: '*.js', dest: 'build/'},
                    {expand: true, src: 'package.json', dest: 'build/'},
                    {expand: true, src: '.env', dest: 'build/'}
                ]
            },
            release: {
                files: [
                    {expand: true, cwd: 'angular-app/dist', src: '**/*', dest: 'release/public/'},
                    {expand: true, src: 'middlewares/**/*', dest: 'release/'},
                    {expand: true, src: 'routes/**/*', dest: 'release/'},
                    {expand: true, src: '*.js', dest: 'release/'},
                    {expand: true, src: 'package.json', dest: 'release/'},
                    {expand: true, src: '.env', dest: 'release/'}
                ]
            }
        },
        jshint: {
            options: {
                node: true
            },
            all: ['Gruntfile.js', 'app.js', 'middlewares/**/*.js', 'routes/**/*.js']
        },
        exec: {
            install_npm_main: 'npm install',
            install_npm_angular: 'cd angular-app && npm install && cd ..',
            ng_build: 'cd angular-app && ng build && cd ..',
            run_express: 'node app.js',
            install_npm_build: 'cd build && npm install && cd public && npm install && cd ../..',
            install_npm_release: 'cd release && npm install && cd public && npm install && cd ../..'
        },
        // NOT USED YET
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'build/js',
                    src: '**/*.js',
                    dest: 'build/js'
                }]
            },
            release: {
                files: [{
                    expand: true,
                    cwd: 'release/js',
                    src: '**/*.js',
                    dest: 'release/js'
                }]
            }
        },
        // NOT USED YET
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            },
            release: {
                files: [{
                    expand: true,
                    cwd: 'release/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'release/css',
                    ext: '.min.css'
                }]
            }
        },
        // NOT USED YET
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['src/**/*.html', '*.html'],
                    dest: 'build'
                }]
            },
            dev: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'release',
                    src: ['src/**/*.html', '*.html'],
                    dest: 'release'
                }]
            }
        },
        // NOT USED YET
        imagemin: {
            // static: {
            //     options: {
            //         optimizationLevel: 3,
            //         svgoPlugins: [{removeViewBox: false}],
            //         use: [mozjpeg()] // Example plugin usage
            //     },
            //     files: {
            //         'dist/img.png': 'src/img.png',
            //         'dist/img.jpg': 'src/img.jpg',
            //         'dist/img.gif': 'src/img.gif'
            //     }
            // },
            // dynamic: {
            //     files: [{
            //         expand: true,
            //         cwd: 'src/',
            //         src: ['**/*.{png,jpg,gif}'],
            //         dest: 'dist/'
            //     }]
            // }
        },
        // NOT USED YET
        nodeunit: {
            all: ['test/*_test.js']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false,
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['test/**/*.js']
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Task(s).
    grunt.registerTask('install_deps', ['exec:install_npm_main', 'exec:install_npm_angular']);
    grunt.registerTask('jshint_and_angular_build', ['jshint', 'exec:ng_build']);

    grunt.registerTask('build', ['jshint_and_angular_build', 'mochaTest', 'copy:build', 'exec:install_npm_build']);
    grunt.registerTask('release', ['jshint_and_angular_build', 'mochaTest', 'copy:release', 'exec:install_npm_release']);
    grunt.registerTask('run', ['build', 'exec:run_express']);
    grunt.registerTask('default', ['install_deps', 'build']);
};