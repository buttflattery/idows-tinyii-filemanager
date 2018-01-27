# Tinyii v1.0 - IDOWS File Manager Plugin for YII 1.xx By IDOWSTECH #

### INTRODUCTION ###
**TinYii Filemanager is a Text Editor plugin that is used to manage assets and files 
using Yii 1.x framework. You can use TinYii Filemanager as a plugin for Text Editors or use it 
as a standalone filemanager**.

***

### Version ###
**1.0.0**

### Requirements ###
* **php >5.0**
* **php Extensions**
    * **php_bz2.dll**
    * **php_fileinfo.dll**
    * **php_intl.dll**

## External Libraries used in this project ##

* [JQuery 2.x](https://jquery.com/).
* [JQuery UI - v1.12.1](http://jqueryui.com/).
* [JQuery UI Positioning](https://jqueryui.com/position/).
* [JQuery Nailthumb v1.1 by Garlab](http://www.garralab.com/nailthumb.php).
* [JQuery Context Menu](https://github.com/swisnl/jQuery-contextMenu).
* [Bootstrap v3.1.1](https://getbootstrap.com/docs/3.3/getting-started/).
* [VideoJs](http://videojs.com/)

### Tested With ###
* Yii v1.x. 
* Jquery v2.x.x 
* Browsers 
    * Microsoft Edge 40.15063.674.0
    * Microsoft EdgeHTML 15.15063
    * Mozilla FF 56.0.1 (64-bit)
    * Chrome Version 62.0.3202.62 (Official Build) (64-bit)
### Integrations ###
* **Text Editors**
* **Standalone file manager Yii 1.x**

### Flavours ###
* TinyMCE all versions up to latest v4.x.
* CKEditor v4.x
* RedactorJs Redactor v9.x.

### Demo ###
* Click here to see the [TinyMCE Demo](http://plugins.idowstech.com/site/demotinymce)
* Click here to see the [CKEditor Demo](http://plugins.idowstech.com/site/demockeditor)
* Click here to see the [RedactorJs Demo](http://plugins.idowstech.com/site/demoredactor)

### Features ###

* **Uplaod Files**

    * Supported File Types **jpg, gif, png, bmp, zip, gif, jpeg, tiff, mp4, flv, doc, docx, pdf, ppt, xls, xlsx, pptx, txt, zip, gzip, rar**. 
    
    _Note: you might need to update the `upload_max_filesize` in your `php.ini` if it is below 2MB as the allowed upload filesize is 2MB in the `protected/models/TinyiiAssetUploadForm.php`._
    
* **Delete File(s) / Folder(s)**

    * You can Delete Multiple files at a time by selecting them and using settings menu from the top toolbar that appears after selecing any file, or a single file by right-clicking on it and using the context menu.
    
    **Delete Multiple Files**

    ![delete-multiple-files](http://plugins.idowstech.com/images/delete-multiple-files.png)

     
    **Delete Single File**

     ![delete-single-files](http://plugins.idowstech.com/images/delete-single-file.png)

	_**Note:Multiple folder deletion is not supported yet**_.

* **Copy File(s) / Folder(s)**

    * You can Copy Multiple files at a time by selecting them and using settings menu from the top toolbar that appears after selection, or a single file by right-clicking on it and using the context menu.
    * For folders you can copy one folder at a time multiple folder copy pasting is not supported, you can `copy & paste` a folder to another by using right-click context menu.

    See below for screen grabs

    **COPY Multiple Files**

    ![copy-multiple-files](http://plugins.idowstech.com/images/copy-multiple-files.png)
         
    **Copy Single File**

     ![copy-single-file](http://plugins.idowstech.com/images/copy-single-file.png)


* **Cut / Drag- Drop File(s) / Folder(s)**

    * You can "Cut" Multiple files at a time by selecting them and using settings menu from the top toolbar that appears after selection, or a single file by right-clicking on it and using the context menu.
    * You can also drag drop files on to folders to move them inside the folder one by one at a time. Selecting multiple files and dragging them on to the folder is not supported.
    * For folders multiple selection is not supported you can `cut & paste` a folder by using right-click context menu or you can `drag & drop` a folder on to another folder to move it.

    _Note: You can move a file or folder 1 level up to previous directory by dragging & dropping it over the `previous directory` link when you are inside a subdirectory._

    See below for screenshots.

    **Cut Multiple Files**

    ![cut-multiple-files](http://plugins.idowstech.com/images/cut-multiple-files.png)

     **Cut Single File**

     ![cut-single-file](http://plugins.idowstech.com/images/cut-single-file.png)

	**Drag Drop Files**

    ![drag-files](http://plugins.idowstech.com/images/drag-drop-files.png)

* **Pasting**

    Once you `Copy or Cut` a file by selecting the context menu, you can paste files by right-clicking on any blank area inside the file manager. See below.

    ![paste-files](http://plugins.idowstech.com/images/paste-files.png)

* **Rename File(s) / Folder(s)**

    You can Rename files by right-clicking on it and using the context menu.

    ![rename-file](http://plugins.idowstech.com/images/rename-file.png)

* **Add Folder**

    You can Create a folder Using create Folder button from top toolbar.

    ![add-folder](http://plugins.idowstech.com/images/add-folder.png)

* **List View**

    You can view the files in list view mode using Listview icon in toolbar.

    ![list-view](http://plugins.idowstech.com/images/list-view.png)

* **Thumbnail View**	

    You can view the files in Thumbnail mode using thumbnails icon in toolbar.

    ![thumbnail-view](http://plugins.idowstech.com/images/thumbview.png)

* **Sort Files**

    You can Sort files in the current directory by using sort drop-down on top right of the filemanager toolbar and choosing sort option.

    ![sort-files](http://plugins.idowstech.com/images/sort-files.png)

* **Filter Files** 	

    You can Filter files in the current directory by Typing in the filter box on top right of the filemanager ttoolbar. 

    ![filter-files](http://plugins.idowstech.com/images/filter-files.png)
    
* **Download Files**
    
    You can download single file or multiple files by selecting them. The selected files are compressed into a single zip file and then provided for download.

* **Preview Files** 	

    You can preview all file types listed above in the supported file types for **File Uploads** section.
    
    You can click the file to preview it if you are in Listview Mode, and right-click on file to open the context menu and select preview to preview the file if you are in Thumbview Mode.

    ![preview-file](http://plugins.idowstech.com/images/preview-file.png)
    
    
    **Preview Categories**

    The file preview is categorized in the following sections.
	
	+ **Images (jpg, gif, png, bmp, zip, gif, jpeg, tiff,)**
        + Uses fancyBox preview window to show the supported image file types.   

	+ **Documents (doc, docx, pdf, ppt, xls, xlsx, pptx, txt)**
        + Uses google docs viewer inside fancybox window to preview the supported document file types.

	+ **Media (mp4, flv)**
        + So far the media types supported are video only and the plugin uses video js to preview the video file types inside the fancybox window.

    + **Compressed Files (zip, gzip, rar)**
        + You can preview the contents of a compressed file inside a fancybox window.

    See below for screeshots.

    **Image Preview**

    ![image-preview](http://plugins.idowstech.com/images/image-preview.png)

    **Compressed Files Preview**

    ![compressed-preview](http://plugins.idowstech.com/images/zip-preview.png)

    **Video Preview**

    ![video-preview](http://plugins.idowstech.com/images/video-preview.png)

* **Insert Files To Editor**
    
    You can insert the files inside the editor by double clicking them. The file insertion tag for the editor vary on their types.

    + **Media Tags**

      Media files are inserted as a video tag inside the editor you can preview the media file with the editor preview function.

    + **Anchor Tags**

      Documents and Compressed files are inserted as a download link inside the editor.

    + **Image Tags**
    
      All images are added as an image tag inside the editor.



## SETUP INSTRUCTIONS ##


## How do I get set up? ##

**Filemanager can be configured to be used in 2 different ways.**

* **Editor Plugin**
* **Standalone (For Admin Only)**

***
### As a plugin with Text Editors ###
***

**Clone or download the source files from any of the following links and unzip files anywhere on your drive.**

* **[Github](https://github.com/buttflattery/idows-tinyii-filemanager)**
* **[YiiFramework](http://www.yiiframework.com/extension/idows-tinyii-filemanager/files/idows-tinyii-filemanager.zip)**
* **[Idowstech](http://plugins.idowstech.com/download)**

**Copy the following to the relevant directories as described below.**

* _`protected/config/params.php`_ -> _`protected/config`_ _(if you have an existing `params.php` file add the contents from this file to your `params.php` file)_
* _`protected/controllers/FilemanagerController`_ -> _`protected/controllers/`_
* _`protected/views/filemanager`_ -> _`protected/views`_
* _`protected/models/*.*`_ -> _`protected/models/*.*`_
* _`protected/components/Helper.php`_ -> _`protected/components`_ _(if you have an existing `Helper.php` class file add all the static methods from this file to your `Helper.php` class file)_

* _`protected/components/WebUser.php`_ -> _`protected/components/`_ make sure you have a user model associated with you db table user.

Open `protected/config/main.php` and add the following to the components section.

    'user'=>array(
       'class' => 'WebUser',
	),

Open `protected/config/params.php` file and update the `PLUGIN_DIR` and `UPLOAD_DIR` contants relevant to your project root.

    'UPLOAD_DIR' => DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'tinyii-uploads' ,
    'PLUGIN_DIR' => DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR . 'idowsfilemanager',
    'PLUGIN_DIR_CK' => DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'ckeditor' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR . 'idowsfilemanager',

 You should assign valid paths for these directories and make sure they exist.

_Note: If you are logged in as a guest or a normal user you can access the plugin via editor button only. If you are logged in as an admin you will be provided access to both the interfaces standalone and Editor._

***
### Configuring Editor To use The Plugin ###

***
####**1. TinyMCE 3.x, 4.x.**####

* _`plugins/idowsfilemanager`_ -> _copy to the plugins directory inside the tinymce plugin source my path is `my_app_webroot/js/tinymce/plugins/idowsfilemanager`_

After you have copied all the sources from the extracted zip file you need to configure the editor to use the plugin.

Copy the following to the head of the document where you want to integrate the editor. Place the very first line 

_`$baseUrl = Yii::app ()->getBaseUrl ( true );`_ 

to the top of your view file, and then paste the

 _`tinymce.init`_ 
 
 section 
to the head or you can use _`Yii::app()->clientScript()`_ to load the script on Document ready i.e _`CClientScript::POS_READY`_.

     $baseUrl = Yii::app ()->getBaseUrl ( true );
	 
	 Yii::app ()->getClientScript ()->registerScript ( 'init_tinymce' , ' // Tiny MCE
                 tinymce.init({
                    document_base_url: "'.$baseUrl.'/js/tinymce/plugins/idowsfilemanager/",
                    relative_urls:true,
                    selector: "textarea",
                    plugins: [
                        "idowsfilemanager"
                    ],
                    toolbar1: "idowsfilemanager",
                     fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                    image_advtab: true,
                });
                ' , CClientScript::POS_READY );
				

You can either copy paste the whole code block or if you already have setup editor with your custom configurations and set of plugins you can copy only these 2 options. 


    document_base_url: "'.Yii::app ()->getBaseUrl ( true ).'/js/tinymce/plugins/idowsfilemanager/" ,
	relative_urls:true
	
Then include _`idowsfilemanager`_ to your _`plugins`_ and _`toolbar`_ options.

***

####**2. CKEditor 4.x.**####

* _`plugins/idowsfilemanager`_ -> _copy to the plugins directory inside the ckeditor plugin source directory my path is `my_app_webroot/js/ckeditor/plugins/idowsfilemanager`_

After you have copied all the sources from the extracted zip file you need to configure the editor to use the plugin.

    $cs = Yii::app ()->getClientScript ();
    $cs->registerScriptFile ( '/js/ckeditor/ckeditor.js' , CClientScript::POS_HEAD );
    $cs->registerScript ( 'init-editor' , 'CKEDITOR.replace("ck_custom",{customConfig:"/js/config.js"})' , CClientScript::POS_READY );
	
    **/js/config.js**
    //CKEditor configuration file
    CKEDITOR.editorConfig = ( config ) => {
        config.language = 'en';
        config.extraPlugins = 'idowsfilemanager';
        config.uiColor = '#f8f8f8';
        config.height = 300;
        config.toolbarCanCollapse = true;
    };
    
That is all you need to do for CKEditor, now refresh the page and click the IDOWS Filemanager button.

***

####**3. RedactorJs 9.x.**####

<kbd>Important</kbd> _**This library is NOT free to use. Community license for it was generously bought by the Yii community to be used with [YiiBooster Extension](https://github.com/clevertech/yiibooster) 4.xx based on Bootstrap 3.1.1 and later, so you can use YiiBooster legally in Yii-based projects ONLY.**_

* Download [YiiBooster](https://github.com/clevertech/yiibooster) Extension or copy  the added sources to your applications extensions directory.

* _`protected/extensions/booster -> protected/extensions/`_

After copying the files open **`protected/config/main.php`** and add `booster` to your `preload` array 

    'preload'=>array('log','booster')
    
and add the following to the components array.

    'booster' => array(
	    'class' => 'application.extensions.booster.components.Booster',
    ),` 

* Then copy files from  _`plugins/redactor/idowsfilemanager`_ ->  to the plugins directory inside the redactorjs plugin source directory my path is _`protected/extensions/booster/assets/redactor/plugins/idowsfilemanager`_

After you have copied all the sources you need to initalize and configure the Redactor Editor to use the plugin. You need to initialize the editor using the yii booster extension. See below.

    $cs = Yii::app ()->getClientScript ();
    $this->widget (
        'booster.widgets.TbRedactorJs' , [
            'name' => 'content' ,
            'id'=>'content_id',
            'value' => 'A sample text to load into the editor!' ,
            'editorOptions' => [
                'lang' => 'en' ,
                'plugins' => [ 'fontfamily' , 'textdirection', 'idowsfilemanager']
            ] ,
        ]
    );
    
* <kbd>Important</kbd> Please note that the name is set to "content", which is required for Redactor plugin to fetch the original data from input and paste it into its editor view. If you do not set "name" or set it to any other value, the value of value property of this widget will be completely ignored!

* <kbd>Important</kbd> In addition to previous note, if you have several Redactor instances on the same page, you must use the htmlOptions property to set the HTML ID of each Redactor instance to different values. 

__________________________________________

**Enable Pretty Urls**

**_Note: After configuring any of the editors above you should go to your _`protected/config/main.php`_ and turn on prettyl urls by adding the _`urlManager`_ inside the _`components`_ section like below as the calls inside the script use pretty urls._**

    'urlManager'=>array(
			'urlFormat'=>'path',
            'showScriptName'=>false,
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		
		
if all above is done correctly then browse the page where you have configured any of the above Text Editors, once the editor loads you can see the IDOWS Tinyii Filemanager button in the toolbar and you are all done.

![image-preview](http://plugins.idowstech.com/images/config-success.png)

***
## For Standalone Usage ##
***

All the steps you followed above are to be followed for the Standalone usage excluding the steps for the Editor Confguration, go to your web application and access the following url while logged in with the admin user. 

**http://yourdomain.com/filemanager/index**

![image-preview](http://plugins.idowstech.com/images/standalone.png)

## Who do I talk to? ##

* [buttflattery@hotmail.com](https://www.facebook.com/omer.aslam)
* [buttflattery@gmail.com](https://www.facebook.com/omer.aslam)
* [omeraslam@idowstech.com](https://www.facebook.com/omer.aslam)
