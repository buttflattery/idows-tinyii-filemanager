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
?>

<!-- MODAL WINDOW FOR ADD FOLDER -->
<?php
$this->beginWidget (
        'booster.widgets.TbModal' , array( 'id' => 'add-folder' )
);
?>

<div class="modal-header">
    <h4>Add Folder</h4>
</div>

<div class="modal-body">

</div>

<div class="modal-footer">
    <?php
    $this->widget (
            'booster.widgets.TbButton' , array(
        'context' => 'primary' ,
        'label' => 'Add Folder Now' ,
        'buttonType' => 'button' ,
        'htmlOptions' => array( 'onclick' => '$("#folder-form").submit()' ) ,
            )
    );
    ?>
    <?php
    $this->widget (
            'booster.widgets.TbButton' , array(
        'label' => 'Close' ,
        'url' => '#' ,
        'htmlOptions' => array( 'data-dismiss' => 'modal' , 'class' => 'btn btn-danger' ) ,
            )
    );
    ?>
</div>

<?php $this->endWidget (); ?>

<!-- BOOTSTRAP MODAL FOR RENAME FILE -->
<?php
$this->beginWidget (
        'booster.widgets.TbModal' , array( 'id' => 'rename-file' )
);
?>

<div class="modal-header">
    <h4>Rename</h4>
</div>

<div class="modal-body">

</div>

<div class="modal-footer">
    <?php
    $this->widget (
            'booster.widgets.TbButton' , array(
        'context' => 'primary' ,
        'label' => 'Rename Now' ,
        'htmlOptions' => array( 'onclick' => 'js:$("#folder-form").submit()' ) ,
            )
    );
    ?>
    <?php
    $this->widget (
            'booster.widgets.TbButton' , array(
        'label' => 'Close' ,
        'url' => '#' ,
        'htmlOptions' => array( 'data-dismiss' => 'modal' , 'class' => 'btn btn-danger' ) ,
            )
    );
    ?>
</div>

<?php $this->endWidget (); ?>