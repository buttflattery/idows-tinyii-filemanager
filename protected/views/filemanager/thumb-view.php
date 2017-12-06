<?php
/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x Framework
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com 
 * @Version: 1.0
 */
$subDirectory = array_filter ( explode ( DIRECTORY_SEPARATOR , str_replace ( $mainRoot , '' , realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . $targetDirectory ) ) ) );
$previousDirLink = str_repeat ( '..' . DIRECTORY_SEPARATOR , sizeof ( $subDirectory ) );
?>

<!-- BREAD CRUMB -->
<div class="idows-breadcrumbs">
    <span data-dir="<?= Yii::app ()->params['UPLOAD_DIR'] ?>"><i class="idows-ico idows-i-folder"></i>&nbsp;Home</span>&nbsp;/
    <?php
    foreach ( $subDirectory as $dir ) {
        $previousDirLink = Helper::str_replace_first ( '..' . DIRECTORY_SEPARATOR , '' , $previousDirLink );
        $basePath = Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR;
        $fullPath = realpath ( $basePath . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $previousDirLink );
        $dirLink = str_replace ( realpath ( $basePath ) , '' , $fullPath );
        ?>
        <a data-dir="<?= $dirLink ?>"><i class="idows-ico idows-i-folder"></i>&nbsp;<?= $dir ?></a>&nbsp;/
    <?php } ?>
</div>
<?php
$count = 0;
echo CHtml::hiddenField ( 'sub_directory' , implode ( DIRECTORY_SEPARATOR , $subDirectory ) );
//iterate all the files an folder and apply html formating
foreach ( $itemList as $sort => $item ) {

    if ( is_dir ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . $targetDirectory . DIRECTORY_SEPARATOR . $item ) ) && $item !== '..' ) {
        $itempath = Yii::app ()->getBaseUrl ( true ) . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item;
        ?>
        <!--        DISPLAY FOLDERS-->
        <div title = "<?= htmlentities ( str_replace ( $mainRoot , '' , $targetDirectory ) . DIRECTORY_SEPARATOR . $item . DIRECTORY_SEPARATOR ) ?>"
             data-id = "<?= htmlentities ( DIRECTORY_SEPARATOR . ((!empty ( $subDirectory )) ? implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR : '') . $item ) ?>" class = "idows-thumb idows-folder" id="folder_<?= $count ?>">

            <div class = "controls">
                <a title = "Delete_Folder" href = "#." data-img = "<?= htmlentities ( $itempath ) ?>"><i class="idows-ico idows-i-delete"></i></a>
                <span></span>
            </div>
            <a href="#." class="folderView">
                <i class="idows-ico idows-thumb idows-i-folder"></i>
                <div class="idows-info"><?= htmlentities ( $item ) ?></div>
            </a>

        </div>
        <?php
    } else if ( $item == '..' ) {
        
        $previousFolder = realpath(Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . $targetDirectory.  DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR );
        $previousDir = str_replace ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR ) , '' , $previousFolder );
        ?>
        <!--        DISPLAY BACK LINK-->
        <div title = "<?= $previousDir ?>"  class = "idows-thumb back-link">
            <a href="#." class="folderView">
                <i class="idows-ico idows-thumb idows-i-back"></i>
                <div class="idows-info">Previous Directory</div>
            </a>
        </div>
        <?php
    } else {
        $ext = preg_replace ( '/^.*\./' , '' , $item );
        $itemUrl = Yii::app ()->getBaseUrl ( true ) . str_replace ( "\\" , "/" , Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item );
        $itempath = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item );
        $fileIcon = Helper::_mime_content_type ( $itempath , false );
        $fileType = Helper::_mime_content_type ( $itempath , false , 'list' );
        ?>

        <!--        DISPLAY ALL FILES-->
        <div class = "idows-thumb idows-file" title = "<?= $item ?>" data-ext="<?= $ext ?>"
             data-id = "<?= htmlentities ( DIRECTORY_SEPARATOR . ((!empty ( $subDirectory )) ? implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR : '') . $item ) ?>"  id="pic_<?= $count ?>">
                 <?php if ( $fileIcon == 'image' ) { ?>
                <div class="l-image showLoadingIcon">
                    <img src="<?= $this->editorAssets ?>/css/filetree/images/image.png" alt="" title="" />
                </div>
                <?php
            } else {
                echo $fileIcon;
            }
            ?>
            <span data-action="<?= $fileType ?>" data-src="<?= (($fileType == 'zip') ? str_replace ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR ) , '' , $itempath ) : $itemUrl) ?>"></span>
            <div class = "idows-info">
                <i class="idows-ico idows-i-checkbox"></i>
                <?= CHtml::checkBox ( 'selectable_files[]' , false , array( 'id' => 'file_' . $count , 'style' => 'display:none;' , 'class' => 'selectable_files' , 'value' => implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item ) ); ?>
                <?= CHtml::label ( $item , '' ); ?>
            </div>
        </div>
        <?php
        echo '<script type="text/javascript">jQuery("#pic_' . $count . ' div.showLoadingIcon").nailthumb({width:128,height:128,method:\'resize\',fitDirection:\'center center\',animationTime:1000,replaceAnimation:\'animate\',titleAttr:\'\',imageUrl: \'' . str_replace ( '\\' , '/' , $itemUrl ) . '\'});</script>';
        ?>
        <?php
    }
    $count++;
}
?>
