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
$cs->registerCssFile ( Yii::app ()->request->baseUrl . '/css/main.css' );
$cs->registerCssFile ( Yii::app ()->request->baseUrl . '/css/form.css' );
$cs->registerCssFile ( $this->editorAssets . '/skin/skin.min.css' );
$cs->registerScript ( 'effect-flash' , '$(".flash-success").animate({opacity: 1.0}, 3000).fadeOut("slow");' , CClientScript::POS_READY );
?>
<div id="content">
    <div class="form">
        <?php
        $form = $this->beginWidget ( 'CActiveForm' , array(
            'id' => 'folder-form' ,
            'enableAjaxValidation' => true ,
            'focus' => array( $model , 'name' ) ,
            'clientOptions' => array(
                'validateOnSubmit' => true ,
            ) ,
                ) );
        ?>
        <p class="note">Fields with <span class="required">*</span> are required.</p>
        <?php
        if ( Yii::app ()->user->hasFlash ( 'success' ) ) {
            echo "<div class='flash-success'>" . Yii::app ()->user->getFlash ( 'success' ) . "</div>";
        }
        ?>
        <?php echo $form->errorSummary ( $model ); ?>

        <div class="row">
            <?php echo $form->labelEx ( $model , 'name' ); ?>
            <?php echo $form->textField ( $model , 'name' ); ?>
            <?php echo $form->error ( $model , 'name' ); ?>
        </div>
        <div class="row">
            <?php echo $form->labelEx ( $model , 'directory_path' ); ?>
            <?php echo $form->textField ( $model , 'directory_path' ); ?>
            <?php echo $form->error ( $model , 'directory_path' ); ?>
        </div>
        <div class="row buttons">
            <?php echo CHtml::submitButton ( 'Submit' ); ?>
        </div>

        <?php
        $this->endWidget ();
        ?>
    </div>
</div>