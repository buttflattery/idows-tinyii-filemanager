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
class Helper {

    /**
     * _mime_content_type :  Returns icon for the file type or the file type based on selection of the view or literally using iconOnly
     * @param string $filename
     * @param boolean $iconsOnly
     * @param string $view
     * @return string / html
     */
    public static function _mime_content_type( $filename , $iconsOnly = false , $view = 'thumb' ) {

        $result = new finfo ( FILEINFO_MIME );
        $mimeType = $result->buffer ( file_get_contents ( $filename ) );

        switch ( $mimeType ) {
            case "image/jpeg; charset=binary":
            case "image/png; charset=binary":
            case "image/gif; charset=binary":
            case "image/jpg; charset=binary":
            case "image/jpeg; charset=binary":
            case "image/tiff; charset=binary":
            case "image/bmp; charset=binary":
                return (!$iconsOnly) ? 'image' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-image'></i>";

                break;
            case "video/x-msvideo; charset=binary":
            case "video/mp4; charset=binary":
            case "video/3gpp; charset=binary":
            case "video/flv; charset=binary":
                return (!$iconsOnly && $view == 'list') ? 'video' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-video'></i>";
                break;
            case "application/zip; charset=binary":
            case "application/gzip; charset=binary":
            case "application/rar; charset=binary":
                return (!$iconsOnly && $view == 'list') ? 'zip' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-zip'></i>";
                break;
            case "application/msword; charset=binary":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=binary":
            case "application/x-empty; charset=binary":
            case "text/html; charset=utf-8":
                return (!$iconsOnly && $view == 'list') ? 'doc' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-word'></i>";
                break;

            case "text/plain; charset=iso-8859-1":case "text/plain; charset=us-ascii":
                return (!$iconsOnly && $view == 'list') ? 'doc' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-txt'></i>";
                break;
            case "application/pdf; charset=binary":
                return (!$iconsOnly && $view == 'list') ? 'doc' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-pdf'></i>";
                break;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=binary":
                return (!$iconsOnly && $view == 'list') ? 'doc' : "<i class='idows-ico " . ((!$iconsOnly) ? 'idows-thumb' : '') . " idows-i-file-excel'></i>";
                break;
            case "application/octet-stream; charset=binary":
                return (!$iconsOnly && $view=='list')?'doc':"<i class='idows-ico ".((!$iconsOnly)?'idows-thumb':'')." idows-i-file-ppt'></i>";
            break;
             case "audio/mpeg; charset=binary":case "audio/wav; charset=binary":case "audio/x-wav; charset=binary":
                return (!$iconsOnly && $view=='list')?'audio':"<i class='idows-ico ".((!$iconsOnly)?'idows-thumb':'')." idows-i-file-audio'></i>";
             break;
            default:
                return $mimeType;
                break;
        }
    }

    /**
     * formatBytes  : Formats the file size to readable format
     * @param integer $bytes
     * @param type $precision
     * @return type
     */
    public static function formatBytes( $bytes , $precision = 2 ) {
        $units = array( 'B' , 'KB' , 'MB' , 'GB' , 'TB' );

        $bytes = max ( $bytes , 0 );
        $pow = floor ( ($bytes ? log ( $bytes ) : 0) / log ( 1024 ) );
        $pow = min ( $pow , count ( $units ) - 1 );

        // Uncomment one of the following alternatives
        // $bytes /= pow(1024, $pow);
        $bytes /= (1 << (10 * $pow));

        return round ( $bytes , $precision ) . ' ' . $units[$pow];
    }

    /**
     * getDirSize  : Gets the size of the directory 
     * @param string $dir
     * @return string size
     */
    public static function getDirSize( $dir ) {
        $isWindows = strtoupper ( substr ( PHP_OS , 0 , 3 ) ) === 'WIN';

        if ( $isWindows ) {
            $obj = new COM ( 'scripting.filesystemobject' );

            if ( is_object ( $obj ) ) {
                $ref = $obj->getfolder ( $dir );
                $obj = null;
                return $ref->size;
            } else {
                return 'can not create object';
            }
        } else {

            $io = popen ( '/usr/bin/du -sk ' . $dir , 'r' );

            $size = fgets ( $io , 4096 );

            $size = substr ( $size , 0 , strpos ( $size , "\t" ) );
            pclose ( $io );
            return $size;
        }
    }

    /**
     * str_replace_first :  replaces the first occurrance of the /
     * @param string $search
     * @param type $to
     * @param type $subject
     * @return type
     */
    public static function str_replace_first( $search , $to , $subject ) {
        $search = '/' . preg_quote ( $search , '/' ) . '/';

        return preg_replace ( $search , $to , $subject , 1 );
    }

}
