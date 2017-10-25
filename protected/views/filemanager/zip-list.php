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
<div class="panel panel-default" id="zip_files">
    <div class="panel-heading">
        <div class="idows-txt idows-filelist-cell">Contents of Zip File : <strong><?=$zip?></strong></div></th>
    </div>
    <div class="panel panel-body container-fluid">
        <div class="idows-container-body">
            <div class="idows-filelist idows-last" style="border-width: 1px 0px 0px; left: 0px; width: inherit;">
                
                <div class="idows-filelist-body" style="width: inherit; height: inherit;">
                    <table>
                        <thead>
                            <tr>
                                <td class="idows-filelist-head-item" style="width: 31%;"></td>
                                <td class="idows-filelist-head-item" style="width: 6%;"></td>
                                <td class="idows-filelist-head-item" style="width: 5%"></td>
                                <td class="idows-filelist-head-item" style="width: 6%;"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $count = 0;
                            foreach ( $files as $item ) {
                                $ext = preg_replace ( '/^.*\./' , '' , $item['name'] );
                                ?>

                                    <!--        DISPLAY ALL FILES-->
                                    <tr class="idows-filelist-row" >
                                        <td>
                                            <div class="idows-file idows-txt idows-filelist-cell">
                                                <?=$item['icon']?>
                                                <span class="idows-txt idows-reset">
                                                    <?= htmlentities ( $item['name'] ) ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset">
                                                    <?= Helper::formatBytes ( $item['size'] , 2 ) ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?=$ext ?>">
                                                    <?= $ext ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="idows-txt idows-filelist-cell">
                                                <span class="idows-txt idows-reset" title="<?= $item['created_on'] ?>">
                                                    <?= $item['created_on'] ?>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php
                                $count++;
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
