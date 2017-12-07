<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class TinyiiRenameForm extends CFormModel {

    public $name;
    public $old_file_name;

    /**
     * Declares the validation rules.
     */
    public function rules() {
        return array(
            // name, email, subject and body are required
            array( 'name' , 'required' ) ,
            array( 'name' , 'checkValidFileName' ) ,
            array('old_file_name','safe')
        );
    }

    public function checkValidFileName( $attribute , $params ) {
        if ( !$this->hasErrors () ) {
            $pattern    =   '/[\*\[\:\\\^\!\/\|\?]|[^\x00-\x7F]+/i';
            
           if(preg_match($pattern , $this->name)){
               $this->addError( $attribute , 'File name cannot contain non-english or any of these characters ~ " # % & * : < > ? / \ { | }..' );
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
            'name' => 'New File Name' ,
        );
    }

}
