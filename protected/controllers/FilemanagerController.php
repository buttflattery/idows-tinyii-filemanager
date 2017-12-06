<?php

/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 * 
 */
class FilemanagerController extends Controller {

    //Files to be ignored when iterating the directory
    private $ignoreFiles = [ 'root' => [ '.' , '..' , '.gitignore' ] , 'subfolder' => [ '.' , '.gitignore' ] ];
    public $editorAssets = '';

    public function beforeAction( $action ) {
        $isIndexAction = $action->id == 'index';

        if ( $isIndexAction ) {
            $isReferrerNotEmpty = Yii::app ()->request->urlReferrer !== null;

            if ( !Yii::app ()->user->isGuest && Yii::app ()->user->isAdmin () ) {
                $this->editorAssets = Yii::app ()->getBaseUrl ( true ) . Yii::app ()->session['editorAssets'] = Yii::app ()->params['PLUGIN_DIR'];
                return true;
            }
            
            if ( $isReferrerNotEmpty ) {
                $editorType = $_GET['editor'];
                $isRedactorJs = $editorType == '_RA';
                $isCKEditor = $editorType == '_CK';
                $isTinyMCE = $editorType == '';
                
                if ( $isRedactorJs ) {
                    $this->editorAssets = Yii::app ()->getBaseUrl ( true ) . Yii::app ()->session['editorAssets'] = Yii::app ()->booster->getAssetsUrl () . DIRECTORY_SEPARATOR . 'redactor' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR . 'idowsfilemanager';
                    return true;
                    //$this->editorAssets = Yii::app ()->booster->getAssetsUrl () . DIRECTORY_SEPARATOR . 'redactor' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR . 'idowsfilemanager';
                } else if ( $isCKEditor || $isTinyMCE ) {
                    $this->editorAssets = Yii::app ()->getBaseUrl ( true ) . Yii::app ()->session['editorAssets'] = Yii::app ()->params['PLUGIN_DIR' . $editorType];
                    //$this->editorAssets = Yii::app ()->params['PLUGIN_DIR' . $editorType];
                    return true;
                }
            }
            throw new Exception ( 'Direct Access Restricted, you need to be logged-in as an admin.' );
        }
        $this->editorAssets = Yii::app ()->session['editorAssets'];
        return true;
    }

    /**
     * File Browser
     */
    public function actionFileBrowser() {
        $this->renderPartial ( '/file-browser/browser' );
    }

    /**
     * actionThumbView : Displays directory structure in thumbnail view
     * @param type $sortBy
     * @return type
     */
    public function actionThumbView() {

        //actual root for uploads
        $mainRoot = $this->getRealPathUploadDir ();

        //get post params
        list($sortBy , $targetDirectory , $sortOrder) = $this->getParams ();

        //scan directory for files and folders
        $itemList = scandir ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . $targetDirectory ) );

        //if the target directory and the root directory is the same then dont
        //populate . & .. else populate .. to go back
        //get filtered files and folders from the ignore case array
        //get files and folders list along with the .. to make the back link
        $itemList = ( basename ( $targetDirectory ) == basename ( $mainRoot ) ) ? $this->getFilteredArray ( $itemList ) : $this->getFilteredArray ( $itemList , false );

        //sort the items in the array
        $sortedItemList = $this->sortItems ( $sortBy , $sortOrder , $targetDirectory , $itemList );
        $key = array_search ( '..' , $sortedItemList );

        if ( $key > 0 ) {
            unset ( $sortedItemList[$key] );
            array_unshift ( $sortedItemList , '..' );
        }

        $this->renderPartial ( 'thumb-view' , [
            'itemList' => $sortedItemList ,
            'targetDirectory' => $targetDirectory ,
            'mainRoot' => $mainRoot
                ] , false , true );
    }

    /**
     * actionListview: Display directory structure in list view 
     */
    public function actionListview() {
        //actual root for uploads
        $mainRoot = $this->getRealPathUploadDir ();

        //get post params
        list($sortBy , $targetDirectory , $sortOrder) = $this->getParams ();

        //scan directory for files and folders
        $itemList = scandir ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . $targetDirectory ) );

        //if the target directory and the root directory is the same then dont
        //populate . & .. else populate .. to go back
        //get filtered files and folders from the ignore case array or else 
        //get files and folders list along with the .. to make the back link
        $itemList = ( basename ( $targetDirectory ) == basename ( $mainRoot ) ) ? $this->getFilteredArray ( $itemList ) : $this->getFilteredArray ( $itemList , false );

        //sort the items in the array
        $sortedItemList = $this->sortItems ( $sortBy , $sortOrder , $targetDirectory , $itemList );
        $key = array_search ( '..' , $sortedItemList );

        if ( $key > 0 ) {
            unset ( $sortedItemList[$key] );
            array_unshift ( $sortedItemList , '..' );
        }

        $this->renderPartial ( 'list-view' , [
            'itemList' => $sortedItemList ,
            'targetDirectory' => $targetDirectory ,
            'mainRoot' => $mainRoot
                ] , false , true );
    }

    /**
     * actionAddfolder : Action For creating a folder in the upload root directory
     * @return type
     */
    public function actionAddfolder() {
        //new folder form model instance
        $model = new TinyiiFolderForm();

        //disable layout
        $this->layout = false;

        // validate ajax request
        $this->ajaxValidation ( $model );

        $isPost = isset ( $_POST['TinyiiFolderForm'] );
        $isAjax = Yii::app ()->request->isAjaxRequest;


        //if post then create folder
        if ( $isPost ) {
            $response['success'] = false;
            $response['message'] = '';

            //assign model attributes
            $model->attributes = $_POST['TinyiiFolderForm'];

            try {
                //create folder
                $this->createFolder ( $model->name , ($model->current_dir_name !== '') ? $model->current_dir_name : false  );

                // //set success flash message
                // Yii::app ()->user->setFlash ( 'success' , 'Folder created successfully.' );

                $response['success'] = true;
                $response['message'] = 'Folder created successfully';

                echo CJSON::encode ( $response );
                Yii::app ()->end ();
            } catch ( Exception $ex ) {

                // //if error then add to form model and display on form
                $response['message'] = $ex->getMessage ();
                echo CJSON::encode ( $response );
                Yii::app ()->end ();
                // $error = CJSON::decode ( $ex->getMessage () );
                // $model->addError ( key ( $error ) , $error[key ( $error )] );
            }
        }

        return $this->render ( 'add-folder' , [ 'model' => $model ] );
    }

    /**
     * actionUploadAssets(): Uploads files to the directory
     */
    public function actionUploadAssets() {
        $this->layout = false;
        $data = array();
        $model = new TinyiiAssetUploadForm();

        $imagePath = $this->getRealPathUploadDir ();
        $model->attributes = $_POST['TinyiiAssetUploadForm'];
        $model->userfile = CUploadedFile::getInstance ( $model , 'userfile' );

        try {
            $model->userfile->saveAs ( $imagePath . DIRECTORY_SEPARATOR . $model->userfile->name );

            $data['result'] = 'Success';
            $data['result_code'] = 'File Uploaded Successfully';
            $data['file_name'] = urlencode ( str_replace ( "\\" , "/" , Yii::app ()->params['UPLOAD_DIR'] . '/' . $model->userfile->name ) );
        } catch ( Exception $ex ) {
            $data['result'] = 'Failed';
            $data['result_code'] = $ex->getMessage ();
            $data['file_name'] = $model->userfile->name;
        }


        $this->renderPartial ( 'results' , $data , false , true );
    }

    /**
     * Index main Entry Action for filemanager
     * Opens Main modal window for the file manager
     */
    public function actionIndex() {
        $model = new TinyiiAssetUploadForm();
        $uploadDir = str_replace ( "\\" , "/" , Yii::app ()->basePath . '/..' . Yii::app ()->params['UPLOAD_DIR'] );
        $uploadDirExists = is_dir ( realpath ( $uploadDir ) );

        if ( !$uploadDirExists ) {
            throw new Exception ( 'The upload directory you specified in your param file does not exist.' . $uploadDir );
        }
        $this->renderPartial ( 'dialog' , array( 'model' => $model ) , false , true );
    }

    /**
     * actionBlank : for Uploading with iframe
     */
    public function actionBlank() {
        $this->renderPartial ( 'blank' , array() , true , false );
    }

    /**
     * actionRemovefile : removes file if the user is logged in
     * @return type
     */
    public function actionRemovefile() {
        if ( Yii::app ()->request->isPostRequest ) {
            $result['success'] = false;

            //if not logged in then restrict delete operation
            if ( Yii::app ()->user->isGuest ) {
                echo json_encode ( [ 'success' => false , 'message' => 'You need to be logged in to perform this action' ] );
                Yii::app ()->end ();
            }

            $files = Yii::app ()->request->getPost ( 'selectable_files' );
            foreach ( $files as $file ) {
                $path = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . $file );
                $fileExists = file_exists ( $path );

                if ( $fileExists ) {
                    $result = $this->deleteFile ( $path );
                } else {
                    $result['message'] = 'File not found : ' . $path;
                }
            }

            echo json_encode ( $result );
        }
    }

    /**
     * actionRemovefolder : Action for delete directory
     * @return type
     */
    public function actionRemovefolder() {
        if ( Yii::app ()->request->isPostRequest ) {
            $path = $_POST['folder'];
            $result['success'] = false;

            //if not logged in then restrict delete operation
            if ( Yii::app ()->user->isGuest ) {
                echo json_encode ( [ 'success' => false , 'message' => 'You need to be logged in to perform this action' ] );
                Yii::app ()->end ();
            }
            if ( $this->deleteDirectory ( $path ) ) {
                $result['success'] = true;
                $result['message'] = 'Directory removed successfully';
            } else {
                $result['message'] = 'Unable to remove the directory';
            }
            echo json_encode ( $result );
        }
    }

    /**
     * actionMovefile : Moves (CUT / PASTE) a file to the folder
     */
    public function actionMovefile() {
        if ( Yii::app ()->request->isAjaxRequest ) {
            $response['success'] = false;
            $root = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '../' );

            $fileName = Yii::app ()->request->getPost ( 'fileName' );
            $folderName = Yii::app ()->request->getPost ( 'folder' );

            $filePath = realpath ( $root . Yii::app ()->params['UPLOAD_DIR'] . $fileName );
            $folderPath = realpath ( $root . DIRECTORY_SEPARATOR . $folderName );

            $movedfile = $folderPath . DIRECTORY_SEPARATOR . basename ( $fileName );


            try {
                $dirAndFileExists = is_dir ( $folderPath ) && file_exists ( $filePath );

                if ( $dirAndFileExists ) {
                    rename ( $filePath , $movedfile );
                    $response['success'] = true;
                    $response['message'] = 'File moved successfully';
                }
            } catch ( Exception $ex ) {
                $response['message'] = $ex->getMessage ();
            }
            echo json_encode ( $response );
        }
        Yii::app ()->end ();
    }

    /**
     * actionGetContextMenuOperation():registers operations like copy cut 
     * delete used from the context menu
     */
    public function actionSetContextMenuCommand() {
        $response['success'] = false;
        if ( isset ( $_POST['selectable_files'] ) ) {
            $command = $_POST['command'];
            $response['success'] = false;
            $response['message'] = 'No command supplied to the context menu.';

            $contextMenuCommands = [
                'cp' => function() {
                    Yii::app ()->session['command'] = 'cp';
                    Yii::app ()->session['files'] = $_POST['selectable_files'];

                    $response['success'] = true;
                    $response['message'] = 'File copied to the clipboard.';
                    return $response;
                } ,
                'cpf' => function() {
                    Yii::app ()->session['command'] = 'cpf';
                    Yii::app ()->session['files'] = $_POST['selectable_files'];

                    $response['success'] = true;
                    $response['message'] = 'Folder copied to the clipboard.';
                    return $response;
                } ,
                'mv' => function() {
                    Yii::app ()->session['command'] = 'mv';
                    Yii::app ()->session['files'] = $_POST['selectable_files'];

                    $response['success'] = true;
                    $response['message'] = 'File copied to the clipboard.';
                    return $response;
                } ,
                'del' => function() {
                    Yii::app ()->session['command'] = 'del';
                    Yii::app ()->session['files'] = $_POST['selectable_files'];
                    $response['success'] = true;
                    $response['message'] = 'File copied to the clipboard.';
                    return $response;
                }
            ];
            !array_key_exists ( $command , $contextMenuCommands ) ?: $response = $contextMenuCommands[$command] ();
        }
        echo CJSON::encode ( $response );
    }

    /**
     * actionRunContextMenuCommand : Adds a context menu command operation to the session variable
     */
    public function actionRunContextMenuCommand() {
        if ( isset ( $_POST['destination'] ) ) {
            $root = $this->getRealPathUploadDir ();
            $destination = $root . (($_POST['destination'] == '') ? '' : '/' . $_POST['destination']);

            $response['success'] = false;
            $response['message'] = 'Invalid Command Supplied.';

            $command = Yii::app ()->session['command'];

            $commandExecutionEvents = [
                'cp' => function($root , $destination) {
                    $response['success'] = false;
                    $response['message'] = 'Some files were not copied.';

                    if ( ($r = $this->copyFiles ( $root , $destination )) === true ) {
                        $response['success'] = true;
                        $response['message'] = 'All files copied successfully';
                    }

                    return $response;
                } ,
                'cpf' => function($root , $destination) {
                    $response['success'] = false;
                    $response['message'] = 'Some files were not copied.';

                    if ( ($r = $this->copyFolder ( $root , $destination )) === true ) {
                        $response['success'] = true;
                        $response['message'] = 'All files copied successfully';
                    }

                    return $response;
                } ,
                'mv' => function( $root , $destination) {
                    $response['success'] = false;
                    $response['message'] = 'Some files were not moved.';

                    if ( ($r = $this->moveFiles ( $root , $destination )) === true ) {
                        $response['success'] = true;
                        $response['message'] = 'All files moved successfully';
                    }

                    return $response;
                }
            ];

            !array_key_exists ( $command , $commandExecutionEvents ) ?: $response = $commandExecutionEvents[$command] ( $root , $destination );

            echo CJSON::encode ( $response );
        }
    }

    /**
     * actionZipFile : zips file before downloading
     */
    public function actionZipFile() {
        $response['success'] = false;

        if ( Yii::app ()->request->isPostRequest ) {
            $files = $_POST['selectable_files'];
            try {
                $filename = $this->zipFiles ( $files );
                $response['success'] = true;
                $response['message'] = 'Zip file ready to download.';
                $response['filename'] = $filename;
            } catch ( Exception $e ) {
                $response['success'] = false;
                $response['message'] = $e->getMessage ();
            }
            echo CJSON::encode ( $response );
        }
        Yii::app ()->end ();
    }

    /**
     * actionDownloadZip :  Downloads the zip file
     * @param type $filename
     */
    public function actionDownloadZip( $filename ) {

        $filepath = Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'tmp' . DIRECTORY_SEPARATOR . $filename;

        //set necessary headers for download
        header ( 'Content-Description: File Transfer' );
        header ( 'Content-Type: application/octect-stream' );
        header ( 'Content-Disposition: attachment; filename="' . basename ( $filename ) . '"' );
        header ( 'Expires: 0' );
        header ( "Pragma: public" );
        header ( "Cache-Control: must-revalidate, post-check=0, pre-check=0" );
        header ( 'Content-Length: ' . filesize ( $filepath ) );
        set_time_limit ( 0 );

        $file = fopen ( $filepath , "rb" );
        while ( !feof ( $file ) ) {
            print(fread ( $file , 1024 * 8 ) );
            ob_flush ();
            flush ();
        }
        unlink ( $filepath );
    }

    /**
     * actionRenameFile :  Renames a file 
     * @throws Exception
     */
    public function actionRenameFile() {
        //new folder form model instance
        $model = new TinyiiRenameForm();
        $response['success'] = false;


        //disable layout
        $this->layout = false;

        // validate ajax request
        $this->ajaxValidation ( $model );

        //if post then create folder
        if ( isset ( $_POST['TinyiiRenameForm'] ) ) {

            //assign model attributes
            $model->attributes = $_POST['TinyiiRenameForm'];


            if ( $model->validate () ) {

                try {
                    if ( is_dir ( $this->getRealPathUploadDir () . $model->old_file_name ) ) {

                        //check if directory and initialize folder paths new and old        
                        $fileInfo = pathinfo ( $this->getRealPathUploadDir () . $model->old_file_name );

                        $old_file_name = $this->getRealPathUploadDir () . $model->old_file_name;
                        $new_file_name = $fileInfo['dirname'] . DIRECTORY_SEPARATOR . $model->name;
                    } elseif ( file_exists ( $this->getRealPathUploadDir () . $model->old_file_name ) ) {

                        //check if file and initialize file paths new and old
                        $fileInfo = pathinfo ( $this->getRealPathUploadDir () . $model->old_file_name );

                        $old_file_name = $this->getRealPathUploadDir () . $model->old_file_name;
                        $new_file_name = $fileInfo['dirname'] . DIRECTORY_SEPARATOR . $model->name . '.' . $fileInfo['extension'];
                    } else {

                        // throw exception if none of the above
                        throw new Exception ( 'Unable to find the file or folder you are trying to rename.' );
                    }

                    //rename file / folder
                    if ( ($a = rename ( realpath ( $old_file_name ) , $new_file_name )) !== true ) {
                        throw new Exception ( 'Unable to rename file / folder' );
                    }

                    //set success flash message
                    $response['success'] = true;
                    $response['message'] = 'File / Folder renamed successfully.';
                    echo CJSON::encode ( $response );
                    Yii::app ()->end ();
                    // Yii::app ()->user->setFlash ( 'success' , '' );
                } catch ( Exception $ex ) {

                    //if error then add to form model and display on form
                    $response['message'] = $ex->getMessage ();
                    CJSON::encode ( $response );
                    Yii::app ()->end ();
                    //$model->addError ( key ( $error ) , $error[key ( $error )] );
                }
            }
        }
        $this->render ( 'rename-file' , [ 'model' => $model ] );
    }

    /**
     * actionPreviewZip: Previews zip file contents
     */
    public function actionPreviewZip() {
        if ( isset ( $_POST ) ) {
            $basepath = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR );
            $file = $_POST['file'];
            $filePath = $basepath . $file;

            $za = new ZipArchive();
            $za->open ( $filePath );

            for ( $i = 0; $i < $za->numFiles; $i++ ) {
                $stat = $za->statIndex ( $i );

                $fileList[] = [
                    'name' => basename ( $stat['name'] ) ,
                    'icon' => Helper::_mime_content_type ( 'zip://' . $filePath . '#' . $za->getNameIndex ( $i ) , true , 'list' ) ,
                    'size' => $stat['size'] ,
                    'type' => Helper::_mime_content_type ( 'zip://' . $filePath . '#' . $za->getNameIndex ( $i ) , false ) ,
                    'size_compressed' => $stat['comp_size'] ,
                    'created_on' => date ( 'd M Y' , $stat['mtime'] )
                ];
            }
            $this->renderPartial ( 'zip-list' , [ 'files' => $fileList , 'zip' => basename ( $file ) ] );
        }
    }

    //====================================================================================================================================================================================================

    /**
     * 
     * @param type $files
     * @return type
     */
    protected function zipFiles( $files ) {

        //set root directory for download
        $root = $this->getRealPathUploadDir ();

        //set zip file name for download
        $filename = md5 ( 'file' ) . '.zip';

        //check if temp directory exists for the zip file
        (file_exists ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'tmp' )) ?: mkdir ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'tmp' , 0755 );


        //zip file name with path
        $zipname = Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'tmp' . DIRECTORY_SEPARATOR . $filename;

        //start adding the files into the zip archive
        $zip = new ZipArchive;

        //open zip archive 
        $zip->open ( $zipname , ZipArchive::CREATE | ZipArchive::OVERWRITE );

        //iterate all files selectewd to zip
        foreach ( $files as $file ) {
            $zip->addFile ( realpath ( $root . DIRECTORY_SEPARATOR . $file ) , basename ( $file ) );
        }

        //close the zip file
        $zip->close ();

        //return zip archive name without path
        return basename ( $zipname );
    }

    /**
     * 
     * @param type $root
     * @param type $destination
     * @return type
     */
    protected function copyFolder( $root , $destination ) {
        $errors = false;
        $index = 0;
        $clipboardItems = Yii::app ()->session['files'];


        foreach ( $clipboardItems as $folder ) {
            $source = realpath ( $root . DIRECTORY_SEPARATOR . $folder );
            $des = $destination . DIRECTORY_SEPARATOR . basename ( $folder );
            if ( !($r = $this->xcopy ( $source , $des )) ) {
                $errors = true;
            }
            unset ( $clipboardItems[$index] );
            $index++;
        }
        return ($errors) ? $r : true;
    }

    /**
     * Copy a file, or recursively copy a folder and its contents
     * @param       string   $source    Source path
     * @param       string   $dest      Destination path
     * @param       int      $permissions New folder creation permissions
     * @return      bool     Returns true on success, false on failure
     */
    protected function xcopy( $source , $dest , $permissions = 0755 ) {
        try {
            // Check for symlinks
            if ( is_link ( $source ) ) {
                return symlink ( readlink ( $source ) , $dest );
            }
            // Simple copy for a file
            if ( is_file ( $source ) ) {
                return copy ( $source , $dest );
            }

            // Make destination directory
            if ( !is_dir ( $dest ) ) {
                mkdir ( $dest , $permissions );
            }

            // Loop through the folder
            $dir = dir ( $source );
            while ( false !== $entry = $dir->read () ) {
                // Skip pointers
                if ( $entry == '.' || $entry == '..' ) {
                    continue;
                }

                // Deep copy directories
                $this->xcopy ( "$source/$entry" , "$dest/$entry" , $permissions );
            }

            // Clean up
            $dir->close ();
            return true;
        } catch ( Exception $ex ) {
            return $ex->getMessage ();
        }
    }

    /**
     * 
     * @param type $root
     * @param type $destination
     * @return type
     */
    protected function copyFiles( $root , $destination ) {
        $errors = false;
        $index = 0;
        $clipboardItems = Yii::app ()->session['files'];

        foreach ( $clipboardItems as $file ) {
            $source = realpath ( $root . DIRECTORY_SEPARATOR . $file );
            $des = $destination . DIRECTORY_SEPARATOR . basename ( $file );

            if ( ($r = copy ( $source , $des )) !== true ) {
                $errors = true;
            }
            unset ( $clipboardItems[$index] );
            $index++;
        }

        return ($errors) ? $r : true;
    }

    /**
     * 
     * @param type $root
     * @param type $destination
     * @return type
     */
    protected function moveFiles( $root , $destination ) {
        $errors = false;
        $index = 0;
        $clipboardItems = Yii::app ()->session['files'];
        foreach ( $clipboardItems as $file ) {
            $source = realPath ( $root . DIRECTORY_SEPARATOR . $file );
            $des = $destination . DIRECTORY_SEPARATOR . basename ( $file );

            if ( ($r = rename ( $source , $des )) !== true ) {
                $errors = true;
            }
            unset ( $clipboardItems[$index] );
            $index++;
        }
        return ($errors) ? $r : true;
    }

    /**
     * getRealPathUploadDir: returns absolute path to the upload folder
     * @return type
     */
    protected function getRealPathUploadDir() {
        return realPath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR );
    }

    /**
     * getFilteredArray : Filters directory files array to remove backlinks (. & .. )
     * and special files while listing the directory.
     * @param type $itemList
     * @param type $isRoot
     * @return type
     */
    private function getFilteredArray( $itemList , $isRoot = true ) {
        return ( $isRoot ) ? array_filter ( $itemList , function ($val) {
                    return ((!in_array ( $val , $this->ignoreFiles['root'] )) ? $val : '');
                } ) : array_filter ( $itemList , function ($val) {
                    return ((!in_array ( $val , $this->ignoreFiles['subfolder'] )) ? $val : '');
                } );
    }

    /**
     * sortByDate : Sorts files and folders list by Date Modified depending
     * on the sort order provided,
     * @param type $targetDirectory
     * @param type $sortOrder
     * @param type $itemList
     * @return type
     */
    private function sortByDate( $targetDirectory , $sortOrder , $itemList = array() ) {
        $fileInfoArray = array();
        foreach ( $itemList as $item ) {
            $filePath = realpath ( Yii::app ()->basePath . '/../' . $targetDirectory . DIRECTORY_SEPARATOR . $item );
            $fileInfoArray[filemtime ( $filePath )] = $item;
        }
        //sort descending
        ksort ( $fileInfoArray );

        //sort ascending
        ($sortOrder == 'DESC') ?: krsort ( $fileInfoArray );

        return $fileInfoArray;
    }

    /**
     * sortBySize : Sorts file and folders list by size depending on the sort
     * order provided.
     * @param type $targetDirectory
     * @param type $sortOrder
     * @param type $itemList
     * @return type
     */
    private function sortBySize( $targetDirectory , $sortOrder , $itemList ) {

        $fileInfoArray = array();
        //iterate all files and create array indexed on the size of the file
        foreach ( $itemList as $item ) {
            $filePath = realpath ( Yii::app ()->basePath . '/../' . $targetDirectory . DIRECTORY_SEPARATOR . $item );
            $fileInfoArray[filesize ( $filePath )] = $item;
        }

        //sort files ascending
        ksort ( $fileInfoArray );

        //sort descending if the order specified
        ($sortOrder == 'DESC') ?: krsort ( $fileInfoArray );

        return $fileInfoArray;
    }

    /**
     * sortItems : Sort file and folders by name date amd size.
     * @param type $sortBy
     * @param type $sortOrder
     * @param type $targetDirectory
     * @param type $itemList
     * @return type
     */
    private function sortItems( $sortBy , $sortOrder , $targetDirectory , $itemList ) {
        $sortEvents = [
            'sort_date' => function($sortOrder , $itemList , $targetDirectory) {
                return $this->sortByDate ( $targetDirectory , $sortOrder , $itemList );
            } ,
            'sort_size' => function($sortOrder , $itemList , $targetDirectory) {
                return $this->sortBySize ( $targetDirectory , $sortOrder , $itemList );
            } ,
            'sort_name' => function($sortOrder , $itemList) {
                sort ( $itemList );
                $isSortDesc = $sortOrder == 'DESC';
                (!$isSortDesc) ?: rsort ( $itemList );
                return $itemList;
            }
        ];

        $itemList = (!array_key_exists ( $sortBy , $sortEvents )) ?: $sortEvents[$sortBy] ( $sortOrder , $itemList , $targetDirectory );

        return $itemList;
    }

    /**
     * getParams : Gets post params for the directory listing
     * @return type
     */
    private function getParams() {
        //get the request object
        $request = Yii::app ()->request;
        $isDirNotEmpty = ($request->getPost ( 'dir' ) !== '');

        //target directory to be opened
        $targetDirectory = ($isDirNotEmpty) ? urldecode ( $request->getPost ( 'dir' ) ) : Yii::app ()->params['UPLOAD_DIR'];

        //get sort by variable else set default sort_name
        $sortBy = $request->getPost ( 'sortBy' , 'sort_name' );

        //get sort order for the list else set default order ASC
        $sortOrder = $request->getPost ( 'sortOrder' , 'ASC' );

        return [ $sortBy , $targetDirectory , $sortOrder ];
    }

    /**
     * createFolder : This method creates a folder on root or the parent directory provided
     * @param type $name
     * @param type $parentDirectory
     */
    protected function createFolder( $name , $parentDirectory = false ) {

        //create physical path for the root directory of upload
        $mainRoot = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR );

        //switch statement to determine if the requet was for a root folder or
        //subdirectory folder
        if ( !$parentDirectory ) {
            //add a root folder
            $this->addFolderOnly ( $mainRoot , $name );
        } elseif ( strlen ( $parentDirectory ) > 0 ) {
            //add a folder in a subdirectory
            $this->addDirectory ( $mainRoot , $parentDirectory , $name );
        }
    }

    /**
     * addDirectory : Actual method which creates a directory in the provided directory under the root folder
     * folder of upload directory
     * @param type $mainRoot
     * @param type $parentDirectory
     * @param type $name
     * @throws Exception
     */
    protected function addDirectory( $mainRoot , $parentDirectory , $name ) {

        $newFolderPath = urldecode ( $mainRoot . DIRECTORY_SEPARATOR . $parentDirectory . DIRECTORY_SEPARATOR . $name );
        $isDirectoryExist = is_dir ( realpath ( urldecode ( $mainRoot . DIRECTORY_SEPARATOR . $parentDirectory ) ) );

        //check if the folder exists
        $this->folderExists ( $newFolderPath );

        //check if directory doesnot exist already
        if ( $isDirectoryExist ) {
            //create a directory
            //update premissions fo the directory
            ( false === (mkdir ( $newFolderPath )) ) ?: chmod ( $newFolderPath , 0777 );
        } else {
            //throw an exception if the directory exists
            throw new Exception ( "Cannot create folder under the directory you specified, make sure it exists under the root of upload directory." );
            // throw new Exception ( "{\"message\":\"Cannot create folder under the directory you specified, make sure it exists under the root of upload directory.\"}" );
        }
    }

    /**
     * folderExists : This method checks if a directory exists already
     * @param type $directory
     * @throws Exception
     */
    protected function folderExists( $directory ) {
        if ( is_dir ( $directory ) ) {
            throw new Exception ( "Folder with the same name already exists." );
            // throw new Exception ( "{\"name\":\"Folder with the same name already exists.\"}" );
        }
    }

    /**
     * addFolderOnly : Creates a folder on the root
     * @param type $mainRoot
     * @param type $name
     * @throws Exception
     */
    protected function addFolderOnly( $mainRoot , $name ) {
        $newFolderPath = $mainRoot . DIRECTORY_SEPARATOR . $name;

        //check if the folder already exits
        $this->folderExists ( $newFolderPath );

        //if directory / folder created successfully
        if ( true === ($error = mkdir ( $newFolderPath , 0777 , true )) ) {
            //update permissions for the directory
            chmod ( $newFolderPath , 0777 );
        } else {
            //throw an exception if the directory was not created and show error details
            throw new Exception ( "Failed to create folder {$error}" );
            // throw new Exception ( "{\"message\":\"Failed to create folder $error\"}" );
        }
    }

    /**
     * ajaxValidation : This methods performs the ajax validation of the form
     * @param type $model
     */
    protected function ajaxValidation( &$model ) {
        // enable ajax-based validation
        if ( isset ( $_POST['ajax'] ) && $_POST['ajax'] === 'folder-form' ) {
            echo CActiveForm::validate ( $model );
            Yii::app ()->end ();
        }
    }

    /**
     *
     * @param type $path
     * @return string
     */
    private function deleteFile( $path ) {
        $fileRemoved = unlink ( $path );
        $result['success'] = false;
        $result['message'] = 'Unable to remove the file';
        if ( $fileRemoved ) {
            $result['success'] = true;
            $result['message'] = 'File removed successfully';
        }
        return $result;
    }

    /**
     * deleteDirectory : Delete a directory recursively
     * @param type $path
     * @return boolean
     */
    protected function deleteDirectory( $path ) {
        $isDirectory = is_dir ( $this->getRealPathUploadDir () . $path ) === true;
        if ( $isDirectory ) {
            $files = new RecursiveIteratorIterator ( new RecursiveDirectoryIterator ( $this->getRealPathUploadDir () . $path ) , RecursiveIteratorIterator::CHILD_FIRST );

            foreach ( $files as $file ) {
                $isNotDotDirectory = in_array ( $file->getBasename () , array( '.' , '..' ) ) !== true;
                if ( $isNotDotDirectory ) {
                    $isDirectory = $file->isDir () === true;
                    ( $isDirectory ) ? rmdir ( $file->getPathName () ) : ( ($file->isFile () !== true) && ($file->isLink () !== true) ) ?: unlink ( $file->getPathname () );
                }
            }

            return rmdir ( $this->getRealPathUploadDir () . $path );
        } elseif ( (is_file ( $this->getRealPathUploadDir () . $path ) === true) || (is_link ( $this->getRealPathUploadDir () . $path ) === true) ) {
            return unlink ( $this->getRealPathUploadDir () . $path );
        }

        return false;
    }

    public function actionTest() {
        return $this->renderPartial ( 'test' , [] , false , true );
    }

}
