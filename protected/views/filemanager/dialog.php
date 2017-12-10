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

$cs = Yii::app ()->getClientScript ();
$baseUrl = Yii::app ()->getBaseUrl ( true );
$cs->registerCssFile ( $this->editorAssets . '/css/dialog.css' );
$cs->registerCssFile ( $this->editorAssets . '/skin/skin.min.css' );
$cs->registerCssFile ( $this->editorAssets . '/css/filetree/filetree.min.css' );
$cs->registerCssFile ( $this->editorAssets . '/css/context-menu.css' );
$cs->registerCssFile ( $this->editorAssets . '/css/jquery-ui.css' );
$cs->registerCssFile ( 'https://fonts.googleapis.com/css?family=Roboto' );
$cs->registerCoreScript ( 'jquery' , CClientScript::POS_END );
$cs->registerScriptFile ( $this->editorAssets . '/js/idows-file-browser.min.js' );
$cs->registerScriptFile ( $this->editorAssets . '/js/filetree/filetree.min.js' );
$cs->registerScriptFile ( $this->editorAssets . '/js/jquery-ui.min.js' ,CClientScript::POS_END);
$cs->registerScriptFile ( $this->editorAssets . '/js/context.menu.js' ,CClientScript::POS_END);
$cs->registerScriptFile ( $this->editorAssets . '/js/jquery.ui.position.js',CClientScript::POS_END );
$cs->registerCssFile ( $this->editorAssets . '/css/nailThumb/jquery.nailthumb.1.1.css' );
$cs->registerScriptFile ( $this->editorAssets . '/js/nailThumb/jquery.nailthumb.1.1.js',CClientScript::POS_END );
$cs->registerScript ( 'loadtree' , '
       idowsFileBrowser.init('
        . '{
            assetsDir:"' . $this->editorAssets . '",
            uploadDir:"' . str_replace ( "\\" , '/' , Yii::app ()->params['UPLOAD_DIR'] ) . '/"
        }'
        . ');',CClientScript::POS_LOAD );
?>
<?php echo $this->renderPartial ( 'alerts' ); ?>
<div class="idows-container-body">

    <div class="idows-abs-end"></div>
    <div class="idows-container idows-first idows-last" >
        <div class="idows-container-body " style="width:100%;">

            <div class="idows-abs-end"></div>
            <div class="idows-container idows-first" style="border-width: 0px 0px 1px; left: 0px; top: 0px; height: 38px;">

                <!--UPLOAD PROGRESS INFO BAR-->
                <div id="upload_in_progress" class="upload_infobar">
                    <img src="<?= $this->editorAssets ?>/skin/img/loader.gif" width="16" height="16" class="spinner">
                    Upload in progress&hellip; 
                    <div id="upload_additional_info"></div>
                </div>
                <div id="upload_infobar" class="upload_infobar"></div>

                <!--CONTROLS CONTAINER-->
                <div class="idows-container-body idows-menubar idows-panel" style="width: 100%;">
                    <div class="idows-abs-end"></div>
                    <?php echo $this->renderPartial ( 'controls' , [ 'model' => $model ] ); ?>
                </div>
                <!-- FILE BROWSER  -->
                <div class="idows-container idows-float-panel idows-last" role="group" style="position: relative;">
                    <?php echo $this->renderPartial ( 'browser' , array( 'cs' => $cs ) ); ?>
                </div>
                <?= CHtml::hiddenField ( 'current_template' , 'thumbview' , [ 'id' => 'current_template' ] ); ?>
            </div>
        </div>
    </div>
</div>
<!-- IFRAME FOR FILE UPLOAD -->
<iframe id="upload_target" name="upload_target" src="<?= Yii::app ()->getBaseUrl ( true ) ?>/index.php?r=filemanager/blank"></iframe>

<!-- THICK BOX CONTAINER AND MASK -->
<div id="dialog" class="window">
    <a href="#." class="close-preview"/>x</a>
</div>
<div id="overlay"></div>
<?=
$this->renderPartial ( 'bootstrap-modals' )?>