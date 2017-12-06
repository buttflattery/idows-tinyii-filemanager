if ( !RedactorPlugins )
    var RedactorPlugins = { };

RedactorPlugins.idowsfilemanager = {
    options : {
        redactorObj : null
    },
    init : function () {
        this.options.redactorObj = this;
        this.buttonAdd ( 'idowsfilemanager', 'IDOWS File Manager', this.show );
        this.buttonChangeIcon ( 'idowsfilemanager', 'file' );
    },
    show : function () {
        this.modalInit ( 'IDOWS File Manager', '<div class="wrapper" data-href="#."></div>', 860 );
        this.getTemplate ();
    },
    getTemplate : function () {
        let redactormodal = $ ( '#redactor_modal' );
        redactormodal.css ( { 'height' : '600px' } );
        let iframe = document.createElement ( 'iframe' );

        $ ( iframe ).attr ( {
            id : 'file-manager-frame',
            src : '/filemanager/index?editor=_RA',
            frameborder : 0,
            width : redactormodal.width (),
            height : redactormodal.height ()
        } ).appendTo("#redactor_modal_inner>div.wrapper");
    },
    close : function () {
        this.options.redactorObj.modalClose ();
    },
    insertImageTag : function ( url ) {
        let redObj = this.options.redactorObj;
        var data = '<img id="image-marker" src="' + url + '" />';
        if ( redObj.opts.linebreaks === false )
            data = '<p>' + data + '</p>';

        redObj.imageInsert ( data, true );
    },
    insertVideoTag : function ( video ) {
        let redObj = this.options.redactorObj;
        let data = redObj.cleanStripTags ( video );

        redObj.selectionRestore ();

        var current = redObj.getBlock () || redObj.getCurrent ();

        if ( current )
            $ ( current ).after ( data )
        else
            redObj.insertHtmlAdvanced ( data, false );

        redObj.sync ();

        redObj.modalClose ();
    },
    insertAnchorTag : function ( params ) {
        text = params.text.replace ( /<|>/g, '' );
        this.options.redactorObj.linkInsert ( params.anchor, $.trim ( text ), params.url, params.target );
    }
};
