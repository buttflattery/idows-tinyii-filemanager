CKEDITOR.tools.createImageData = function(dimensions) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + dimensions.width + '" height="' + dimensions.height + '"></svg>');
};
CKEDITOR.plugins.add ( 'idowsfilemanager', {
    icons : 'idowsfilemanager',
    init : function ( editor ) {
        var url = CKEDITOR.getUrl ( this.path + 'skin/img/placeholder.png' );
        CKEDITOR.addCss ( 'img.cke-video{background:#f8f8f8 url(' + url + ') center center no-repeat;outline:1px solid #ccc;outline-offset:-1px;min-width:192px;min-height:108px;max-width:100%;width:auto!important;height:auto!important;}' );
        //Plugin logic goes here.
        editor.addCommand ( 'idowsfilemanager', new CKEDITOR.dialogCommand ( 'idowsfilemanagerDialog' ) );

        //create editor toolbar button
        editor.ui.addButton ( 'IdowsFileManager', {
            label : 'IDOWS File Manager',
            command : 'idowsfilemanager',
            toolbar : 'insert'
        } );

        CKEDITOR.dialog.add ( 'idowsfilemanagerDialog', this.path + 'dialogs/idowsfilemanager.js' );
    }
} );