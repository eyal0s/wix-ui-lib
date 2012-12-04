(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'SimpleColorPicker';

    var defaults = {
        initColor : '#267B84',
        colorUnit : "color-unit",
        colorUnitInner : "color-unit-inner",
        active : 'active',
        colors : [
            '#CECECE', '#9C9C9C', '#6C6C6C', '#484848', '#242424', '#C4EEF6', '#A5E1ED',
            '#59CEE5', '#3B8999', '#1D444C', '#FFFDFD', '#999999', '#666666', '#444444', '#000000', '#E4A3B8',
            '#CA748F', '#AF1A49', '#751131', '#3A0818', '#D5E7A6', '#B8CF78', '#8EB71D', '#5E7A13', '#2F3D09'
        ],
        fixedColors: [
            '#ED1C24', '#FFCB05', '#727272', '#727272', '#B0B0B0'
        ]
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$el = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = $.extend({}, Plugin.prototype, {

        init: function () {
            this.bindEvents();

            if (this.options.layout === "horizontal") {
                this.arrangeHorizontal(this.options);
            } else {
                this.arrangeVertical(this.options);
            }
        },

        arrangeVertical: function(data) {
            var linesInCol = this.options.colors.length / data.width;

            this.options.colors.reverse();

            for (var i = 0; i < linesInCol; ++i) {
                var currentRow = this.newRow();
                for (var j = 0; j < data.width; ++j) {
                    currentRow.append(this.createColor(this.options.colors[(j*data.width)+i]));
                }
            }
        },

        arrangeHorizontal: function(data) {
            var opt = this.options;
            var currentRow = this.newRow();

            for (var i = 0; i < opt.colors.length; ++i) {
                currentRow.append(this.createColor(opt.colors[i]));
                if (((i+1) % data.width) === 0) {
                    currentRow = this.newRow();
                }
            }
        },

        newRow: function() {
            return $('<div>', {
                class: "palette-row"
            }).appendTo(this.$el);
        },

        createColor: function (colorHex) {
            var opt = this.options;

            var colorWrapper = $('<div>', {
                class: opt.colorUnit,
                hvalue: colorHex
            });

            var colorInner = $('<div>', {
                class: opt.colorUnitInner
            }).css('background-color', colorHex).appendTo(colorWrapper);

            var colorIcon = $('<div>', {
                class: 'color-icon'
            }).appendTo(colorWrapper);

            if (colorInner.css('background-color') === opt.initColor) {
                colorWrapper.addClass(opt.active);
            }

            return colorWrapper;
        },

        bindEvents: function () {
            var opt = this.options;

            this.$el.on('click', '.' + opt.colorUnit, function (e) {
                var $this = $(this);
                $('#'+opt.wrapperId).find('.active').removeClass(opt.active);
                $this.addClass(opt.active);
                $(document).trigger('colorChanged', $this.attr('hvalue'));

                return false;
            });
        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);