module.exports = function (grunt) {
  grunt.task.loadTasks('config/js/tasks');

  grunt.config.merge({
    update: {
      libs: [
        'di18n',
        'spa',
        'rdfjson',
        'rdforms',
        'store',
        'entryscape-commons',
        'entryscape-admin',
      ],
    },
  });

  grunt.loadNpmTasks('grunt-available-tasks');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
};
