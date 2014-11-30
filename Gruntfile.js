'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        push: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json']
      }
    },
    less: {
      options: {
        compress: true
      },
      styles: {
        files: {
          'dist/ez-dropdown.min.css': ['src/*.less']
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        files: {
          src: ['src/**/*.js', 'test/**/*.js']
        },
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/ez-dropdown.min.js': ['src/ez-dropdown.js'],
        }
      }
    },
    watch: {
      dev: {
        files: ['src/**/*'],
        tasks: ['default']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint', 'uglify', 'less']);

};
