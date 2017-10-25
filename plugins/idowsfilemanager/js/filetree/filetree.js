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
                    this.setDefaults ( listOptions, defaultOptions );

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
                this.init ( listOptions );


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
                 * @description Inserts selected file on Double-click to the TinyMCE editor
                 * @param {DOM Element} thumbObj
                 * @returns {void}
                 */
                this.insertContentToEditor = ( thumbObj ) => {
                    $ ( thumbObj ).dblclick ( function ( e ) {

                        //prevent default behavioiur
                        e.preventDefault ();

                        //tinymce window manager object
                        let tinyWindow = typeof idowsFileBrowser.tinyMCEWindowManager () !== 'undefined';

                        let isNotimageElement = ( $ ( this ).find ( 'i.idows-thumb' ).length > 0 );
                        let elementType = '';
                        isNotimageElement && ( elementType = $ ( this ).find ( 'i.idows-thumb' ).attr ( 'class' ).replace ( /(idows-ico)|(idows-thumb)|(idows-i-file-)|\s/g, '' ) );
                        const mediaTags = ['video', 'audio'];
                        const anchorTags = ['word', 'pdf', 'txt', 'ppt', 'excel', 'zip'];


                        if ( tinyWindow ) {
                            fileListObj.addTags ( {
                                elementType : elementType,
                                fileName : $ ( this ).data ( 'id' ),
                                fileExt : $ ( this ).data ( 'ext' ),
                                mediaTags : mediaTags,
                                anchorTags : anchorTags
                            } );
                        }
                    } );
                };

                /**
                 * @description Creates different tags based on the selection of the file for the insertion in the TinyMCE editor
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.addTags = ( options ) => {
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
                }


                /**
                 * @description Creates overlay for the fancybox
                 * @param {JSON} options
                 * @returns {void}
                 */
                this.fancyOverlay = ( options ) => {
                    //Set heigth and width to mask to fill up the whole screen
                    $ ( '#overlay' ).css ( {
                        width : options.width,
                        height : options.height
                    } );

                    //transition effect
                    $ ( '#overlay' ).fadeIn ( 1000 ).fadeTo ( "slow", 0.8 );
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
                    this.fancyClear ( options.id );

                    //Set the popup window to center
                    this.fancyResize ( {
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
                    this.fancyClear ( options.id );

                    //init fancy options
                    //resize fancy window to center
                    this.fancyResize ( {
                        id : options.id,
                        winH : options.winH,
                        winW : options.winW,
                        src : undefined,
                        offsetX : 90,
                        offsetY : 40
                    } );

                    //append iframe to preview the document
                    $ ( '<iframe>', {
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
                    this.fancyClear ( options.id );

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
                        this.fancyResize ( {
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
                    this.fancyClear ( options.id );

                    //fancy the video
                    this.fancyResize ( {
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
                    $ ( "<link/>", {
                        rel : "stylesheet",
                        type : "text/css",
                        href : "http://vjs.zencdn.net/6.2.8/video-js.css"
                    } ).appendTo ( "head" );

                    //add video tag for video js
                    $ ( '<video>', {
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
                    $ ( '<source>', {
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
                    this.fancyOverlay ( {
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
                            this.fancyImage ( fancyMapOptions );
                        },
                        'doc' : () => {
                            // load document preview
                            this.fancyDocument ( fancyMapOptions );
                        },
                        'video' : () => {
                            // load video preview
                            this.fancyVideo ( fancyMapOptions );
                        },
                        'zip' : () => {
                            // load zip preview
                            this.fancyZip ( fancyMapOptions );
                        }
                    };

                    //check if valid property defined then call the function
                    fancyMap.hasOwnProperty ( options.fileType ) && fancyMap[options.fileType].call ( this );

                    //transition effect
                    $ ( id ).fadeIn ( 2000 );
                };


                /**
                 * @description Bind close fancybox popup on-click overlay
                 * @returns {void}
                 */
                this.fancyOverlayHide = () => {
                    if ( typeof $._data ( $ ( "#overlay" ).get ( 0 ), 'events' ) === 'undefined' ) {
                        //if mask is clicked
                        $ ( '#overlay' ).click ( function () {
                            $ ( '#overlay,.window' ).effect ( "explode", { }, 1000, function () {
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
                 * @description Bind close buttons for the fancybox popup window.
                 * @returns {void}
                 */
                this.closeButtonPreview = () => {
                    if ( typeof $._data ( $ ( "a.close-preview" ).get ( 0 ), 'events' ) === 'undefined' ) {
                        $ ( "a.close-preview" ).on ( 'click', function ( e ) {
                            e.preventDefault ();
                            let container = $ ( this ).parent ();
                            container.find ( 'video' ).remove ();
                            $ ( "#overlay,.window" ).effect ( "explode", { }, 500 );
                        } );
                    }
                    return;
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
                 * @description Bind checkbox for list view
                 * @returns {undefined}
                 */
                this.bindCheckBoxes = () => {
                    $ ( '.idows-i-checkbox' ).click ( function () {
                        let isSelectAllButton = $ ( this ).parent ().hasClass ( 'select-all' );
                        ( isSelectAllButton ) ? fileListObj.toggleAllCheckboxes () : fileListObj.toggleCheckbox ( $ ( this ) );
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
                    $ ( elem ).find ( '.folderView' ).each ( function () {
                        $ ( this ).click ( function () {
                            console.log ( $ ( this ).parent ().attr ( 'title' ) );
                            listOptions.idowsFileBrowser.switchView ( {
                                view : listOptions.viewType,
                                subfolder : $ ( this ).parent ().attr ( 'title' ) !== '..' ? $ ( this ).parent ().attr ( 'title' ) : ''
                            } );
                        } );
                    } );
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
                    this.fileContextMenu ();

                    //bind context menu for background paste 
                    this.bgContextMenu ();

                    //bind context menu for folder
                    this.folderContextMenu ();

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

                            console.log ( $ ( this )[0].title );

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
                                    $ ( '#' + $ ( ui.draggable[0] ).attr ( 'id' ) ).effect ( 'explode', { }, 1000, function () {
                                        draggable.remove ();
                                    } );
                                }

                            } ).catch ( ( response ) => {
                                listOptions.idowsFileBrowser.showMessage ( response, false );
                            } );
                        }
                    } );

                };


                /**
                 * @description Bind the delete file function to the delete link
                 * @returns {void}
                 */
                this.bindDeleteFile = function () {
                    $ ( "a[title='Delete']" ).on ( 'click', function () {
                        let anchorLink = $ ( this );
                        let file = encodeURIComponent ( $ ( this ).parent ().parent ().attr ( 'data-id' ) );
                        listOptions.idowsFileBrowser.deleteFiles ( {
                            anchorLinks : anchorLink,
                            file : file,
                            formData : null
                        } );
                    } );
                };


                /**
                 * @description Bind the delete folder function to the delete folder icons
                 * @returns {void}
                 */
                this.DeleteFolder = function () {
                    $ ( "a[title='Delete_Folder']" ).on ( 'click', function () {
                        let folder = encodeURIComponent ( $ ( this ).parent ().parent ().attr ( 'data-id' ) );
                        let parentNode = $ ( this ).parent ().parent ();

                        listOptions.idowsFileBrowser.deleteFolder ( folder, parentNode );
                    } );
                };


                /**
                 * @description Binds breadcrumb navigation
                 * @returns {void}
                 */
                this.breadcrumb = function () {
                    $ ( ".idows-breadcrumbs" ).find ( '*[data-dir]' ).each ( function () {
                        $ ( this ).click ( function () {
                            //load view
                            idowsFileBrowser.switchView ( {
                                view : $ ( '#current_template' ).val (),
                                subfolder : $ ( this ).data ( 'dir' )
                            } );
                        } );
                    } );
                };


                /**
                 * @description Creates file list 
                 * @param {Dom Object} elem
                 * @param {text path} dir
                 * @returns {void}
                 */
                this.listFiles = function ( elem, dir ) {

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

                        //bind all thumbs with preview and double click to add to editor events
                        $ ( elem ).find ( 'div.idows-thumb, div.idows-file' ).each ( function () {

                            //bind doubleclick to insert the file into the tinyMCE editor
                            fileListObj.insertContentToEditor ( $ ( this ) );

                        } );
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
                        fileListObj.bindDeleteFile ();

                        //bind delete folders
                        fileListObj.DeleteFolder ();

                        //bind the check boxwws listview
                        fileListObj.bindCheckBoxes ();

                        // bind settings menu
                        idowsFileBrowser.bindSettingsMenu ();

                        //bind preview file on click for list view
                        $ ( "span[data-action]" ).click ( function () {
                            let src = $ ( this ).data ( 'src' );
                            let title = $ ( this ).parent ().attr ( 'title' );
                            let fileType = $ ( this ).data ( 'action' );

                            fileListObj.fancyBox ( {
                                src : src,
                                name : title,
                                fileType : fileType,
                                ext : $ ( this ).parent ().data ( 'ext' )
                            } );
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

                listOptions.idowsFileBrowser.showMessage ( listOptions.loadMessage, true );

                // Get the initial file list
                fileListObj.listFiles ( $ ( this ), escape ( listOptions.root ) );

            }
        } );
    } ) ( jQuery );