CKEDITOR.plugins.add('idowsfilemanager', {
    icons: 'idowsfilemanager',
    init: function(editor) {
        //Plugin logic goes here.
        editor.addCommand('idowsfilemanager', new CKEDITOR.dialogCommand('idowsfilemanagerDialog'));
        
        //create editor toolbar button
        editor.ui.addButton('IdowsFileManager', {
            label: 'IDOWS File Manager',
            command: 'idowsfilemanager',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add('idowsfilemanagerDialog', this.path + 'dialogs/idowsfilemanager.js');
    }
});