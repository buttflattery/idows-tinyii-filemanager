CKEDITOR.dialog.add('idowsfilemanagerDialog', function(editor) {
    return {
        title: 'Tinyii Filemanager By IDOWS',
        minWidth: 800,
        minHeight: 650,
        buttons: false,
        contents: [{
            id: "File list",
            elements: [{
                type: 'html',
                id: 'file_list_tab',
                html: '<div id="main-container"></div>'
            }]
        }],
        onShow: function() {
            $('<iframe>', {
                id: 'file-manager-frame',
                src: '/filemanager/index?editor=_CK',
                frameborder: 0,
                width: this.definition.dialog.definition.minWidth,
                height: this.definition.dialog.definition.minHeight,
            }).appendTo("#main-container");
        },
        onHide:function(){
            $(this.getElement().find('div#main-container').$).empty();
        }
    };
});