module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
              separator: ',\n',
              banner: '[\n',
              footer: '\n]'
            },
            dist: {
              /*src: ['public/stories/js/app/json/companies/*.json'],
               DAY 3 */
               src: ['public/stories/js/app/json/companies/usopen.json','public/stories/js/app/json/companies/nationwide.json','public/stories/js/app/json/companies/mdandersen.json','public/stories/js/app/json/companies/kuma.json','public/stories/js/app/json/companies/ptech.json','public/stories/js/app/json/companies/macys.json','public/stories/js/app/json/companies/millesima.json','public/stories/js/app/json/companies/blizzardskis.json','public/stories/js/app/json/companies/warantahsrugby.json','public/stories/js/app/json/companies/wimbeldon.json','public/stories/js/app/json/companies/trugolf.json','public/stories/js/app/json/companies/audiomonitor.json','public/stories/js/app/json/companies/gwinnettcounty.json','public/stories/js/app/json/companies/msk.json','public/stories/js/app/json/companies/parmigiano-reggiano.json','public/stories/js/app/json/companies/bharat.json','public/stories/js/app/json/companies/hotelscombined.json','public/stories/js/app/json/companies/kyocera.json','public/stories/js/app/json/companies/miamidadecounty.json','public/stories/js/app/json/companies/nygenome.json','public/stories/js/app/json/companies/greenemotion.json','public/stories/js/app/json/companies/bceggmarketing.json','public/stories/js/app/json/companies/sunlifestadium.json','public/stories/js/app/json/companies/banorte.json','public/stories/js/app/json/companies/lindtchocolates.json','public/stories/js/app/json/companies/princesscruises.json','public/stories/js/app/json/companies/astron.json','public/stories/js/app/json/companies/pointdefiancezoo.json','public/stories/js/app/json/companies/musicmastermind.json','public/stories/js/app/json/companies/skyitalia.json','public/stories/js/app/json/companies/foodtruck.json','public/stories/js/app/json/companies/leyou.json','public/stories/js/app/json/companies/ningbo.json','public/stories/js/app/json/companies/datasymphony.json','public/stories/js/app/json/companies/toshiba.json'],




             /* DAY 5 */

              dest: 'public/stories/js/app/json/stories.json'
            }
        },
        requirejs: {
            mobileJS: {
                options: {
                    baseUrl: "public/stories/js/app",
                    wrap: true,
                    // Don't use almond if your project needs to load modules dynamically
                    name: "../libs/almond",
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    optimizeCss: "standard",
                    mainConfigFile: "public/stories/js/app/config/config.js",
                    include: ["init/MobileInit"],
                    out: "public/stories/js/app/init/MobileInit.min.js",

                    /*********
                     * https://github.com/SlexAxton/require-handlebars-plugin
                     */
                    pragmasOnSave: {
                        //removes Handlebars.Parser code (used to compile template strings) set
                        //it to `false` if you need to parse template strings even after build
                        excludeHbsParser : true,
                        // kills the entire plugin set once it's built.
                        excludeHbs: true,
                        // removes i18n precompiler, handlebars and json2
                        excludeAfterBuild: true
                    },

                    locale: "en_us",

                    // options object which is passed to Handlebars compiler
                    hbs : {
                        templateExtension: "html",
                        helperDirectory: "templates/helpers/",
                        i18nDirectory: "templates/i18n/",

                        compileOptions: {}
                    }
                }
            },
            mobileCSS: {
                options: {
                    optimizeCss: "standard",
                    cssIn: "./public/stories/css/mobile.css",
                    out: "./public/stories/css/mobile.min.css"
                }
            },
            desktopJS: {
                options: {
                    baseUrl: "public/stories/js/app",
                    wrap: true,
                    // Cannot use almond since it does not currently appear to support requireJS's config-map
                    name: "../libs/almond",
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    mainConfigFile: "public/stories/js/app/config/config.js",
                    include: ["init/DesktopInit"],
                    out: "public/stories/js/app/init/DesktopInit.min.js"
                }
            },
            desktopCSS: {
                options: {
                    optimizeCss: "standard",
                    cssIn: "./public/stories/css/desktop.css",
                    out: "./public/stories/css/desktop.min.css"
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/stories/js/app/**/*.js', '!public/stories/js/app/**/*min.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: false,
                    module: true,
                    document: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('json', ['concat']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('build', ['requirejs:desktopJS', 'requirejs:mobileJS', 'requirejs:desktopCSS', 'requirejs:mobileCSS']);
    grunt.registerTask('default', ['json', 'test', 'build']);
};
