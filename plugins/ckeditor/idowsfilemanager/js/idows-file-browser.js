/*jshint esversion: 6 */
/*globals $, tinymce, tinyMCE, bootbox, _ */
/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 
 * options
 iframeOpened    :   false,      Iframewindow for the file upload to show error after upload if any , default : false
 timeoutStore    :   false,      File upload timeout if upload process takes more than specified minutes it opens the troubleshooting window.
 defaultView     :   'thumbnail', Selected / default view for the file list.
 viewScript      :   'thumbview', Action name for the view type selected
 assetsDir       :   null,       Plugin assets directory root, path to the idowsfilemanger plugin directory relative to the root of the project. 
 This is normally inside the tinymce/plugins folder.Demo path is /js/tinymce/plugins/idowsfilemanager.
 uploadDir       :   '',         Upload assets directory, this needs to be set equal to the directory path you will use for the uploading of the assets.
 currentDirectory:   '',         Current browsed directory for the filemanager, default is empty means root folder.
 phpViewScript   :   '/filemanager/' + this.viewScript, Complete path for the php script needs pretty url enabled, example /controller/action_name
 */

'use esversion: 6';
var idowsFileBrowser = new function () {
    this.options = {
        iframeOpened : false,
        timeoutStore : false,
        defaultView : 'thumbnail',
        viewScript : 'thumbview',
        assetsDir : undefined,
        uploadDir : '',
        currentDirectory : '',
        phpViewScript : '/filemanager/thumbview',
    };

    // timeout id
    var tout = '';

    /**
     * init the filetree 
     * This is the main entry point for the filemanager script and is 
     * called inside the views/filemanager/dialog.php file to initiate the filemanager.
     * @param {JSON} options
     */
    this.init = ( options ) => {

        //load dependencies
        idowsFileBrowser.dependencyCheck ( options );

        //call the default view for the files listing
        idowsFileBrowser.switchView ( {
            view : idowsFileBrowser.options.defaultView
        } );

        //bind menu buttons functionality
        idowsFileBrowser.menuButtonBinding ();

        //init the modals if no editor manager detected
        let windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
        ( windowmanager === null ) && idowsFileBrowser.initializeBootstrapModals ();
    };


    //check dependency options
    /**
     * check dependency options
     * This method checks all the required asets needed to load the plugin.
     * @param {JSON} options
     * @returns {undefined}
     */
    this.dependencyCheck = ( options ) => {

        //initialize options
        idowsFileBrowser.options = idowsFileBrowser.setDefaults ( options, this.options );

        //check if the upload directory an plugin directory is available
        let isAssetsNull = typeof idowsFileBrowser.options.assetsDir === 'undefined';
        let windowManager = idowsFileBrowser.tinyMCEWindowManager ();
        let isWindowManagerDefined = windowManager !== null;

        if ( isAssetsNull ) {
            if ( isWindowManagerDefined ) {
                windowManager.alert ( 'Please provide upload dir path and plugin path before initializing the plugin, see documentation.' );
                windowManager.close ();
                return;
            }
            bootbox.alert ( "Are you sure you want to delete the folder and all of its contents?." );
            return;
        }
    };


    /**
     * load options and merge defaults 
     * @description clones the default options object merging it 
     * with the options initalized
     * @param {JSON} options
     * @param {JSON} defaults
     * @returns {cloned JSON Object}
     */
    this.setDefaults = ( options, defaults ) => {
        return _.defaults ( { }, _.clone ( options ), defaults );
    };

    /**
     * go to home directory
     * @@description displays the home directory 
     * @returns {undefined}
     */
    this.goHome = () => {
        idowsFileBrowser.switchView ( {
            view : $ ( "#current_template" ).val ()
        } );
    };

    //
    /**
     * send request using promise
     * @description Send Promise request to the provided url / options
     * @param {JSON} options
     * @returns {Promise}
     */
    this.sendRequest = ( options ) => {
        return new Promise ( ( resolve, reject ) => {
            $.ajax ( {
                url : options.url,
                method : options.method,
                data : options.data,
                dataType : options.dataType
            } ).done ( function ( response ) {
                ( options.dataType !== 'html' && !response.success ) ? reject ( response ) : resolve ( response );
            } );
        } );
    };


    /**
     * bind settings menu
     * @description Binds Toggle settings menu in the toolbar 
     * with the checkbox selection / unselection
     */
    this.bindSettingsMenu = () => {
        let selector = $ ( ".selectable_files:checkbox" );
        let eventType = 'change';
        selector.on ( eventType, function ( e ) {
            idowsFileBrowser.toggleSettingsMenu ();
        } );
    };


    /**
     * @description Toggles the settings menu based on selection /  unselectin of the checkboxes
     * @returns {undefined}
     */
    this.toggleSettingsMenu = () => {
        let hasSelectedFiles = $ ( ".selectable_files:checked" ).length > 0;
        let settingsElement = $ ( "#settings" );
        if ( hasSelectedFiles ) {
            settingsElement.parent ().addClass ( "idows-active" ).show ();
            return;
        }

        //hide settings
        $ ( "#settings-menu" ).hide ();
        settingsElement.parent ().removeClass ( "idows-active" ).hide ();

    };


    /**
     * @description Displays Message 
     * @param {string} message
     * @param {boolean} type
     */
    this.showMessage = ( message, type ) => {
        //this.hideAllMessages();
        clearTimeout ( tout );
        type = ( type === false ) ? 'danger' : 'success';
        let alert = $ ( ".alert-" + type );
        alert.find ( '.message' ).html ( '<strong>' + message + '</strong>' );
        alert.animate ( {
            top : 36 + 'px',
            zIndex : 999,
            right : 0,
            width : ( 400 ) + 'px',
            position : 'fixed'
        }, 500 );
        tout = setTimeout ( idowsFileBrowser.hideAllMessages, 3000 );
    };

    /**
     * @description  Closes the message with the drop effect
     * @param {JSON} obj
     */
    this.closeMessage = ( obj ) => {
        $ ( obj ).effect ( "drop", { }, 500, function () {
            $ ( obj ).css ( {
                'top' : -1000
            } );
        } );
    };


    /**
     * @description Hides all the displayed messages with the drop effect
     * @returns {undefined}
     */
    this.hideAllMessages = () => {
        
        let alerts = $ ( "#alerts" ).children ();

        for ( var i = 0; i < alerts.length; i++ ) {
            let alert = $ ( alerts[i] );
            alert.effect ( "drop", { }, 500, function () {
                alert.css ( {
                    'top' : -1000
                } );
            } );
        }
    };


    /**
     * @description Adds the context menu command to the session variable using promise
     * @param {JSON} params
     * @param {Text} command
     */
    this.addContextMenuCommand = ( params, command ) => {
        //prepare options for the request
        let options = {
            url : '/filemanager/setcontextmenucommand',
            data : params + '&command=' + command,
            method : "post",
            dataType : 'json'
        };

        //send request
        let commandPromise = idowsFileBrowser.sendRequest ( options );

        //after request opertations
        commandPromise
                .then ( ( response ) => {
                    idowsFileBrowser.showMessage ( response.message, response.success );
                } )
                .catch ( ( response ) => {
                    idowsFileBrowser.showMessage ( response.message, false );
                } );
    };


    /**
     * @description Execute current context menu command added by context menu
     * @param {type} dest
     * @returns {undefined}
     */
    this.runContextMenuCommand = ( dest ) => {
        let options = {
            url : '/filemanager/runcontextmenucommand',
            method : 'POST',
            data : {
                'destination' : dest
            },
            dataType : 'json'
        };

        let commandPromise = idowsFileBrowser.sendRequest ( options );

        commandPromise.then ( ( response ) => {
            idowsFileBrowser.reloadView ();
            idowsFileBrowser.showMessage ( response.message, response.success );
        } ).catch ( ( response ) => {
            idowsFileBrowser.showMessage ( response.message, false );
        } );

    };


    /**
     * @description Downloads the file(s) after zipping them uses Promise to send the request
     * @param {type} files
     * @param {type} formData
     * @returns {undefined}
     */
    this.downloadFiles = ( files = null, formData = null ) => {
        //bind the download file(s) function to the download link in settings menu
        let options = {
            url : "/filemanager/zipfile",
            method : "POST",
            data : ( formData !== null ) ? formData : "selectable_files[]=" + files,
            dataType : 'json'
        };

        let promiseDownload = idowsFileBrowser.sendRequest ( options );

        promiseDownload.then ( ( response ) => {
            response.success && window.location.assign ( '/filemanager/downloadzip?filename=' + response.filename );
            idowsFileBrowser.showMessage ( response.message, response.success );
        } ).catch ( ( response ) => {
            idowsFileBrowser.showMessage ( response.message, false );
        } );
    };


    /**
     * @description shows tinymce windowmanager dialog window
     * @param {type} options
     * @returns {undefined}
     */
    this.showTinyDialog = ( options ) => {
        let windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
        windowmanager.open ( {
            title : options.title,
            file : options.file,
            width : options.width,
            height : options.height,
            onClose : options.onClose,
            buttons : [{
                    text : 'Close',
                    onclick : 'close'
                }]

        }, options.params );
    };


    /**
     * @description initialize bootstrap modals when 
     * filemanager is used as a standalone
     */
    this.initializeBootstrapModals = () => {

        //bind bootstrap modals if using as a  standalone
        idowsFileBrowser.addFolderBootstrap ();

        // bootstrap edit file /folder modal bootstrap
        idowsFileBrowser.editFileBootstrap ();

    };


    /**
     * @description add folder modal window bootstrap for stanalone usage
     * @returns {undefined}
     */
    this.addFolderBootstrap = () => {
        $ ( '#add-folder' ).on ( 'shown.bs.modal', function ( event ) {
            // var button = $(event.relatedTarget); // Button that triggered the modal
            let modal = $ ( this );
            modal.find ( '.modal-header > h4' ).text ( 'Add Folder' );

            let addFolderRequest = idowsFileBrowser.sendRequest ( {
                url : '/filemanager/addfolder',
                dataType : 'html',
                method : 'get',
                data : {
                    'current_directory' : idowsFileBrowser.options.currentDirectory
                }
            } );

            addFolderRequest.then ( ( response ) => {
                modal.find ( '.modal-body' ).html ( response );
            } ).catch ( ( response ) => {
                idowsFileBrowser.showMessage ( response, false );
            } );
        } );

    };

    // bootstrap edit file /folder modal bootstrap
    /**
     * @description bootstrap edit file/folder modal 
     * window bootstrap for standalone usage
     * @returns {undefined}
     */
    this.editFileBootstrap = () => {
        $ ( '#rename-file' ).on ( 'shown.bs.modal', function ( event ) {

            let modal = $ ( this );
            let path = modal.data ( 'file' );
            let filename = idowsFileBrowser.basename ( path );

            modal.find ( '.modal-header > h4' ).text ( 'Rename ' + filename );

            let addFolderRequest = idowsFileBrowser.sendRequest ( {
                url : '/filemanager/renamefile',
                dataType : 'html',
                method : 'get',
                data : {
                    'filename' : path
                }
            } );

            addFolderRequest.then ( ( response ) => {
                modal.find ( '.modal-body' ).html ( response );
            } ).catch ( ( response ) => {
                idowsFileBrowser.showMessage ( response, false );
            } );
        } );
    };


    /**
     * @description deletes a folder 
     * @param {FOLDER PATH FROM UPLOADS ROOT} folder
     * @param {ELEMENT DOM OBJECT} node
     */
    this.deleteFolder = ( folder, node ) => {
        let windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
        let isWindowManagerDefined = windowmanager !== null;

        //show editor confirm window if available 
        if ( isWindowManagerDefined ) {
            windowmanager.confirm ( "Are you sure you want to delete the folder and all of its contents? .", function ( confirmed ) {
                confirmed && idowsFileBrowser.sendRemoveFolderRequest ( folder, node );
            } );
            return;
        }

        //if standalone usage hen show bootstrap cofnirm dialog
        bootbox.confirm ( "Are you sure you want to delete the folder and all of its contents? .", function ( confirmed ) {
            confirmed && idowsFileBrowser.sendRemoveFolderRequest ( folder, node );
        } );
    };


    /**
     * @description Sends remove folder Promise Request
     * @param {type} folder
     * @param {type} node
     * @returns {undefined}
     */
    this.sendRemoveFolderRequest = ( folder, node ) => {

        // create delete request for the folder
        let deletePromise = idowsFileBrowser.sendRequest ( {
            url : "/filemanager/removefolder",
            method : "POST",
            data : "folder=" + folder,
            dataType : 'json'
        } );

        // after request
        deletePromise.then ( ( response ) => {
            let isThumbView = idowsFileBrowser.options.defaultView == 'thumbnail';
            idowsFileBrowser.showMessage ( response.message, response.success );
            if ( isThumbView ) {
                $ ( node ).effect ( 'explode', { }, 500, function () {
                    $ ( node ).remove ();
                } );
                return;
            }
            $ ( node ).parent ().effect ( 'explode', { }, 500, function () {
                $ ( node ).parent ().parent ().remove ();
            } );
        } ).catch ( ( response ) => {
            idowsFileBrowser.showMessage ( response.message, false );
        } );
    };


    /**
     * @description Deletes a file 
     * @param {JSON} options
     */
    this.deleteFiles = ( options ) => {
        let windowManager = idowsFileBrowser.tinyMCEWindowManager ();
        let isWindowManagerDefined = ( windowManager !== null );
        if ( isWindowManagerDefined ) {
            //send request to remove the file(s)
            windowManager.confirm ( "Are you sure you want to delete the selected files.", function ( confirm ) {
                confirm && idowsFileBrowser.sendDeleteFileRequest ( options );
            } );
            return;
        }
        //if standalone usage hen show bootstrap cofnirm dialog
        bootbox.confirm ( "Are you sure you want to delete the folder and all of its contents? .", function ( confirmed ) {
            confirmed && idowsFileBrowser.sendDeleteFileRequest ( options );
        } );
    };

    /**
     * @description Sends Delete File Promise request
     * @param {JSON} options
     */
    this.sendDeleteFileRequest = ( options ) => {

        //is multi-file delete request
        let isMultiDelete = options.formData !== null;

        //initialize options for the request
        let requestOptions = {
            url : "/filemanager/removefile",
            method : "POST",
            data : ( isMultiDelete ) ? options.formData : "selectable_files[]=" + options.file,
            dataType : 'json'
        };

        //send delete file request for the 
        let deletePromise = idowsFileBrowser.sendRequest ( requestOptions );
        deletePromise.then ( ( response ) => {
            if ( response.success ) {
                //remove all images from the view
                let anchorLinks = $ ( options.anchorLinks );
                for ( var i = 0; i < anchorLinks.length; i++ ) {
                    let elem = $ ( anchorLinks[i] ).parent ();
                    elem.effect ( 'explode', { }, 500, function () {
                        elem.remove ();
                    } );
                }
                //display message 
                idowsFileBrowser.showMessage ( response.message, response.success );
            }
        } ).catch ( ( response ) => {
            //display message 
            idowsFileBrowser.showMessage ( response.message, false );
        } );
    };

    //menu button bindings for the top navigation menu
    /**
     * @description Menu button bindings for the top navigation menu
     * @returns {void}
     */
    this.menuButtonBinding = () => {
        let menuButtonEvents = {

            //bind the list view to the menu button
            listView : function ( event ) {
                idowsFileBrowser.switchView ( {
                    view : 'list',
                    subfolder : idowsFileBrowser.options.currentDirectory,
                } );
            },

            //bind the thumbnail view to the menu button
            thumbView : function ( event ) {
                idowsFileBrowser.switchView ( {
                    view : 'thumbnail',
                    subfolder : idowsFileBrowser.options.currentDirectory
                } );
            },

            //add toggle for the sort menu dropdown
            sortToggle : function ( event ) {
                $ ( "#sort-menu" ).toggle ();
            },

            //add toggle for the settings menu dropdown
            settings : function ( event ) {
                $ ( "#settings-menu" ).toggle ();
            },

            //bind add Folder button
            addFolder : function ( event ) {
                let windowmanager = idowsFileBrowser.tinyMCEWindowManager ();
                ( windowmanager !== null ) ? idowsFileBrowser.showTinyDialog ( {
                    title : 'Add Folder',
                    file : '/filemanager/addfolder',
                    width : 400,
                    height : 300,
                    onClose : function () {
                        idowsFileBrowser.reloadView ();
                    },
                    params : {
                        current_directory : idowsFileBrowser.options.currentDirectory
                    },
                    customButton : {
                        text : 'Add Folder Now',
                        onclick : function ( e ) {
                            $ ( "#folder-form" ).submit ();
                        }
                    }
                } ) : $ ( '#add-folder' ).modal ( 'toggle' );
            },

            //bind settings menu functions 
            // copy / paste file function 
            copy : function ( event ) {
                var data = $ ( "#fileview :input[type='checkbox']:checked" ).serialize ();
                idowsFileBrowser.addContextMenuCommand ( data, 'cp' );
            },

            //cut / paste file function
            cut : function ( event ) {
                var data = $ ( "#fileview :input[type='checkbox']:checked" ).serialize ();
                idowsFileBrowser.addContextMenuCommand ( data, 'mv' );
            },

            // bind the delete file function to the delete link
            delete : function ( event ) {
                var checkboxes = $ ( "#fileview :input[type='checkbox']:checked" );
                var data = checkboxes.serialize ();
                idowsFileBrowser.deleteFiles ( {
                    anchorLinks : checkboxes.parent (),
                    file : null,
                    formData : data
                } );
            },

            // bind the download files function to the top menu download link
            download : function ( event ) {
                var data = $ ( "#fileview :input[type='checkbox']:checked" ).serialize ();
                idowsFileBrowser.downloadFiles ( null, data );
            },

            //bind message close button
            closeMessage : function ( event ) {
                idowsFileBrowser.closeMessage ( this );
            },
            //refresh / reload button
            reload : function ( event ) {
                idowsFileBrowser.reloadView ();
            },
            //home button
            home : function () {
                idowsFileBrowser.goHome ();
            }
        };

        //bind all button clicks for the top navigation 
        $ ( "*[data-action]" ).on ( "click", function ( event ) {
            let
                    element = $ ( this ),
                    action = element.data ( "action" );

            event.preventDefault ();

            // If there's an action with the given name, call it
            let isEventAvailable = typeof menuButtonEvents[action] === "function";
            ( isEventAvailable ) && menuButtonEvents[action].call ( this, event );
        } );

        //bind filter input  on keyup
        $ ( "#filter_now" ).on ( 'keyup', function ( event ) {
            idowsFileBrowser.searchFilter ( $ ( this ).val () );
        } );

        //bind file upload trigger with file input onchange
        $ ( "#uploader" ).on ( 'change', function () {
            $ ( '#upl' ).submit ();
            idowsFileBrowser.inProgress ();
        } );

        //bind toggle and sort functions for the list
        let sortItems = $ ( "#sort-menu" ).children ().children ();
        for ( var i = 0; i < sortItems.length; i++ ) {
            let menuItems = $ ( sortItems[i] );
            let switchView = ( menuItems.length ) && idowsFileBrowser.switchView;

            menuItems.on ( 'click', function () {
                let currentSortOption = $ ( this );

                //label span for the dropdown menus
                let label = currentSortOption.find ( 'span.idows-text' );
                let hasActiveClass = currentSortOption.hasClass ( 'idows-active' );


                if ( hasActiveClass ) {
                    switchView ( {
                        view : $ ( "#current_template" ).val (),
                        subfolder : idowsFileBrowser.options.currentDirectory,
                        sortBy : currentSortOption.attr ( 'id' ),
                        sortOrder : 'DESC'
                    } );
                    label.text ( label.attr ( 'data-name' ) + ' Descending' );
                    currentSortOption.find ( 'i' ).removeClass ( 'idows-ico idows-i-sort-up' ).addClass ( 'idows-ico idows-i-sort-down' );
                } else {

                    switchView ( {
                        view : $ ( "#current_template" ).val (),
                        subfolder : idowsFileBrowser.options.currentDirectory,
                        sortBy : currentSortOption.attr ( 'id' )
                    } );
                    label.text ( label.attr ( 'data-name' ) + ' Ascending' );
                    currentSortOption.find ( 'i' ).removeClass ( 'idows-ico idows-i-sort-down' ).addClass ( 'idows-ico idows-i-sort-up' );
                }
                //get siblings / other menu options 
                var siblings = currentSortOption.siblings ();

                //remove the class active
                siblings.removeClass ( 'idows-active' ).find ( 'i' ).removeClass ( 'idows-ico idows-i-sort-down idows-i-sort-up' );
                for ( var i = 0; i < siblings.length; i++ ) {
                    let currentSibling = $ ( siblings[i] );
                    let optionText = currentSibling.find ( 'span.idows-text' );
                    optionText.text ( optionText.attr ( 'data-name' ) + ' Ascending' );
                }
                currentSortOption.toggleClass ( 'idows-active' );
            } );
        }
    };

    //refresh or reload the current selected view
    /**
     * @description Refresh or reload the current selected view
     * @returns {void}
     */
    this.reloadView = () => {
        idowsFileBrowser.switchView ( {
            view : $ ( "#current_template" ).val (),
            subfolder : this.options.currentDirectory
        } );
    };

    //adds overlay for the upload progress 
    /**
     * @description Adds overlay for the upload progress
     * @returns {void}
     */
    this.inProgress = () => {
        var overlay = $ ( '<div class="idows-throbber"><p class="ajax-loader">Please Wait while we upload your image</p></div>' );
        overlay.appendTo ( document.body );
        idowsFileBrowser.options.timeoutStore = window.setTimeout ( function () {
            document.getElementById ( "upload_additional_info" ).innerHTML = 'This is taking longer than usual.' + '<br />' + 'An error may have occurred.' + '<br /><a href="#" onClick="idowsFileBrowser.showIframe()">' + 'View script\'s output' + '</a>';
        }, 20000 );
    };


    /**
     * @description displays iframe message if upload file fails for some reason    
     * @returns {void}
     */
    this.showIframe = () => {
        $ ( "#upload_target" ).addClass ( 'upload_target_visible' );
        idowsFileBrowser.options.iframeOpened = true;
    };


    /**
     * @description show message after upload finished
     * @param {type} response
     * @returns {undefined}
     */
    this.uploadFinish = ( response ) => {
        let isFail = response.result === 'failed';

        if ( isFail ) {
            window.clearTimeout ( idowsFileBrowser.options.timeoutStore );
            $ ( "#upload_in_progress, #upload_infobar" ).css ( {
                display : 'none'
            } );
            $ ( "#upload_infobar" ).html ( response.result );
            $ ( "#upload_form_container" ).css ( {
                display : 'block'
            } );
        } else {
            $ ( "#upload_in_progress" ).css ( {
                display : 'none'
            } );
            $ ( "#upload_infobar" ).css ( {
                display : 'block'
            } ).html ( 'Upload Complete' );

            let w = idowsFileBrowser.getWin ();
            let tinymce = w.tinymce;
            tinymce.EditorManager.activeEditor.insertContent ( '<img src="' + response.filename + '">' );
            idowsFileBrowser.close ();
        }
    };


    /**
     * @description Switches between views, list and thumbnail
     * @param {JSON} switchOptions
     * @returns {void}
     */
    this.switchView = ( switchOptions ) => {

        let defaultSwitchOptions = {
            subfolder : '',
            sortBy : 'sort_name',
            sortOrder : 'ASC'
        };

        //set options for the switchview
        switchOptions = idowsFileBrowser.setDefaults ( switchOptions, defaultSwitchOptions );

        //add switch view even mappings
        let switchViewEvents = {

            'list' : function () {
                //update defaults for the idows file manager
                idowsFileBrowser.options = idowsFileBrowser.setDefaults ( {
                    currentDirectory : switchOptions.subfolder,
                    defaultView : switchOptions.view,
                    viewScript : 'listview',
                    phpViewScript : '/filemanager/listview'
                }, idowsFileBrowser.options );

                $ ( "#current_template" ).val ( switchOptions.view );
                $ ( "#thumbView" ).parent ().removeClass ( 'idows-active' );
                $ ( "#listView" ).parent ().addClass ( 'idows-active' );
                $ ( '#fileview' ).idowsFileList ( {
                    root : switchOptions.subfolder,
                    script : idowsFileBrowser.options.phpViewScript,
                    idowsFileBrowser : idowsFileBrowser,
                    viewType : switchOptions.view,
                    sortBy : switchOptions.sortBy,
                    sortOrder : switchOptions.sortOrder
                }, function ( file, li ) {

                    var filepath = file.split ( "/" );
                    var file_name = filepath[filepath.length - 1];

                    $ ( '#image_name' ).html ( file_name );
                    $ ( li ).parent ().siblings ().removeClass ( 'selected' );
                    $ ( li ).parent ().addClass ( 'selected' );
                } );
            },
            'thumbnail' : function () {
                //update defaults for the idows file manager
                idowsFileBrowser.options = idowsFileBrowser.setDefaults ( {
                    currentDirectory : switchOptions.subfolder,
                    defaultView : switchOptions.view,
                    viewScript : 'thumbview',
                    phpViewScript : '/filemanager/thumbview/'
                }, idowsFileBrowser.options );

                $ ( "#current_template" ).val ( switchOptions.view );
                $ ( "#thumbView" ).parent ().addClass ( 'idows-active' );
                $ ( "#listView" ).parent ().removeClass ( 'idows-active' );


                $ ( '#fileview' ).idowsFileList ( {
                    root : switchOptions.subfolder,
                    script : idowsFileBrowser.options.phpViewScript,
                    idowsFileBrowser : idowsFileBrowser,
                    viewType : switchOptions.view,
                    sortBy : switchOptions.sortBy,
                    sortOrder : switchOptions.sortOrder
                }, function ( file, li ) {
                    var filepath = file.split ( "/" );
                    var file_name = filepath[filepath.length - 1];

                    $ ( '#image_name' ).html ( file_name );
                    $ ( li ).parent ().siblings ().removeClass ( 'selected' );
                    $ ( li ).parent ().addClass ( 'selected' );
                } );
            }
        };

        //call the selected view event
        ( switchViewEvents.hasOwnProperty ( switchOptions.view ) ) && switchViewEvents[switchOptions.view].call ( this );


        //toggle setting menu
        idowsFileBrowser.toggleSettingsMenu ();
    };


    /**
     * @description search files filter
     * @param {type} keyword
     * @returns {undefined}
     */
    this.searchFilter = ( keyword ) => {
        let filterableFiles = $ ( '#fileview .idows-file,#fileview .idows-folder ' );
        let filterFilesFunction = ( filterableFiles.length ) && idowsFileBrowser.filterFiles;

        for ( var i = 0; i < filterableFiles.length; i++ ) {
            let elementRef = $ ( filterableFiles[i] );
            let filename = elementRef.attr ( 'title' );
            let isFilenameMatch = filename.indexOf ( keyword ) < 0;

            if ( isFilenameMatch ) {
                filterFilesFunction ( {
                    elem : elementRef,
                    position : 'absolute',
                    top : -1000
                } );
            } else {
                filterFilesFunction ( {
                    elem : elementRef,
                    position : 'relative',
                    top : 0
                } );
            }
        }
    };


    /**
     * @description filters files according to the selected view
     * @param {JSON} options
     * @returns {void}
     */
    this.filterFiles = ( options ) => {
        //is list view
        let isListView = idowsFileBrowser.options.defaultView == 'list';

        ( isListView ) ? options.elem.parent ().parent ().css ( {
            position : options.position,
            top : options.top
        } ) : options.elem.css ( {
            position : options.position,
            top : options.top
        } );
    };


    /**
     * @description Gets tinymce window manager instance
     * @returns {top.tinymce.activeEditor.windowManager|Window.tinymce.activeEditor.windowManager object}
     */
    this.tinyMCEWindowManager = function () {
        let editorDefined = top.tinymce !== undefined;
        return ( editorDefined ) ? top.tinymce.activeEditor.windowManager : null;
    };


    /**
     * @description Get current window frame object
     * @returns {top}
     */
    this.getWin = function () {
        return ( !window.frameElement && window.dialogArguments ) || opener || parent || top;
    };

    this.getQueryStringParam = function ( name = 'CKEditorFuncNum' ) {
        var regex = new RegExp ( '[?&]' + name + '=([^&]*)' ),
                result = window.location.search.match ( regex );

        return ( result && result.length > 1 ? decodeURIComponent ( result[1] ) : null );
    };

    /**
     * @description Closes the dialog window
     * @returns {undefined}
     */
    this.close = function () {
        var t = this;

        // To avoid domain relaxing issue in Opera
        function close () {
            tinymce.EditorManager.activeEditor.windowManager.close ( window );
            tinymce = tinyMCE = t.editor = t.params = t.dom = t.dom.doc = null; // Cleanup
        }

        ( tinymce.isOpera ) ? this.getWin ().setTimeout ( close, 0 ) : close ();
    };

    /**
     * @description mimics the php base name function for javascript to extrat the basemane from the given path
     * @param {text} path
     * @returns {basename}
     */
    this.basename = ( path ) => {
        return path.replace ( /\/+$/, "" ).replace ( /.*\//, "" );
    };

} ();
// idowsFileBrowser = new idowsFileBrowser();