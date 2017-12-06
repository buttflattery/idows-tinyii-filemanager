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
$cs->registerCoreScript ( 'jquery' , CClientScript::POS_HEAD );

if(Yii::app()->request->isAjaxRequest){
    $cs->scriptMap['jquery.js']=false;
    $cs->scriptMap['jquery.min.js']=false;
}else{
    $cs->registerCssFile ( $this->editorAssets . '/skin/skin.min.css' );
    $cs->registerCssFile ( $this->editorAssets . '/css/bootstrap.css' );
}

$cs->registerCssFile ( $this->editorAssets . '/css/forms/main.css' );
$cs->registerCssFile ( $this->editorAssets . '/css/forms/form.css' );
$cs->registerScriptFile($this->editorAssets.'/js/forms/custom.js');
$cs->registerScript('effect-flash','
if(typeof top.tinymce!=="undefined"){
    var args=top.tinymce.activeEditor.windowManager.getParams();
}else{
    var args={current_directory:"'.str_replace("\\",'/',Yii::app()->request->getQuery("current_directory")).'"};
}

var curdir=((args.current_directory!=="")?args.current_directory:"'.urlencode(str_replace("\\",'/',Yii::app()->params["UPLOAD_DIR"])).'");
$("#current_dir_name").val(curdir);
var basename=idowsForms.basename(decodeURIComponent(curdir));
$("#current_dir").html(basename);
',CClientScript::POS_END);
?>
<div id="content" class="container-fluid">
    <div class="form">
        <?php
        $form = $this->beginWidget ( 'CActiveForm' , array(
            'id' => 'folder-form' ,
            'enableAjaxValidation' => true ,
            'clientOptions' => array(
                'validateOnSubmit' => true ,
                'afterValidate'=>'js:idowsForms.submitForm', // Your JS function to submit form
            ) ,
                ) );
        ?>
        <p>Creating folder in <span id="current_dir" class="label label-info idows-label"></span>.<br/><br />Fields with <span class="required">*</span> are required.</p>
        <?php
        if ( Yii::app ()->user->hasFlash ( 'success' ) ) {
            echo "<div class='flash-success'>".Yii::app()->user->getFlash('success')."</div>";
        }
        ?>
        <?php echo $form->errorSummary ( $model ); ?>

        <div class="row">
            <?php echo $form->labelEx ( $model , 'name',['class'=>'control-label'] ); ?>
            <?php echo $form->textField ( $model , 'name',['class'=>'form-control'] ); ?>

            <?php echo $form->error ( $model , 'name' ); ?>
        </div>
        <?=$form->hiddenField($model,'current_dir_name',['id'=>'current_dir_name'])?>
        <div class="row buttons">
            <?php echo CHtml::submitButton ( 'Add Now' ,['class'=>'btn btn-primary']); ?>
        </div>

        <?php
        $this->endWidget ();
        ?>
    </div>
</div>