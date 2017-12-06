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
$cs->registerCoreScript ( 'jquery' , CClientScript::POS_HEAD );
$cs->registerCssFile ( '/css/screen.css' , CClientScript::POS_HEAD );
$cs->registerCssFile ( $this->editorAssets . '/css/nailThumb/jquery.nailthumb.1.1.css' );
$cs->registerScriptFile ( $this->editorAssets . '/js/nailThumb/jquery.nailthumb.1.1.js' , CClientScript::POS_HEAD );
$cs->registerScriptFile ( $this->editorAssets . '/js/nailThumb/jquery.showLoading.min.js' , CClientScript::POS_HEAD );
$cs->registerScript ( 'loaders' , '$("div.showLoadingIcon").
            nailthumb({
                width: 500,
                height: 400,
                method: "resize",
                fitDirection: "center center",
                animationTime: 5000,
                replaceAnimation: "fade",
                imageUrl: "' . urldecode ( $file_name ) . '"
            });' , CClientScript::POS_READY );

$cs->registerScript ( 'result_loader' , 'window.setTimeout(\'location.href="/filemanager/index";\',5000);' , CClientScript::POS_LOAD )
?>
<div>
    <div class="showLoadingIcon" style="margin: 0 auto;"><img src="<?= $this->editorAssets ?>/skin/img/loading-image.png" /></div>
</div>