<?php
/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 */
$subDirectory = array_filter ( explode ( DIRECTORY_SEPARATOR , str_replace ( $mainRoot , '' , realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . $targetDirectory ) ) ) );
$previousDir = str_repeat ( '..' . DIRECTORY_SEPARATOR , sizeof ( $subDirectory ) );
?>

<!-- BREAD CRUMB -->
<div class="idows-breadcrumbs">
    <span data-dir="<?= Yii::app ()->params['UPLOAD_DIR'] ?>"><i class="idows-ico idows-i-folder"></i>&nbsp;Home</span>&nbsp;/
    <?php
    foreach ( $subDirectory as $dir ) {
        $previousDir = Helper::str_replace_first ( '..' . DIRECTORY_SEPARATOR , '' , $previousDir );
        $basePath = Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR;
        $fullPath = realpath ( $basePath . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $previousDir );
        $dirLink = str_replace ( realpath ( $basePath ) , '' , $fullPath );
        ?>
        <a data-dir="<?= $dirLink ?>"><i class="idows-ico idows-i-folder"></i>&nbsp;<?= $dir ?></a>&nbsp;/
    <?php } ?>
</div>
<!-- FILE LISTING -->
<div class="idows-container-body">
    <div class="idows-abs-end"></div>
    <div class="idows-container idows-panel idows-abs-layout-item idows-first idows-last" role="group" style="border-width: 0px; left: 0px; top: 0px; width: 100%;">
        <div class="idows-container-body idows-abs-layout" style="width: inherit; height: inherit;">
            <div class="idows-abs-end"></div>
            <div class="idows-filelist idows-abs-layout-item idows-last" style="border-width: 1px 0px 0px; left: 0px; width: inherit;">
                <div class="idows-filelist-head" unselectable="true">
                    <table class="idows-filelist-head" style="width: inherit;">
                        <tbody>
                            <tr>
                                <td class="idows-filelist-head-item idows-checkbox-column" style="width:2%">
                                    <div class="idows-txt idows-filelist-cell select-all">
                                        <i class="idows-ico idows-i-checkbox"></i>
                                    </div>
                                </td>
                                <td class="idows-filelist-head-item" style="width: 31%;">
                                    <div class="idows-txt idows-filelist-cell">Filename
                                    </div>
                                </td>
                                <td class="idows-filelist-head-item" style="width: 6%;">
                                    <div class="idows-txt idows-filelist-cell">Size
                                    </div>
                                </td>
                                <td class="idows-filelist-head-item" style="width: 5%">
                                    <div class="idows-txt idows-filelist-cell">Type
                                    </div>
                                </td>
                                <td class="idows-filelist-head-item" style="width: 2%;">
                                    <div class="idows-txt idows-filelist-cell">Date Modified
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="idows-filelist-body" style="width: inherit; height: inherit;">
                    <table>
                        <thead>
                            <tr>
                                <td class="idows-filelist-head-item idows-checkbox-column" style="width:2%;"></td>
                                <td class="idows-filelist-head-item" style="width: 31%;"></td>
                                <td class="idows-filelist-head-item" style="width: 6%;"></td>
                                <td class="idows-filelist-head-item" style="width: 5%"></td>
                                <td class="idows-filelist-head-item" style="width: 6%;"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // All dirs
                            echo CHtml::hiddenField ( 'sub_directory' , implode ( DIRECTORY_SEPARATOR , $subDirectory ) );
                            $count = 0;
                            foreach ( $itemList as $sort => $item ) {

                                if ( is_dir ( realpath ( Yii::app ()->basePath . '/..' . $targetDirectory . DIRECTORY_SEPARATOR . $item ) ) && $item !== '..' ) {
                                    $itempath = realpath ( Yii::app ()->basePath . '/..' . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item );
                                    ?>

                                    <tr class="idows-filelist-row" data-id="<?= htmlentities ( $itempath ) ?>">
                                        <td class="idows-checkbox-column">
                                            <!-- <div class="idows-txt idows-filelist-cell">
                                                <i class="idows-ico idows-i-checkbox"></i>
                                                 
                                            </div> -->
                                        </td>
                                        <td>
                                            <div class="idows-folder idows-filelist-cell" 
                                                 title = "<?= htmlentities ( str_replace ( $mainRoot , '' , $targetDirectory ) . DIRECTORY_SEPARATOR . $item ) ?>" 
                                                 data-id = "<?= htmlentities ( DIRECTORY_SEPARATOR . ((!empty ( $subDirectory )) ? implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR : '') . $item ) ?>" id="folder_<?= $count ?>">
                                                <i class="idows-ico idows-i-folder"></i>
                                                <span class="idows-txt"  
                                                      title = "<?= htmlentities ( str_replace ( $mainRoot , '' , $targetDirectory ) . DIRECTORY_SEPARATOR . $item ) ?>" data-id = "<?= $targetDirectory . DIRECTORY_SEPARATOR . htmlentities ( $item ) ?>" class = "idows-thumb idows-folder">
                                                    <a class="folderView" href="#.">
                                                        <?= htmlentities ( $item ) ?>
                                                    </a>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell"><span class="idows-txt idows-reset" title="Size">
                                                    <?= Helper::formatBytes ( Helper::getDirSize ( $itempath ) ) ?></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="dir">dir</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?= date ( 'd/m/Y' , filectime ( htmlentities ( $itempath ) ) ) ?>">
                                                    <?= date ( 'd M Y' , filectime ( htmlentities ( $itempath ) ) ) ?>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php
                                } else if ( $item == '..' ) {

                                    $previousFolder = realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . $targetDirectory . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR );
                                    $previousDir = str_replace ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR ) , '' , $previousFolder );
                                    ?>
                                    <!--        DISPLAY BACK LINK-->
                                    <tr class="idows-filelist-row" data-id="<?= htmlentities ( $mainRoot . $item ) ?>">
                                        <td class="idows-checkbox-column">
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell back-link" title="<?= $previousDir ?>">
                                                <i class="idows-ico idows-i-back"></i>
                                                <span class="idows-txt idows-reset" data-id="<?= $targetDirectory ?>" class="idows-thumb" title="<?= $previousDir ?>">
                                                    <a class="folderView" href="#" rel="<?= htmlentities ( $mainRoot . $item ) ?>">
                                                        Previous Directory<?= htmlentities ( $item ) ?>
                                                    </a>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="">-</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="dir">Back Link</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset"></span>
                                            </div>
                                        </td>
                                    </tr>

                                    <?php
                                } else {
                                    $ext = preg_replace ( '/^.*\./' , '' , $item );

                                    $itempath = realpath ( Yii::app ()->basePath . '/..' . Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item );
                                    $fileIcon = Helper::_mime_content_type ( $itempath , true , 'list' );
                                    $fileType = Helper::_mime_content_type ( $itempath , false , 'list' );
                                    $itemUrl = Yii::app ()->getBaseUrl ( true ) . str_replace ( "\\" , '/' , Yii::app ()->params['UPLOAD_DIR'] . DIRECTORY_SEPARATOR . implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item );
                                    ?>

                                    <!--        DISPLAY ALL FILES-->
                                    <tr class="idows-filelist-row" >
                                        <td class="idows-checkbox-column">
                                            <div class="idows-txt idows-filelist-cell">
                                                <i class="idows-ico idows-i-checkbox"></i>
                                                <?= CHtml::checkBox ( 'selectable_files[]' , false , array( 'id' => 'file_' . $count , 'class' => 'selectable_files' , 'value' => implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR . $item , 'style' => 'display:none;' ) ); ?>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-file idows-txt idows-filelist-cell" data-ext="<?= $ext ?>" id="filenode_<?= $count ?>"
                                                 title = "<?= htmlentities ( ((!empty ( $subDirectory )) ? implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR : '') . $item ) ?>"
                                                 data-id = "<?= htmlentities ( DIRECTORY_SEPARATOR . ((!empty ( $subDirectory )) ? implode ( DIRECTORY_SEPARATOR , $subDirectory ) . DIRECTORY_SEPARATOR : '') . $item ) ?>" >
                                                     <?= $fileIcon ?>
                                                <span class="idows-txt idows-reset" data-action="<?= $fileType ?>" data-src="<?= (($fileType == 'zip') ? str_replace ( realpath ( Yii::app ()->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR ) , '' , $itempath ) : $itemUrl) ?>">
                                                    <?= htmlentities ( $item ) ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?= Helper::formatBytes ( filesize ( $itempath ) ) ?>">
                                                    <?= Helper::formatBytes ( filesize ( $itempath ) , 2 ) ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?= mime_content_type ( $itempath ) ?>">
                                                    <?= $ext ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?= date ( 'm/d/Y' , filectime ( $itempath ) ) ?>">
                                                    <?= date ( 'd M Y' , filectime ( $itempath ) ) ?>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php
                                }
                                $count++;
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="idows-thumbnailview idows-abs-layout-item" style="border-width: 1px 0px 0px; display: none;">
                <div class="idows-container-body idows-flow-layout"></div>
            </div>
        </div>
    </div>
</div>
