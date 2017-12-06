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
<!-- CREATE FOLDER BUTTON -->
<div class="idows-widget idows-btn idows-menubtn idows-abs-layout-item idows-first" id="add_folder" data-action="addFolder" role="button" title="Create Folder">
    <button  type="button" name="create_folder">
        <i class="idows-ico idows-i-create"></i>
        &nbsp;Create Folder
    </button>
</div>
<!-- UPLOAD FILE FORM -->
<div id="upload_form_container" class="idows-widget idows-btn idows-menubtn idows-abs-layout-item" role="button" title="Upload File" >
    <?php
    $form = $this->beginWidget ( 'CActiveForm' , [
        'id' => 'upl' ,
        'action' => '/filemanager/uploadassets' ,
        'clientOptions' => [
            'validateOnSubmit' => true ,
        ] ,
        'htmlOptions' => [ 'onsubmit' => "idowsFileBrowser.inProgress ();" , 'class' => 'form-inline' , 'enctype' => 'multipart/form-data' ]
            ] );
    ?>

    <button  type="button" title="Upload File"><i class="idows-ico idows-i-upload"></i>&nbsp;Upload</button>
    <?php echo $form->fileField ( $model , 'userfile' , [ 'id' => 'uploader' , 'accept' => '.jpg, .gif, .png, .bmp, .zip, .gif, .jpeg, .tiff, .mp4, .flv, .doc, .docx, .pdf, .ppt, .xls, .xlsx, .pptx, .txt, .zip, .gzip, .rar' , 'class' => 'upload jbFileBox' ] ); ?>
    <?php echo $form->error ( $model , 'userfile' ); ?>
    <?php $this->endWidget () ?>
</div>
<!-- ROOT / HOME DIRECTORY BUTTON -->
<div class="idows-widget idows-btn idows-abs-layout-item" role="button" title="Home Directory">
    <button type="button" data-action="home" name="home">
        <i class="idows-ico idows-i-home"></i>&nbsp;Home
    </button>
</div>
<!-- REFRESH BUTTON -->
<div class="idows-widget idows-btn idows-abs-layout-item" role="button" aria-label="Refresh file list" title="Refresh">
    <button  type="button" data-action="reload" name="reload">
        <i class="idows-ico idows-i-refresh"></i>&nbsp;Refresh
    </button>
</div>
<!-- BUTTON GROUP -->
<div class="idows-widget idows-btn idows-btn-group" style="right: 270px; position: absolute; ">
    <!-- LIST VIEW BUTTON -->
    <div class="idows-widget idows-btn idows-first" role="button" aria-label="List" title="List View">
        <button  type="button" id="listView" data-action="listView" name="listView">
            <i class="idows-ico idows-i-list"></i></button>
    </div>
    <!-- THUMBNAIL VIEW BUTTON -->
    <div class="idows-widget idows-btn idows-last idows-active" role="button" aria-label="Thumbnails" title="Thumb View">
        <button  type="button" id="thumbView" data-action="thumbView" name="thumbView"><i class="idows-ico idows-i-thumbs"></i></button>
    </div>
</div>
<!-- SETTINGS BUTTON -->
<div class="idows-widget idows-btn idows-last idows-menubtn idows-floatpanel" role="button" aria-label="Settings" title="Settings" 
     style="display: none; right:358px; top:2px;">
    <button type="button" id="settings" data-action="settings" name="settings">
        <i class="idows-ico idows-i-settings"></i>
    </button>
</div>
<!-- SETTINGS MENU -->
<div id="settings-menu" class="idows-container idows-panel idows-floatpanel idows-menu idows-menu-has-icons idows-fixed idows-menu-align" 
     style="border-width: 1px;width: auto;z-index: 200; display:none;">
    <div class="idows-container-body idows-stack-layout"  role="menu">
        <div class="idows-menu-item idows-stack-layout-item idows-first" id="copy" data-action="copy">
            <i class="idows-ico idows-i-copy"></i>&nbsp;
            <span class="idows-text" data-name="Copy">Copy</span>
        </div>
        <div class="idows-menu-item idows-stack-layout-item" id="cut" data-action="cut">
            <i class="idows-ico idows-i-cut"></i>&nbsp;
            <span class="idows-text" data-name="Cut">Cut</span>
        </div>
        <div  class="idows-menu-item idows-stack-layout-item idows-last" id="delete" data-action="delete">
            <i class="idows-ico idows-i-delete"></i>&nbsp;
            <span class="idows-text" data-name="Delete">Delete</span>
        </div>
        <div class="idows-menu-item idows-menu-item-sep idows-stack-layout-item idows-menu-item-sep"></div>
        <div  class="idows-menu-item idows-stack-layout-item idows-last" id="download" data-action="download">
            <i class="idows-ico idows-i-download"></i>&nbsp;
            <span class="idows-text" data-name="Download">Download</span>
        </div>
    </div>
</div>
<!-- SERCH FILTER INPUT -->
<div class="idows-combobox idows-abs-layout-item idows-last idows-has-open" id="filter-wrapper" >
    <input placeholder="Start typing to filter files."  value="" class="idows-textbox" id="filter_now" style="width: 153px;" />
    <div role="button"  class="idows-btn idows-open">
        <button type="button" name="filterbutton">
            <i class="idows-ico idows-i-filter"></i></button>
    </div>
</div>
<!-- SORT MENU BUTTON -->
<div  class="idows-widget idows-btn idows-menubtn idows-abs-layout-item" id="sort-button-wrapper" role="button">
    <button id='sort-button' data-action="sortToggle"  type="button" role="presentation">Sort 
        <i class="idows-caret"></i></button>
</div>
<!-- SORT MENU -->
<div id="sort-menu" class="idows-container idows-panel idows-floatpanel idows-menu idows-menu-has-icons idows-fixed idows-menu-align" 
     style="border-width: 1px;width: auto;z-index: 200; display:none;">
    <div class="idows-container-body idows-stack-layout"  role="menu">
        <div class="idows-menu-item idows-stack-layout-item idows-first idows-active" id="sort_name" aria-checked="true" aria-pressed="true">
            <i class="idows-ico idows-i-sort-up"></i>&nbsp;
            <span class="idows-text" data-name="Name">Name Ascending</span>
        </div>
        <div class="idows-menu-item idows-stack-layout-item" id="sort_size"  >
            <i class=""></i>&nbsp;
            <span class="idows-text" data-name="Size">Size Ascending</span>
        </div>
        <div class="idows-menu-item idows-stack-layout-item idows-last" id="sort_date"  >
            <i class=""></i>&nbsp;
            <span class="idows-text" data-name="Date Modified">Date Modified Ascending</span>
        </div>
    </div>
</div>