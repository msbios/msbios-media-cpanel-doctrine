/**
 * @access public
 * @author Judzhin Miles <info[woof-woof]msbios.com>
 */
(function ($) {

    /**
     *
     * @constructor
     */
    var MSBiosMediaCPanel = function () {
    };

    /**
     *
     * @param options
     * @constructor
     */
    var MSBiosMediaNewsImage = function (options) {
        this._options = $.extend({}, this.DEFAULTS, options);
        this._wrap = $(this._options.wrap);
        this._index = $(this._options.item, this._wrap).length;

        this._handler = document.createElement('input');
        this._handler.type = 'file';
        this._handler = $(this._handler);

        this._initComponent();
    };

    /**
     *
     * @type {{DEFAULTS: {wrap: string, template: string, item: string, add: string, addTrigger: string, changeTrigger: string, removeTrigger: string, url: string}, _initComponent: _initComponent, _addTrigger: _addTrigger, _changeTrigger: _changeTrigger, _removeTrigger: _removeTrigger, _loadImage: _loadImage, _applyData: _applyData}}
     */
    MSBiosMediaNewsImage.prototype = {
        DEFAULTS: {
            wrap: '#ms-media-news-image',
            template: '#ms-media-news-image-tmpl',
            item: '.ms-image-item',
            add: '.ms-image-item-add',
            addTrigger: '.ms-add',
            changeTrigger: '.ms-change',
            removeTrigger: '.ms-remove',
            url: ''
        },

        /**
         *
         * @private
         */
        _initComponent: function () {
            $(this._options.addTrigger, this._wrap).on('click', $.proxy(this._addTrigger, this));
            $(this._options.changeTrigger, this._wrap).on('click', $.proxy(this._changeTrigger, this));
            $(this._options.removeTrigger, this._wrap).on('click', $.proxy(this._removeTrigger, this));
            this._handler.on('change', $.proxy(this._loadImage, this));
        },

        /**
         *
         * @param event
         * @private
         */
        _addTrigger: function (event) {
            event.preventDefault();
            /**
             *
             * @param data
             */
            this.success = $.proxy(function (data) {
                if (!data.error) {

                    var tmpl = $(this._options.template).html(),
                        index = $(this._options.item, this._wrap).length;

                    tmpl = $(tmpl.replace(/__INDEX__/g, index));
                    tmpl.delegate(this._options.changeTrigger, 'click', $.proxy(this._changeTrigger, this));
                    tmpl.delegate(this._options.removeTrigger, 'click', $.proxy(this._removeTrigger, this));
                    this._applyData(tmpl, index, data);
                    tmpl.insertBefore($(this._options.add, this._wrap));

                } else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error)
                }
            }, this);
            this._handler.click();
        },

        /**
         *
         * @param event
         * @private
         */
        _changeTrigger: function (event) {
            event.preventDefault();

            var index = $(event.target).attr('data-index');
            this.success = $.proxy(function (data) {
                if (!data.error) {
                    var tmpl = $('div[data-item-index="' + index + '"]');
                    this._applyData(tmpl, index, data)
                }
            }, this);
            this._handler.click();
        },

        /**
         *
         * @param event
         * @private
         */
        _removeTrigger: function (event) {
            event.preventDefault();
            var index = $(event.target).attr('data-index');
            $('div[data-item-index="' + index + '"]', this._wrap).remove();
        },

        /**
         *
         * @param event
         * @private
         */
        _loadImage: function (event) {

            var preloader = this._wrap.block({
                message: '<i class="icon-spinner spinner"></i>',
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'wait'
                },
                css: {
                    border: 0,
                    padding: 0,
                    backgroundColor: 'none'
                }
            });

            var data = new FormData();

            data.append('attachment', event.target.files[0]);

            $.ajax({
                url: this._options.url,
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: this.success,
                error: function (jqXHR, textStatus) {
                }
            }).done(function () {
                preloader.unblock() // stop preloader
            })
        },
        /**
         *
         * @param tmpl
         * @param index
         * @param data
         * @private
         */
        _applyData: function (tmpl, index, data) {
            $('img', tmpl).attr('src', data.thumb.tmp_name);
            $('input[name="options[images][' + index + '][name]"]', tmpl).val(data.name);
            $('input[name="options[images][' + index + '][type]"]', tmpl).val(data.type);
            $('input[name="options[images][' + index + '][width]"]', tmpl).val(data.width);
            $('input[name="options[images][' + index + '][height]"]', tmpl).val(data.height);
            $('input[name="options[images][' + index + '][src]"]', tmpl).val(data.tmp_name);
            $('input[name="options[images][' + index + '][size]"]', tmpl).val(data.size);
            $('input[name="options[images][' + index + '][error]"]', tmpl).val(data.error);
            $('input[name="options[images][' + index + '][thumb][width]"]', tmpl).val(data.thumb.width);
            $('input[name="options[images][' + index + '][thumb][height]"]', tmpl).val(data.thumb.height);
            $('input[name="options[images][' + index + '][thumb][src]"]', tmpl).val(data.thumb.tmp_name);
        }
    };

    // /**
    //  *
    //  * @param options
    //  * @constructor
    //  */
    // var ContactFieldset = function (options) {
    //     this._options = $.extend({}, this.DEFAULTS, options)
    //     this._wrap = $(this._options.wrap)
    //     this._container = $(this._options.container)
    //     this._index = $('.op-contact-item', this._container).length
    //     this._initComponent()
    // }
    //
    // ContactFieldset.prototype = {
    //     DEFAULTS: {
    //         wrap: '#op-contact',
    //         template: '#op-contact-tmpl',
    //         container: '.op-contact-container',
    //         addTrigger: '.op-contact-add',
    //         removeTrigger: '.op-contact-remove'
    //     },
    //
    //     /**
    //      *
    //      * @private
    //      */
    //     _initComponent: function () {
    //         $(this._options.addTrigger, this._wrap).on('click', $.proxy(this._addContact, this))
    //         $(this._options.removeTrigger, this._container).on('click', $.proxy(this._removeContact, this))
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _addContact: function (event) {
    //         var tmpl = $(this._options.template).html()
    //         tmpl = $(tmpl.replace(/__INDEX__/g, this._index++))
    //         tmpl.delegate(this._options.removeTrigger, 'click', $.proxy(this._removeContact, this))
    //         this._container.append(tmpl)
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _removeContact: function (event) {
    //         var index = $(event.target).attr('data-index')
    //         $('div[data-item-index="' + index + '"]', this._container).remove()
    //     }
    // }
    //
    // /**
    //  *
    //  * @param options
    //  * @constructor
    //  */
    // var NetworkFieldset = function (options) {
    //     this._options = $.extend({}, this.DEFAULTS, options)
    //     this._wrap = $(this._options.wrap)
    //     this._container = $(this._options.container)
    //     this._index = $('.op-network-item', this._container).length
    //     this._initComponent()
    // }
    //
    // /**
    //  *
    //  * @type {{}}
    //  */
    // NetworkFieldset.prototype = {
    //     DEFAULTS: {
    //         wrap: '#op-network',
    //         template: '#op-network-tmpl',
    //         container: '.op-network-container',
    //         addTrigger: '.op-network-add',
    //         removeTrigger: '.op-network-remove'
    //     },
    //     /**
    //      *
    //      * @private
    //      */
    //     _initComponent: function () {
    //         $(this._options.addTrigger, this._wrap).on('click', $.proxy(this._addNetwork, this))
    //         $(this._options.removeTrigger, this._container).on('click', $.proxy(this._removeNetwork, this))
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _addNetwork: function (event) {
    //         var tmpl = $(this._options.template).html()
    //         tmpl = $(tmpl.replace(/__INDEX__/g, ++this._index))
    //         tmpl.delegate(this._options.removeTrigger, 'click', $.proxy(this._removeNetwork, this))
    //         $('.styled', tmpl).uniform({radioClass: 'choice'})
    //         this._container.append(tmpl)
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _removeNetwork: function (event) {
    //         var index = $(event.target).attr('data-index')
    //         $('div[data-item-index="' + index + '"]', this._container).remove()
    //     }
    // }
    //
    // /**
    //  *
    //  * @param options
    //  * @constructor
    //  */
    // var PersonUserpic = function (options) {
    //     this._options = $.extend({}, this.DEFAULTS, options)
    //     this._wrap = $(this._options.wrap)
    //     this._container = $(this._options.container, this._wrap)
    //
    //     this._handler = document.createElement('input')
    //     this._handler.type = 'file'
    //     this._handler = $(this._handler)
    //     this._initComponent()
    // }
    //
    // PersonUserpic.prototype = {
    //     DEFAULTS: {
    //         wrap: '#op-person-userpic',
    //         template: '#op-person-userpic-tmpl',
    //         container: '.op-person-userpic-container',
    //         addTrigger: '.op-userpic-add',
    //         changeTrigger: '.op-userpic-change',
    //         removeTrigger: '.op-userpic-remove'
    //     },
    //
    //     /**
    //      *
    //      * @private
    //      */
    //     _initComponent: function () {
    //         this._handler.on('change', $.proxy(this._loadImage, this))
    //         $(this._options.addTrigger, this._wrap).on('click', $.proxy(this._addImage, this))
    //         $(this._options.changeTrigger, this._container).on('click', $.proxy(this._changeImage, this))
    //         $(this._options.removeTrigger, this._container).on('click', $.proxy(this._removeImage, this))
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _addImage: function (event) {
    //         event.preventDefault()
    //
    //         /**
    //          *
    //          * @param data
    //          */
    //         this.success = $.proxy(function (data) {
    //             if (typeof data.error === 'undefined') {
    //
    //                 var tmpl = $(this._options.template).html(),
    //                     index = $('.op-userpic-item', this._container).length
    //
    //                 tmpl = $(tmpl.replace(/__INDEX__/g, index))
    //                 tmpl.delegate(this._options.changeTrigger, 'click', $.proxy(this._changeImage, this))
    //                 tmpl.delegate(this._options.removeTrigger, 'click', $.proxy(this._removeImage, this))
    //                 $('.styled', tmpl).uniform({radioClass: 'choice'})
    //                 this._applyData(tmpl, index, data)
    //                 this._container.append(tmpl)
    //             } else {
    //                 // Handle errors here
    //                 console.log('ERRORS: ' + data.error)
    //             }
    //         }, this)
    //         this._handler.click()
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _changeImage: function (event) {
    //         event.preventDefault()
    //         var index = $(event.target).attr('data-index')
    //         this.success = $.proxy(function (data) {
    //             if (typeof data.error === 'undefined') {
    //                 var tmpl = $('div[data-item-index="' + index + '"]')
    //                 this._applyData(tmpl, index, data)
    //             }
    //         }, this)
    //         this._handler.click()
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _removeImage: function (event) {
    //         event.preventDefault()
    //         var index = $(event.target).attr('data-index')
    //         $('div[data-item-index="' + index + '"]', this._container).remove()
    //     },
    //
    //     /**
    //      *
    //      * @private
    //      */
    //     _loadImage: function (event) {
    //
    //         var preloader = this._wrap.block({
    //             message: '<i class="icon-spinner spinner"></i>',
    //             overlayCSS: {
    //                 backgroundColor: '#fff',
    //                 opacity: 0.8,
    //                 cursor: 'wait'
    //             },
    //             css: {
    //                 border: 0,
    //                 padding: 0,
    //                 backgroundColor: 'none'
    //             }
    //         })
    //
    //         var data = new FormData()
    //
    //         data.append('attachment', event.target.files[0])
    //
    //         $.ajax({
    //             url: this._options.url,
    //             type: 'POST',
    //             data: data,
    //             cache: false,
    //             dataType: 'json',
    //             processData: false, // Don't process the files
    //             contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //             success: this.success,
    //             error: function (jqXHR, textStatus) {
    //             }
    //         }).done(function () {
    //             preloader.unblock() // stop preloader
    //         })
    //     },
    //
    //     /**
    //      *
    //      * @param tmpl
    //      * @param index
    //      * @param data
    //      * @private
    //      */
    //     _applyData: function (tmpl, index, data) {
    //         $('.thumb > img', tmpl).attr('src', data.src)
    //         $('input[name="userpics[' + index + '][src]"]', tmpl).val(data.src)
    //         $('input[name="userpics[' + index + '][width]"]', tmpl).val(data.width)
    //         $('input[name="userpics[' + index + '][height]"]', tmpl).val(data.height)
    //         $('input[name="userpics[' + index + '][small][src]"]', tmpl).val(data.thumb.src)
    //         $('input[name="userpics[' + index + '][small][width]"]', tmpl).val(data.thumb.width)
    //         $('input[name="userpics[' + index + '][small][height]"]', tmpl).val(data.thumb.height)
    //     }
    // }
    //
    // /**
    //  *
    //  * @param options
    //  * @constructor
    //  */
    // var Attachment = function (options) {
    //     this._options = $.extend({}, this.DEFAULTS, options)
    //     this._container = $(this._options.container)
    //
    //     this._handler = document.createElement('input')
    //     this._handler.type = 'file'
    //     this._handler = $(this._handler)
    //     this._initComponent()
    // }
    //
    // Attachment.prototype = {
    //     DEFAULTS: {
    //         container: '.op-attachment-item',
    //         changeTrigger: '.op-attachment-change',
    //         fields: {
    //             name: 'input[name$="[attachment][name]"]',
    //             type: 'input[name$="[attachment][type]"]',
    //             tmpName: 'input[name$="[attachment][tmp_name]"]',
    //             error: 'input[name$="[attachment][error]"]',
    //             size: 'input[name$="[attachment][size]"]'
    //         },
    //         success: function (data) {
    //
    //         },
    //         error: function (jqXHR, textStatus) {
    //
    //         }
    //     },
    //
    //     _initComponent: function () {
    //         this._handler.on('change', $.proxy(this._loadAttachment, this))
    //         $(this._options.changeTrigger, this._container).on('click', $.proxy(this._changeAttachmen, this))
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _changeAttachmen: function (event) {
    //         event.preventDefault()
    //         this._handler.click()
    //     },
    //
    //     /**
    //      *
    //      * @private
    //      */
    //     _loadAttachment: function (event) {
    //
    //         var preloader = this._container.block({
    //             message: '<i class="icon-spinner spinner"></i>',
    //             overlayCSS: {
    //                 backgroundColor: '#fff',
    //                 opacity: 0.8,
    //                 cursor: 'wait'
    //             },
    //             css: {
    //                 border: 0,
    //                 padding: 0,
    //                 backgroundColor: 'none'
    //             }
    //         })
    //
    //         var data = new FormData()
    //
    //         data.append('attachment', event.target.files[0])
    //
    //         $.ajax({
    //             url: this._options.url,
    //             type: 'POST',
    //             data: data,
    //             cache: false,
    //             dataType: 'json',
    //             processData: false, // Don't process the files
    //             contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //             success: $.proxy(function (data) {
    //                 this._applyData(data)
    //                 this._options.success.call(this, data)
    //             }, this),
    //             error: function (jqXHR, textStatus) {
    //                 this._options.error.call(this, jqXHR, textStatus)
    //             }
    //         }).done(function () {
    //             preloader.unblock() // stop preloader
    //         })
    //     },
    //     /**
    //      *
    //      * @param data
    //      * @private
    //      */
    //     _applyData: function (data) {
    //         $(this._options.fields.name, this._container).val(data.name)
    //         $(this._options.fields.type, this._container).val(data.type)
    //         $(this._options.fields.tmpName, this._container).val(data.tmp_name)
    //         $(this._options.fields.error, this._container).val(data.error)
    //         $(this._options.fields.size, this._container).val(data.size)
    //     }
    // }
    //
    // /**
    //  *
    //  * @param options
    //  * @constructor
    //  */
    // var Attachments = function (options) {
    //     this._options = $.extend({}, this.DEFAULTS, options)
    //     this._wrap = $(this._options.wrap)
    //     this._container = $(this._options.container, this._wrap)
    //     this._index = $('.op-attachment-item', this._container).length
    //
    //     this._handler = document.createElement('input')
    //     this._handler.type = 'file'
    //     this._handler = $(this._handler)
    //     this._initComponent()
    // }
    //
    // Attachments.prototype = {
    //     DEFAULTS: {
    //         wrap: '#op-attachments',
    //         template: '#op-attachment-tmpl',
    //         container: '.op-attachments-container',
    //         addTrigger: '.op-attachment-add',
    //         changeTrigger: '.op-attachment-change',
    //         removeTrigger: '.op-attachment-remove'
    //     },
    //
    //     _initComponent: function () {
    //         this._handler.on('change', $.proxy(this._loadAttachmen, this))
    //         $(this._options.addTrigger, this._wrap).on('click', $.proxy(this._addAttachment, this))
    //         $(this._options.changeTrigger, this._container).on('click', $.proxy(this._changeAttachment, this))
    //         $(this._options.removeTrigger, this._container).on('click', $.proxy(this._removeAttachment, this))
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      */
    //     _addAttachment: function (event) {
    //         var tmpl = $(this._options.template).html()
    //         tmpl = $(tmpl.replace(/__INDEX__/g, ++this._index))
    //         tmpl.delegate(this._options.changeTrigger, 'click', $.proxy(this._changeAttachment, this))
    //         tmpl.delegate(this._options.removeTrigger, 'click', $.proxy(this._removeAttachment, this))
    //         this._container.append(tmpl)
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _changeAttachment: function (event) {
    //         event.preventDefault()
    //         this.currentIndex = $(event.target).attr('data-index')
    //         this._handler.click()
    //     },
    //
    //     /**
    //      *
    //      * @param event
    //      * @private
    //      */
    //     _removeAttachment: function (event) {
    //         event.preventDefault()
    //         var index = $(event.target).attr('data-index')
    //         $('div[data-item-index="' + index + '"]', this._container).remove()
    //     },
    //
    //     /**
    //      *
    //      * @private
    //      */
    //     _loadAttachmen: function (event) {
    //
    //         var preloader = this._wrap.block({
    //             message: '<i class="icon-spinner spinner"></i>',
    //             overlayCSS: {
    //                 backgroundColor: '#fff',
    //                 opacity: 0.8,
    //                 cursor: 'wait'
    //             },
    //             css: {
    //                 border: 0,
    //                 padding: 0,
    //                 backgroundColor: 'none'
    //             }
    //         })
    //
    //         var data = new FormData()
    //
    //         data.append('attachment', event.target.files[0])
    //
    //         var index = this.currentIndex
    //
    //         $.ajax({
    //             url: this._options.url,
    //             type: 'POST',
    //             data: data,
    //             cache: false,
    //             dataType: 'json',
    //             processData: false, // Don't process the files
    //             contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    //             success: $.proxy(function (data) {
    //
    //                 var tmpl = $('div[data-item-index="' + index + '"]')
    //
    //                 $('input[name$="[attachment][name]"]', tmpl).val(data.name)
    //                 $('input[name$="[attachment][type]"]', tmpl).val(data.type)
    //                 $('input[name$="[attachment][tmp_name]"]', tmpl).val(data.tmp_name)
    //                 $('input[name$="[attachment][error]"]', tmpl).val(data.error)
    //                 $('input[name$="[attachment][size]"]', tmpl).val(data.size)
    //             }, this),
    //             error: function (jqXHR, textStatus) {
    //             }
    //         }).done(function () {
    //             preloader.unblock() // stop preloader
    //         })
    //     }
    // }

    MSBiosMediaCPanel.prototype = {

        DEFAULTS: {},

        /**
         *
         * @param options
         */
        initNewsForm: function (options) {
            new MSBiosMediaNewsImage(options.image);
        },

        // /**
        //  *
        //  * @param options
        //  */
        // initPersonForm: function (options) {
        //     this.initNetwork(options.network)
        //     this.initContact(options.contact)
        //     this.initPersonUserpic(options.userpic)
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initInstitutionForm: function (options) {
        //     this.initNetwork(options.network)
        //     this.initContact(options.contact)
        //     this.initAttachment(options.attachment)
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initContact: function (options) {
        //     var contact = new ContactFieldset()
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initAttachments: function (options) {
        //     var attach = new Attachments(options)
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initAttachment: function (options) {
        //     var attach = new Attachment(options)
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initNetwork: function (options) {
        //     var network = new NetworkFieldset()
        // },
        //
        // /**
        //  *
        //  * @param options
        //  */
        // initPersonUserpic: function (options) {
        //     var userpic = new PersonUserpic(options)
        // }
    };

    var MSBiosMediaCPanel = new MSBiosMediaCPanel();
    if (!('MSBiosMediaCPanel' in this)) this['MSBiosMediaCPanel'] = MSBiosMediaCPanel

}).call(this, jQuery);
