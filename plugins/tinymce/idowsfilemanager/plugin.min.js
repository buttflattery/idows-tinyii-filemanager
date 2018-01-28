/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 */

tinymce.PluginManager.add ( 'idowsfilemanager', function ( editor, url ) {

    function idowsFileManager () {
        editor.windowManager.open ( {
            title : 'IDOWS Tinyii File Manager.',
            icon : 'idows-ico idows-i-folder',
            file : '/filemanager/index?editor=',
            width : 850,
            height : 600,
            buttons : [{
                    text : 'Close',
                    onclick : 'close'
                }]
        } );
    }

    //add button on the editor to open idowsfilemanager
    editor.addButton ( 'idowsfilemanager', {
        icon : 'browse',
        text : 'IDOWS Tinyii FileManager',
        onclick : idowsFileManager,
        tooltip : 'IDOWS Tinyii Filemanager'
    } );
} );