<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TinyiiFolderForm extends CFormModel {

    public $name;
    public $current_dir_name;

    /**
     * Declares the validation rules.
     */
    public function rules() {
        return array(
            // folder name is required
            array( 'name,' , 'required' ) ,
            array( 'name' , 'checkValidFolderName' ) ,
            array( 'current_dir_name' , 'safe' )
        );
    }

    public function checkValidFolderName( $attribute , $params ) {
        if ( !$this->hasErrors () ) {
            $pattern    =   '/[\*\[\:\\\^\!\/\|\?]|[^\x00-\x7F]+/i';
            
           if(preg_match($pattern , $this->name)){
               $this->addError( $attribute , 'Folder name cannot contain non-english or any of these characters ~ " # % & * : < > ? / \ { | }..' );
           }
        }
    }

    /**
     * Declares customized attribute labels.
     * If not declared here, an attribute would have a label that is
     * the same as its name with the first letter in upper case.
     */
    public function attributeLabels() {
        return array(
            'name' => 'Folder Name' ,
        );
    }

}
