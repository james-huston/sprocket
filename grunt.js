module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: "<config:lint.files>",
      tasks: "lint:files simplemocha:all"
    },
    simplemocha: {
      all: {
        src: [ "test/unit/*.test.js" ],
        options: {
          timeout: 2000,
          ignoreLeaks: false,
          ui: "bdd",
          reporter: "spec",
          growl: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask("test", "simplemocha:all");
  grunt.registerTask('default', 'lint simplemocha:all');
};

