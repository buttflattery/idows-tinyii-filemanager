/*jshint sub:true*/
/*jshint esversion:6*/
/*jshint -W030 */
/*globals idowsFileBrowser, escape, jQuery, _ */

/* jQuery file list plugin
 *
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 *Visit http://tinyii.idowstech.com/ for more information
 */

//
// Usage: $('.filecontainer').idowsFileList   ( options, callback )
//
// Options:  root               - DEFAULT: /, root folder to display.
//           script             - DEFAULT = filemanager/thumbview, location of the serverside script to use; 
//           loadMessage        - initial load message to be shown while view populate.
//           idowsFileBrowser   - DEFAULT : null, object for the idowsFileBrowser main file browser dialog window.
//           viewType           - DEFAUL: thumbnail, view type for the file listing, thumbnail / list 
//           sortBy             - DEFAULT: name, sort the file list by name , date, size. 
//           sortOrder          - DEFAULT: ASC, sort order for the files sorted by name, date, size. options can be ASC / DESC. 
// 'use esversion:6';
if ( jQuery )
    ( function ( $ ) {

        $.fn.extend ( {
            /**
             * @description Initializes the plugin on the selected dom object with the given optoins
             * @param {JSON} listOptions
             * @returns {void}
             */
            idowsFileList : function ( listOptions ) {

                'use strict';

                //filetree object
                var fileListObj = this;

                /**
                 * @description Initialize options for the file tree
                 * @param {JSON} listOptions
                 * @returns {void}
                 */
                this.init = ( listOptions ) => {

                    //default options for filelist
                    let defaultOptions = {
                        root : '/',
                        script : 'filemanager/thumbview',
                        loadMessage : 'Loading....',
                        idowsFileBrowser : null,
                        viewType : null,
                        sortBy : 'sort_name',
                        sortOrder : 'ASC'
                    };

                    //set the defaults with lodash 
                    fileListObj.setDefaults ( listOptions, defaultOptions );

                };


                /**
                 * @description Load options and merge defaults
                 * @param {JSON} options
                 * @param {JSON} defaults
                 * @returns {cloned default object merged with custom options for the filetree}
                 */
                this.setDefaults = ( options, defaults ) => {
                    return _.defaults ( { }, _.clone ( options ), defaults );
                };

                //init file tree options
                fileListObj.init ( listOptions );


                /**
                 * @description Creates overlay for the fancybox
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyOverlay = ( options ) => {
                    let overlayElement = $ ( '#overlay' );
                    //Set heigth and width to mask to fill up the whole screen
                    overlayElement.css ( {
                        width : options.width,
                        height : options.height
                    } );

                    //transition effect
                    overlayElement.fadeIn ( 1000 ).fadeTo ( "slow", 0.8 );
                };


                /**
                 * @description Re-size the fancybox popup to the center of the window on load
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyResize = ( options ) => {

                    let sourceDefined = options.src === undefined;
                    let top = ( ( options.winH / 2 - $ ( options.id ).height () / 2 ) - options.offsetX );
                    let left = ( ( options.winW / 2 - $ ( options.id ).width () / 2 ) + options.offsetY );

                    //apply css properties 
                    $ ( options.id ).css ( {
                        top : top,
                        left : left,
                        backgroundImage : ( sourceDefined ) ? 'none' : 'url("' + options.src + '")',
                        backgroundPosition : 'center',
                        backgroundSize : 'contain',
                        backgroundRepeat : 'no-repeat'
                    } );
                };


                /**
                 * @description Clear previous preview html from the fancybox popup
                 * @param {selector text} id
                 * @returns {void}
                 */
                this.fancyClear = ( id ) => {

                    $ ( id ).find ( 'iframe,video,#zip_files' ).remove ();
                };


                /**
                 * @description Preview image files in fancybox popup
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyImage = ( options ) => {

                    //clear any previous preview
                    fileListObj.fancyClear ( options.id );

                    //Set the popup window to center
                    fileListObj.fancyResize ( {
                        id : options.id,
                        winH : options.winH,
                        winW : options.winW,
                        src : options.src,
                        offsetX : 40,
                        offsetY : 10
                    } );
                };


                /**
                 * @description Preview documents type files in fancybox popup
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyDocument = ( options ) => {

                    //clear any previous preview html
                    fileListObj.fancyClear ( options.id );

                    //init fancy options
                    //resize fancy window to center
                    fileListObj.fancyResize ( {
                        id : options.id,
                        winH : options.winH,
                        winW : options.winW,
                        src : undefined,
                        offsetX : 90,
                        offsetY : 40
                    } );

                    //append iframe to preview the document
                    let iframe  =   document.createElement ('iframe');
                    
                    $ ( iframe).attr({
                        src : 'http://docs.google.com/gview?url=' + options.src + '&embedded=true',
                        id : 'previewFrame',
                        frameborder : 0,
                        scrolling : 'no',
                        style : 'width: inherit;height: inherit;'
                    } ).appendTo ( options.id );
                };


                /**
                 * @description Preview zip files in fancybox popup.
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyZip = ( options ) => {
                    //clear any previous preview html
                    fileListObj.fancyClear ( options.id );

                    //send request for zip contents
                    let zipPreview = idowsFileBrowser.sendRequest ( {
                        url : '/filemanager/previewzip',
                        method : 'post',
                        data : {
                            'file' : options.src
                        },
                        dataType : 'html'
                    } );

                    //resolve then 
                    zipPreview.then ( ( response ) => {
                        //init fancy options
                        //resize fancy window to center
                        fileListObj.fancyResize ( {
                            id : options.id,
                            winH : options.winH,
                            winW : options.winW,
                            src : undefined,
                            offsetX : 70,
                            offsetY : 40
                        } );
                        $ ( options.id ).append ( response );
                    } ).catch ( ( response ) => {
                        idowsFileBrowser.showMessage ( response, false );
                    } );
                };


                /**
                 * @description Generate preview for video files in fancybox popup
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyVideo = ( options ) => {

                    //clear any previous preview html
                    fileListObj.fancyClear ( options.id );

                    //fancy the video
                    fileListObj.fancyResize ( {
                        id : options.id,
                        winH : options.winH,
                        winW : options.winW,
                        src : undefined,
                        offsetX : 70,
                        offsetY : 10
                    } );

                    //remvoe google analytic
                    window.HELP_IMPROVE_VIDEOJS = false;

                    //load script file
                    $.getScript ( 'http://vjs.zencdn.net/6.2.8/video.js', function ( data, textStatus, jqxhr ) {
                        let statusOk = jqxhr.status === 200;
                        //videojs.options.flash.swf = 'http://tinyii.my/js/tinymce/plugins/idowsfilemanager/js/video-js.swf';
                        ( statusOk ) && fileListObj.insertVideoSourceTag ( options );
                    } );
                };


                /**
                 * @description Insert video tag and sources for video-js library for previewing the video file in fancybox popup
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.insertVideoSourceTag = ( options ) => {
                    //load css style sheet
                    let stylesheet=document.createElement ('link');
                    $ (stylesheet).attr( {
                        rel : "stylesheet",
                        type : "text/css",
                        href : "http://vjs.zencdn.net/6.2.8/video-js.css"
                    } ).appendTo ( "head" );

                    //add video tag for video js
                    let video=document.createElement ('video');
                    $ ( video).attr( {
                        id : 'my-video',
                        class : 'video-js',
                        controls : '',
                        preload : 'auto',
                        style : 'width:inherit; height:inherit;',
                        width : 'inherit',
                        height : 'inheirt',
                        poster : ''
                    } ).appendTo ( options.id );

                    //add source for the video  
                    let videoSource=document.createElement ('source');
                    $ ( videoSource).attr( {
                        src : options.src,
                        type : 'video/' + options.ext,
                    } ).appendTo ( '#my-video' );

                    //center align the play button on the video js player
                    fileListObj.centerPlayButton ();
                };


                /**
                 * @description Center the video js player button on the player
                 * @returns {void}
                 */
                this.centerPlayButton = () => {
                    let playBT = $ ( ".vjs-big-play-button" );
                    playBT.css ( {
                        left : ( ( playBT.parent ().outerWidth () - playBT.outerWidth () ) / 2 ) + "px",
                        top : ( ( playBT.parent ().outerHeight () - playBT.outerHeight () ) / 2 ) + "px"
                    } );
                };


                /**
                 * @description Create a fancybox for previewing the files
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyBox = ( options ) => {
                    let windowmanager, windowmanagerAvailable, overlayWidth, overlayHeight, winW, winH;

                    windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
                    windowmanagerAvailable = windowmanager !== null;

                    overlayHeight = winH = $ ( document ).height ();
                    overlayWidth = winW = $ ( window ).width ();

                    if ( windowmanagerAvailable ) {
                        //Get window height and width
                        overlayHeight = winH = $ ( windowmanager.windows[0]['$el'] ).height ();
                        overlayWidth = winW = $ ( windowmanager.windows[0]['$el'] ).width () - 18;
                    }

                    //Get the A tag
                    let id = '#dialog';
                    $ ( "#image_name" ).html ( options.name );

                    //add overlay 
                    fileListObj.fancyOverlay ( {
                        width : overlayWidth,
                        height : overlayHeight
                    } );

                    // fancy preview options
                    let fancyMapOptions = {
                        id : id,
                        src : options.src,
                        winW : winW,
                        winH : winH,
                        ext : options.ext
                    };


                    // fancy box file previews mapping
                    let fancyMap = {
                        'image' : () => {
                            // load image preview
                            fileListObj.fancyImage ( fancyMapOptions );
                        },
                        'doc' : () => {
                            // load document preview
                            fileListObj.fancyDocument ( fancyMapOptions );
                        },
                        'video' : () => {
                            // load video preview
                            fileListObj.fancyVideo ( fancyMapOptions );
                        },
                        'zip' : () => {
                            // load zip preview
                            fileListObj.fancyZip ( fancyMapOptions );
                        }
                    };

                    //check if valid property defined then call the function
                    fancyMap.hasOwnProperty ( options.fileType ) && fancyMap[options.fileType].call ( this );

                    //transition effect
                    $ ( id ).fadeIn ( 2000 );
                };


                /**
                 * @description Toggle all check boxes
                 * @returns {void}
                 */
                this.toggleAllCheckboxes = () => {
                    $ ( '.idows-i-checkbox, .idows-i-checked' ).toggleClass ( 'idows-i-checked idows-i-checkbox' );
                    let selectAllCheckbox = $ ( '.selectable_files:checkbox' );
                    selectAllCheckbox.trigger ( 'click' );
                };


                /**
                 * @description toggle a checkbox
                 * @param {Dom Object} elem
                 * @returns {void}
                 */
                this.toggleCheckbox = ( elem ) => {
                    $ ( elem ).toggleClass ( 'idows-i-checked idows-i-checkbox' );
                    let checkbox = $ ( elem ).parent ().find ( 'input:checkbox' );
                    checkbox.trigger ( 'click' );
                };



                /**
                 * @description Opens a rename file window
                 * @param {filename text} id
                 * @returns {void}
                 */
                this.openRenameWindow = ( id ) => {
                    let windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
                    if ( windowmanager !== null ) {
                        idowsFileBrowser.showTinyDialog ( {
                            title : 'Rename File',
                            file : '/filemanager/renamefile',
                            width : 400,
                            height : 300,
                            onClose : function () {
                                idowsFileBrowser.reloadView ();
                            },
                            params : {
                                filename : id
                            },
                            customButton : {
                                text : 'Rename Now',
                                onclick : 'submit',
                            }
                        } );
                        return;
                    }
                    //open bootstrap modal window
                    $ ( "#rename-file" ).data ( 'file', id ).modal ( 'toggle' );
                };


                /**
                 * @description Creates a Context menu for rightclicking on files
                 * @returns {void}
                 */
                this.fileContextMenu = () => {

                    $.contextMenu ( {
                        selector : '.idows-file',
                        callback : function ( key, options ) {

                            let data = 'selectable_files[]=' + options.$trigger.data ( 'id' );

                            let fileContextCommands = {
                                'copy' : () => {
                                    listOptions.idowsFileBrowser.addContextMenuCommand ( data, 'cp' );
                                },
                                'cut' : () => {
                                    listOptions.idowsFileBrowser.addContextMenuCommand ( data, 'mv' );
                                },
                                'rename' : () => {
                                    fileListObj.openRenameWindow ( options.$trigger.data ( 'id' ) );
                                },
                                'delete' : () => {
                                    let thumbView = idowsFileBrowser.options.defaultView == 'thumbnail';
                                    return listOptions.idowsFileBrowser.deleteFiles ( {
                                        anchorLinks : ( thumbView ) ? options.$trigger.children ( ':first' ) : $ ( options.$trigger ).parent (),
                                        file : options.$trigger.data ( 'id' ),
                                        formData : null
                                    } );
                                },
                                'preview' : () => {
                                    let imageSrc = $ ( options.$trigger ).find ( 'span' ).data ( 'src' );
                                    let imageName = null;
                                    let fileType = $ ( options.$trigger ).find ( 'span[data-action]' ).data ( 'action' );

                                    //if thumbnail view
                                    let isThumbView = idowsFileBrowser.options.defaultView == 'thumbnail';

                                    //get image src name and filetype 
                                    imageName = ( isThumbView ) ? $ ( options.$trigger ).attr ( 'title' ) : $ ( options.$trigger ).data ( 'id' );

                                    //load fancy box 
                                    fileListObj.fancyBox ( {
                                        src : imageSrc,
                                        name : imageName,
                                        fileType : fileType,
                                        ext : $ ( options.$trigger ).data ( 'ext' )
                                    } );
                                }
                            };

                            fileContextCommands.hasOwnProperty ( key ) && fileContextCommands[key].call ( this );
                        },
                        items : {
                            "cut" : {
                                name : "Cut",
                                icon : function () {
                                    return 'idows-ico idows-i-cut';
                                }
                            },
                            "copy" : {
                                name : "Copy",
                                icon : function () {
                                    return 'idows-ico idows-i-copy';
                                }
                            },
                            "rename" : {
                                name : "Rename",
                                icon : function () {
                                    return 'idows-ico idows-i-rename';
                                }
                            },
                            "delete" : {
                                name : "Delete",
                                icon : function () {
                                    return 'idows-ico idows-i-delete';
                                }
                            },
                            "preview" : {
                                name : "Preview",
                                icon : function () {
                                    return 'idows-ico idows-i-fullscreen';
                                }
                            },
                            "sep1" : "---------",
                            "quit" : {
                                name : "Quit",
                                icon : function () {
                                    return 'idows-ico idows-i-cross';
                                }
                            }
                        }
                    } );
                };


                /**
                 * @description Creates a context menu for pasting / moving files and refreshing the current directory view
                 * @returns {void}
                 */
                this.bgContextMenu = () => {
                    $.contextMenu ( {
                        selector : '#file_container',
                        callback : function ( key, options ) {
                            let isPaste = key == 'paste';
                            let isRefresh = key == 'refresh';

                            //run context menu command 
                            ( isPaste ) ? listOptions.idowsFileBrowser.runContextMenuCommand ( $ ( "#sub_directory" ).val () ) : ( isRefresh ) && listOptions.idowsFileBrowser.reloadView ();
                        },
                        items : {
                            "paste" : {
                                name : "Paste",
                                icon : function () {
                                    return "context-menu-item idows-ico idows-i-paste";
                                }
                            },
                            "refresh" : {
                                name : "Refresh",
                                icon : function () {
                                    return "context-menu-item idows-ico idows-i-refresh";
                                }
                            },
                            "sep1" : "---------",
                            "quit" : {
                                name : "Quit",
                                icon : function () {
                                    return 'context-menu-item idows-ico idows-i-cross';
                                }
                            }
                        }
                    } );
                };


                /**
                 * @description Creates a context menu for folders
                 * @returns {undefined}
                 */
                this.folderContextMenu = () => {
                    $.contextMenu ( {
                        selector : '.idows-folder',
                        callback : function ( key, options ) {

                            let data = 'selectable_files[]=' + options.$trigger.data ( 'id' );
                            let folderContextCommands = {
                                'rename' : () => {
                                    fileListObj.openRenameWindow ( options.$trigger.data ( 'id' ) );
                                },
                                'delete' : () => {
                                    listOptions.idowsFileBrowser.deleteFolder ( $ ( options.$trigger ).data ( 'id' ), $ ( options.$trigger ) )
                                },
                                'cut' : () => {
                                    listOptions.idowsFileBrowser.addContextMenuCommand ( data, 'mv' );
                                },
                                'copy' : () => {
                                    listOptions.idowsFileBrowser.addContextMenuCommand ( data, 'cpf' );
                                }
                            };

                            folderContextCommands.hasOwnProperty ( key ) && folderContextCommands[key].call ( this );

                            //                            ( isRename ) ? fileListObj.openRenameWindow ( options.$trigger.data ( 'id' ) ) : ( isDelete ) && listOptions.idowsFileBrowser.deleteFolder ( $ ( options.$trigger ).data ( 'id' ), $ ( options.$trigger ) );
                        },
                        items : {
                            "cut" : {
                                name : "Cut",
                                icon : function () {
                                    return 'idows-ico idows-i-cut';
                                }
                            },
                            "copy" : {
                                name : "Copy",
                                icon : function () {
                                    return 'idows-ico idows-i-copy';
                                }
                            },
                            "rename" : {
                                name : "Rename",
                                icon : function () {
                                    return "context-menu-item idows-ico idows-i-rename";
                                }
                            },
                            "delete" : {
                                name : "Delete",
                                icon : function () {
                                    return "context-menu-item idows-ico idows-i-delete";
                                }
                            },
                            "sep1" : "---------",
                            "quit" : {
                                name : "Quit",
                                icon : function () {
                                    return 'context-menu-item idows-ico idows-i-cross';
                                }
                            }
                        }
                    } );
                };


                /**
                 * @description Initialize all the context menus
                 * @returns {void}
                 */
                this.contextMenus = () => {
                    //bind context menu for the files
                    fileListObj.fileContextMenu ();

                    //bind context menu for background paste 
                    fileListObj.bgContextMenu ();

                    //bind context menu for folder
                    fileListObj.folderContextMenu ();

                };


                /**
                 * @description Bind drag event for the files only
                 * @returns {undefined}
                 */
                this.addDragEvent = () => {
                    $ ( ".idows-file, .idows-folder" ).draggable ( {
                        //connectToSortable: "#fileview",
                        helper : "clone",
                        revert : "invalid"
                    } );
                };


                /**
                 * @description Bind drop event to the folders to accept files to be copied or moved
                 * @returns {undefined}
                 */
                this.addDropEvent = () => {
                    $ ( ".idows-folder, .back-link" ).droppable ( {
                        accept : ".idows-file, .idows-folder",
                        drop : function ( event, ui ) {
                            let draggable = $ ( ui.draggable[0] );

                            let options = {
                                url : '/filemanager/movefile',
                                data : {
                                    fileName : draggable.data ( 'id' ),
                                    folder : $ ( this )[0].title
                                },
                                method : 'POST',
                                dataType : 'json'
                            };

                            let promiseDrop = idowsFileBrowser.sendRequest ( options );

                            promiseDrop.then ( ( response ) => {
                                //check if response success
                                let isSuccess = response.success;
                                let isListView = idowsFileBrowser.options.defaultView == 'list';
                                listOptions.idowsFileBrowser.showMessage ( response.message, response.success );

                                if ( isSuccess ) {
                                    if ( isListView ) {
                                        draggable.effect ( 'explode', { }, 500, function () {
                                            draggable.parent ().parent ().remove ();
                                        } );
                                        return;
                                    }
                                    draggable.effect ( 'explode', { }, 1000, function () {
                                        draggable.remove ();
                                    } );
                                }

                            } ).catch ( ( response ) => {
                                listOptions.idowsFileBrowser.showMessage ( response, false );
                            } );
                        }
                    } );

                };


//                /**
//                 * @description Bind the delete file function to the delete link
//                 * @returns {void}
//                 */
//                this.bindDeleteFile = () => {
//                    console.log ( $ ( "a[title='Delete']" ).length);
//                    $ ( "a[title='Delete']" ).on ( 'click', function () {
//                        let anchorLink = $ ( this );
//                        let file = encodeURIComponent ( anchorLink.parent ().parent ().attr ( 'data-id' ) );
//                        listOptions.idowsFileBrowser.deleteFiles ( {
//                            anchorLinks : anchorLink,
//                            file : file,
//                            formData : null
//                        } );
//                    } );
//                };





                /**
                 * @description Binds breadcrumb navigation
                 * @returns {void}
                 */
                this.breadcrumb = () => {
                    let breadcrumbLinks = $ ( ".idows-breadcrumbs" ).find ( '*[data-dir]' );
                    let switchView = ( breadcrumbLinks.length ) && idowsFileBrowser.switchView;

                    for ( var i = 0; i < breadcrumbLinks.length; i++ ) {
                        let link = $ ( breadcrumbLinks[i] );
                        link.on ( 'click', function () {
                            //load view
                            switchView ( {
                                view : $ ( '#current_template' ).val (),
                                subfolder : link.data ( 'dir' )
                            } );
                        } );
                    }
                };


                /**
                 * @description Inserts selected file on Double-click to the TinyMCE editor
                 * @param {DOM Element} thumbObj
                 * @returns {void}
                 */
                this.insertContentToEditor = ( thumbObj ) => {

                    $ ( thumbObj ).dblclick ( function ( e ) {

                        //prevent default behavioiur
                        e.preventDefault ();

                        //tinymce window manager object
                        let tinyWindow = idowsFileBrowser.tinyMCEWindowManager () !== null;
                        let fileReference = $ ( this );
                        let thumbElement = fileReference.find ( 'i.idows-thumb' );

                        let isNotimageElement = ( thumbElement.length > 0 );
                        let elementType = '';
                        isNotimageElement && ( elementType = thumbElement.attr ( 'class' ).replace ( /(idows-ico)|(idows-thumb)|(idows-i-file-)|\s/g, '' ) );
                        const mediaTags = ['video', 'audio'];
                        const anchorTags = ['word', 'pdf', 'txt', 'ppt', 'excel', 'zip'];

                        //is TINYMCE
                        if ( tinyWindow ) {
                            fileListObj.addTagsTinyMCE ( {
                                elementType : elementType,
                                fileName : fileReference.data ( 'id' ),
                                fileExt : fileReference.data ( 'ext' ),
                                mediaTags : mediaTags,
                                anchorTags : anchorTags
                            } );
                            return;
                        }

                        //is CkEditor
                        let isCKEDITOR = typeof top.window.CKEDITOR !== 'undefined';
                        if ( isCKEDITOR ) {
                            fileListObj.addTagsCKEditor ( {
                                elementType : elementType,
                                fileName : fileReference.data ( 'id' ),
                                fileExt : fileReference.data ( 'ext' ),
                                mediaTags : mediaTags,
                                anchorTags : anchorTags
                            } );
                            return;
                        }

                        //is RedactorJs
                        let isREDACTORJS = typeof top.window.$.Redactor !== 'undefined';
                        if ( isREDACTORJS ) {
                            fileListObj.addTagsRedactorJs ( {
                                elementType : elementType,
                                fileName : fileReference.data ( 'id' ),
                                fileExt : fileReference.data ( 'ext' ),
                                mediaTags : mediaTags,
                                anchorTags : anchorTags
                            } );
                            return;
                        }
                        //$(top.window.content.document).find('.redactor_editor').append('hello');
                    } );
                };
                
                 /**
                 * @description Creates different tags based on the selection of the file for the insertion in the CKEDITOR
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.addTagsRedactorJs = ( options ) => {
                    let tag = null;
                    let host = window.location.protocol + '//' + window.location.hostname;
                    let redactorPlugin = window.top.RedactorPlugins.idowsfilemanager;

                    if ( $.inArray ( options.elementType, options.mediaTags ) !== -1 ) {
                        //media insertion tag
                        //<img class="cke-video" data-cke-realelement="%3Ccke%3Avideo%20controls%3D%22controls%22%20height%3D%22320%22%20preload%3D%22metadata%22%20src%3D%22..%2Fimages%2Ftinyii-uploads%2Fsmall.mp4%22%20width%3D%22560%22%3E%26nbsp%3B%3C%2Fcke%3Avideo%3E" data-cke-real-node-type="1" alt="Video" title="Video" src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22560%22%20height%3D%22320%22%3E%3C%2Fsvg%3E" data-cke-real-element-type="video" align="">
                        let videoTag = document.createElement ( 'video' );
                        $ ( videoTag ).attr ( {
                            name : 'video_idows[' + options.fileName.replace ( "\\", "" ).replace ( ".", "_" ) + ']',
                            id : 'video_idows_' + options.fileName.replace ( "\\", "" ).replace ( ".", "_" ),
                            width : 200,
                            height : 200,
                            controls : true,
                            preload : 'auto'
                        } ).data ( { 'setup' : '{}' } );

                        let videoSourceTag = document.createElement ('source');
                        $ ( videoSourceTag).attr({
                            src : host + idowsFileBrowser.options.uploadDir + options.fileName,
                            type : 'video/' + options.fileExt
                        } ).appendTo ( videoTag );
                        redactorPlugin.insertVideoTag ( '<p>'+videoTag.outerHTML+'</p>' );
                        return;
                    } else if ( $.inArray ( options.elementType, options.anchorTags ) !== -1 ) {

                        //anchor insert tag
                        // <a data-cke-saved-href="http://tinyii.my" href="http://tinyii.my">my link</a><br>
                        let anchorTag=document.createElement ('a');
                        let anchorText='Click here to download ' + options.fileExt + ' file' ;
                        $ (anchorTag).attr( {
                            href : host + idowsFileBrowser.options.uploadDir + options.fileName
                        } ).text (anchorText);
                        redactorPlugin.insertAnchorTag({anchor:anchorTag.outerHTML,text:anchorText,target:'_blank',url:host + idowsFileBrowser.options.uploadDir + options.fileName});
                        return;
                    }


                    // insert image tag to the editor
                    redactorPlugin.insertImageTag ( host + idowsFileBrowser.options.uploadDir + options.fileName.replace ( "\\", "/" ) );
                    redactorPlugin.close ();
                    return;
                };


                /**
                 * @description Creates different tags based on the selection of the file for the insertion in the CKEDITOR
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.addTagsCKEditor = ( options ) => {

                    let ckWindow = top.window.CKEDITOR;
                    let tag = null;
                    let host = window.location.protocol + '//' + window.location.hostname;

                    if ( $.inArray ( options.elementType, options.mediaTags ) !== -1 ) {
                        //media insertion tag
                        //<img class="cke-video" data-cke-realelement="%3Ccke%3Avideo%20controls%3D%22controls%22%20height%3D%22320%22%20preload%3D%22metadata%22%20src%3D%22..%2Fimages%2Ftinyii-uploads%2Fsmall.mp4%22%20width%3D%22560%22%3E%26nbsp%3B%3C%2Fcke%3Avideo%3E" data-cke-real-node-type="1" alt="Video" title="Video" src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22560%22%20height%3D%22320%22%3E%3C%2Fsvg%3E" data-cke-real-element-type="video" align="">
                        tag = fileListObj.createCKEditorElement ( {
                            ckWindow : ckWindow,
                            elementType : '<img />',
                            htmlAttributes : {
                                class : 'cke-video',
                                src : 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22560%22%20height%3D%22320%22%3E%3C%2Fsvg%3E',
                                alt : options.fileName,
                                title : options.fileName,
                                align : '',
                                'data-cke-realelement' : encodeURIComponent ( '<cke:video preload="metadata" width="560" height="320" src="' + host + idowsFileBrowser.options.uploadDir + 'small.mp4" controls="controls"></cke:video>' ),
                                'data-cke-real-node-type' : 1,
                                'data-cke-real-element-type' : 'video'
                            }
                        } );
                        ckWindow.currentInstance.insertElement ( tag );
                        $ ( ckWindow.dialog.getCurrent ().getElement ().find ( 'div#main-container' ).$ ).empty ();
                        ckWindow.dialog.getCurrent ().hide ();
                        return;
                    } else if ( $.inArray ( options.elementType, options.anchorTags ) !== -1 ) {

                        //anchor insert tag
                        // <a data-cke-saved-href="http://tinyii.my" href="http://tinyii.my">my link</a><br>
                        tag = fileListObj.createCKEditorElement ( {
                            ckWindow : ckWindow,
                            elementType : '<a />',
                            htmlAttributes : {
                                href : host + idowsFileBrowser.options.uploadDir + options.fileName,
                                'data-cke-saved-href' : host + idowsFileBrowser.options.uploadDir + options.fileName,
                                'data-cke-real-node-type' : 1,
                                'data-cke-real-element-type' : 'video'
                            }
                        } );

                        $ ( tag.$ ).text ( 'Click here to download ' + options.fileExt + ' file' );
                        ckWindow.currentInstance.insertElement ( tag );
                        $ ( ckWindow.dialog.getCurrent ().getElement ().find ( 'div#main-container' ).$ ).empty ();
                        ckWindow.dialog.getCurrent ().hide ();

                        return;
                    }

                    // insert image tag to the editor
                    tag = fileListObj.createCKEditorElement ( {
                        ckWindow : ckWindow,
                        elementType : '<img />',
                        htmlAttributes : {
                            alt : '',
                            src : host + idowsFileBrowser.options.uploadDir + options.fileName,
                            'data-cke-saved-src' : host + idowsFileBrowser.options.uploadDir + options.fileName
                        }
                    } );

                    ckWindow.currentInstance.insertElement ( tag );
                    $ ( ckWindow.dialog.getCurrent ().getElement ().find ( 'div#main-container' ).$ ).empty ();
                    ckWindow.dialog.getCurrent ().hide ();
                    return;
                };


                /**
                 * Creates an HTML DOM element using ckeditor library
                 * @param {type} options
                 * @returns {unresolved}
                 */
                this.createCKEditorElement = ( options ) => {
                    // insert image tag to the editor
                    let tag = options.ckWindow.dom.element.createFromHtml ( options.elementType, options.ckWindow.document );

                    //set html attributes for the element
                    tag.setAttributes ( options.htmlAttributes );
                    return tag;
                };

                /**
                 * CKEditor current instance
                 * @returns {top.window.CKEDITOR.instances|Window.CKEDITOR.instances|Boolean}
                 */
                this.getCKEditorInstance = () => {
                    var ck_instance_name = false;
                    for ( var ck_instance in top.window.CKEDITOR.instances ) {
                        if ( top.window.CKEDITOR.instances[ck_instance].focusManager.hasFocus ) {
                            ck_instance_name = ck_instance;
                            return ck_instance_name;
                        }
                    }
                };


                /**
                 * @description Creates different tags based on the selection of the file for the insertion in the TinyMCE editor
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.addTagsTinyMCE = ( options ) => {
                    let elem = window.parent.tinyMCE.get ();
                    let tinyMCE = window.parent.tinyMCE.get ( elem[0].id );
                    let tag = null;

                    if ( $.inArray ( options.elementType, options.mediaTags ) !== -1 ) {
                        //media insertion tag
                        tag = '<p><img class="mce-object mce-object-video" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-mce-p-controls="controls" data-mce-html="%0A%3Csource%20src%3D%22' + idowsFileBrowser.options.uploadDir + options.fileName + '%22%20type%3D%22video/' + options.fileExt + '%22%20/%3E" data-mce-object="video" data-mce-selected="1" width="300" height="150">';
                        tinyMCE.execCommand ( 'mceInsertContent', false, tag );
                        tinyMCE.windowManager.close ();
                        return;
                    } else if ( $.inArray ( options.elementType, options.anchorTags ) !== -1 ) {
                        //anchor insert tag
                        tag = '<p><a title="the title" href="' + idowsFileBrowser.options.uploadDir + options.fileName + '" target="_blank" rel="noopener noreferrer" data-mce-href="' + idowsFileBrowser.options.uploadDir + options.fileName + '">Click here to download ' + options.fileExt + ' file</a><br data-mce-bogus="1"></p>';
                        tinyMCE.execCommand ( 'mceInsertContent', false, tag );
                        tinyMCE.windowManager.close ();
                        return;
                    }

                    // image inset tag
                    tag = '<p><img src="/images/tinyii-uploads/' + options.fileName + '" alt="" /></p>';
                    tinyMCE.execCommand ( 'mceInsertContent', false, tag );
                    tinyMCE.windowManager.close ();
                    return;
                };

                /**
                 * @description Aborts any previous requets for the filtree view and launches a new request
                 * @param {ajax request object} fileLoadRequest
                 * @returns {void}
                 */
                this.abortPreviousTreeLoads = ( fileLoadRequest ) => {
                    $.ajaxSetup ( {
                        beforeSend : function () {
                            let requestActive = fileLoadRequest !== null;
                            requestActive && fileLoadRequest.abort ();
                        }
                    } );
                };

                

                /**
                 * @description Bind close buttons for the fancybox popup window.
                 * @returns {void}
                 */
                this.closeButtonPreview = () => {
                    let elementClose = $ ( "a.close-preview" );
                    if ( typeof $._data ( elementClose.get ( 0 ), 'events' ) === 'undefined' ) {
                        elementClose.on ( 'click', function ( e ) {
                            e.preventDefault ();
                            let container = $ ( this ).parent ();
                            container.find ( 'video' ).remove ();
                            $ ( "#overlay,.window" ).effect ( "explode", { }, 500 );
                        } );
                    }
                    return;
                };

                /**
                 * @description Bind close fancybox popup on-click overlay
                 * @returns {void}
                 */
                this.fancyOverlayHide = () => {
                    let overlayElement = $ ( "#overlay" );

                    if ( typeof $._data ( overlayElement.get ( 0 ), 'events' ) === 'undefined' ) {
                        //if mask is clicked
                        overlayElement.on ( 'click', function () {
                            $ ( '#overlay, .window' ).effect ( "explode", { }, 1000, function () {
                                $ ( '.window' ).find ( 'video' ).remove ();
                            } );
                        } );
                    }
                    return;
                };


                /**
                 * @description Resize overlay if window is resized to fit the window
                 * @returns {void}
                 */
                this.fancyOverlayResize = () => {
                    $ ( window ).resize ( () => {

                        let box = $ ( '.window' );

                        //Get the screen height and width
                        let overlayHeight = $ ( document ).height ();
                        let overlayWidth = $ ( window ).width ();

                        //Set height and width to mask to fill up the whole screen
                        $ ( '#overlay' ).css ( {
                            'width' : overlayWidth,
                            'height' : overlayHeight
                        } );

                        //Get the window height and width
                        let winH = $ ( document ).height ();
                        let winW = $ ( window ).width ();

                        //Set the popup window to center
                        box.css ( 'top', winH / 2 - box.height () / 2 );
                        box.css ( 'left', winW / 2 - box.width () / 2 );

                    } );
                };

                /**
                 * @description Navigates through the directories when clicked on a folder
                 * @param {Dom Object} elem
                 * @param {JSON} listOptions
                 * @returns {void}
                 */
                this.folderNavigation = ( elem, listOptions ) => {

                    //bind function for folder view / navigate

                    let folders = $ ( elem ).find ( '.folderView' );
                    let switchView = ( folders.length ) && listOptions.idowsFileBrowser.switchView;

                    for ( var i = 0; i < folders.length; i++ ) {
                        let folderElement = $ ( folders[i] );

                        folderElement.on ( 'click', function () {
                            let folder = $ ( this );
                            switchView ( {
                                view : listOptions.viewType,
                                subfolder : folder.parent ().attr ( 'title' ) !== '..' ? folder.parent ().attr ( 'title' ) : ''
                            } );
                        } );
                    }
                };

                /**
                 * @description Bind the delete folder function to the delete folder icons
                 * @returns {void}
                 */
                this.DeleteFolder = () => {
                    let deleteFolder = listOptions.idowsFileBrowser.deleteFolder;
                    $ ( "a[title='Delete_Folder']" ).on ( 'click', function () {
                        let deleteElement = $ ( this );
                        let folder = encodeURIComponent ( deleteElement.parent ().parent ().attr ( 'data-id' ) );
                        let parentNode = deleteElement.parent ().parent ();

                        deleteFolder ( folder, parentNode );
                    } );
                };


                /**
                 * @description Bind checkbox for list view
                 * @returns {undefined}
                 */
                this.bindCheckBoxes = () => {
                    $ ( '.idows-i-checkbox' ).on ( 'click', function () {
                        let isSelectAllButton = $ ( this ).parent ().hasClass ( 'select-all' );
                        ( isSelectAllButton ) ? fileListObj.toggleAllCheckboxes () : fileListObj.toggleCheckbox ( $ ( this ) );
                    } );
                };

                /**
                 * @description Sends post request to populate file tree view requested
                 * @param {JSON} options
                 * @returns {jqXHR}
                 */
                this.populate = ( options ) => {
                    return $.post ( listOptions.script, {
                        dir : options.dir,
                        sortBy : listOptions.sortBy,
                        sortOrder : listOptions.sortOrder
                    }, ( data ) => {
                        $ ( options.elem ).removeClass ( 'wait' ).append ( data );
                    } );
                };

                /**
                 * @description Creates file list 
                 * @param {Dom Object} elem
                 * @param {text path} dir
                 * @returns {void}
                 */
                this.listFiles = ( elem, dir ) => {

                    //init tree load request to null
                    let fileLoadRequest = null;

                    //send request to controller action to popoulate the trees
                    fileLoadRequest = fileListObj.populate ( {
                        elem : elem,
                        dir : dir
                    } );

                    //avoid concurrent request to same view
                    fileListObj.abortPreviousTreeLoads ( fileLoadRequest );

                    // after successfull view load
                    fileLoadRequest.done ( function () {
                        let files = $ ( elem ).find ( 'div.idows-thumb, div.idows-file' );
                        let insertContentToEditor = ( files.length ) && fileListObj.insertContentToEditor;

                        //bind all thumbs with preview and double click to add to editor events
                        for ( var i = 0; i < files.length; i++ ) {
                            //bind doubleclick to insert the file into the tinyMCE editor
                            insertContentToEditor ( files[i] );
                        }

                        //close button preview
                        fileListObj.closeButtonPreview ();

                        //mask close click preview
                        fileListObj.fancyOverlayHide ();

                        //mask window resize to fit screen
                        fileListObj.fancyOverlayResize ();

                        //bind folder navigation
                        fileListObj.folderNavigation ( elem, listOptions );

                        //bind context menus 
                        fileListObj.contextMenus ();

                        //attach drag event for the files
                        fileListObj.addDragEvent ();

                        //attach drop event for the folders
                        fileListObj.addDropEvent ();

                        //bind delete function for the files
//                        fileListObj.bindDeleteFile ();

                        //bind delete folders
                        fileListObj.DeleteFolder ();

                        //bind the check boxwws listview
                        fileListObj.bindCheckBoxes ();

                        // bind settings menu
                        idowsFileBrowser.bindSettingsMenu ();

                        let listviewFiles = $ ( "span[data-action]" );
                        let fancyBoxFunction = ( listviewFiles ) && fileListObj.fancyBox;

                        //bind preview file on click for list view
                        $ ( "span[data-action]" ).on ( 'click', function () {
                            let spanElement = $ ( this );
                            setTimeout ( function () {
                                let dblclick = parseInt ( spanElement.data ( 'double' ), 10 );
                                let src = spanElement.data ( 'src' );
                                let title = spanElement.parent ().attr ( 'title' );
                                let fileType = spanElement.data ( 'action' );
                                ( !dblclick ) && fancyBoxFunction ( {
                                    src : spanElement.data ( 'src' ),
                                    name : spanElement.parent ().attr ( 'title' ),
                                    fileType : spanElement.data ( 'action' ),
                                    ext : spanElement.parent ().data ( 'ext' )
                                } );
                            }, 300 );
                        } );


                        //bind breadcrumb
                        fileListObj.breadcrumb ();

                        // //
                        // $(".idows-thumb").click(function() {
                        //     fileListObj.toggleCheckbox();
                        // })

                    } );
                };

                //clear the previous file listing
                $ ( this ).html ( '' );

//                listOptions.idowsFileBrowser.showMessage ( listOptions.loadMessage, true );

                // Get the initial file list
                fileListObj.listFiles ( $ ( this ), escape ( listOptions.root ) );

            }
        } );
    } ) ( jQuery );