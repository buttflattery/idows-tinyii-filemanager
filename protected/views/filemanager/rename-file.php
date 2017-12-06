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

//script loading for standalone usage of filemanager
if(Yii::app()->request->isAjaxRequest){
    $cs->scriptMap['jquery.js']=false;
    $cs->scriptMap['jquery.min.js']=false;    
}else{
    $cs->registerCoreScript ( 'jquery' , CClientScript::POS_HEAD );
    $cs->registerCssFile ( $this->editorAssets . '/css/bootstrap.css' );
    $cs->registerCssFile ( $this->editorAssets . '/skin/skin.min.css' );
}

$cs->registerCssFile ( $this->editorAssets .'/css/forms/main.css' );
$cs->registerCssFile ( $this->editorAssets .'/css/forms/form.css' );
$cs->registerScriptFile($this->editorAssets .'/js/forms/custom.js');
$cs->registerScript('effect-flash','
if(typeof top.tinymce!=="undefined"){
    var args=top.tinymce.activeEditor.windowManager.getParams();
}else{
    var args={filename:"'.str_replace("\\","/",Yii::app()->request->getQuery('filename')).'"}
}

$("#old_file").html(idowsForms.basename(args.filename));
$("#old_file_name").val(args.filename)',CClientScript::POS_READY);
?>
<div id="content" class="container-fluid">
    <div class="form">
        <?php
        $form = $this->beginWidget ( 'CActiveForm' , array(
            'id' => 'folder-form' ,
            'enableAjaxValidation' => true ,
            'clientOptions' => array(
                'validateOnSubmit' => true ,
                'afterValidate'=>'js:idowsForms.submitForm'
                ) ,
            ) 
        );
        ?>
        <p>Renaming <span id='old_file' class="label label-info idows-label"></span>.<br />Fields with <span class="required">*</span> are required</p>
        <?php
        if ( Yii::app ()->user->hasFlash ( 'success' ) ) {
            echo "<div class='flash-success'>".Yii::app()->user->getFlash('success')."</div>";
        }
        ?>
        <?php echo $form->errorSummary ( $model ); ?>

        <div class="row">
            <?php echo $form->labelEx ( $model , 'name' ,['class'=>'control-label']); ?>(without extension)
            <?php echo $form->textField ( $model , 'name' ,['class'=>'form-control']); ?>
            <?php echo $form->error ( $model , 'name' ); ?>
        </div>
        <div class="row buttons">
            <?php echo CHtml::submitButton ( 'Rename',['class'=>'btn btn-default'] ); ?>
        </div>
        <?=$form->hiddenField($model,'old_file_name',['id'=>'old_file_name'])?>

        <?php
        $this->endWidget ();
        ?>
    </div>
</div>