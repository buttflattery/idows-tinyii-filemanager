<?php

class TinyiiAssetUploadForm extends CFormModel {

    public $userfile;

    public function rules() {
        return array(
            array( 'userfile' , 'file' ,
                'allowEmpty' => false ,
                'types' => 'jpg, gif, png, bmp, zip, gif, jpeg, tiff, mp4, flv, doc, docx, pdf, ppt, xls, xlsx, pptx, txt, zip, gzip, rar, mp3, wav',
                'maxSize' => 1024 * 1024 * 100 , // 10MB
                'tooLarge' => 'The file was larger than 100MB. Please upload a smaller file.' ,
                'safe'=>false
            ) ,
        );
    }

}
